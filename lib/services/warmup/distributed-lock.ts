import { redis, REDIS_KEYS } from '@/lib/redis'
import { logger } from '@/lib/logger'

export class DistributedLock {
  private readonly DEFAULT_TTL = 300 // 5 minutes
  private readonly EXTEND_THRESHOLD = 0.7 // Extend lock at 70% of TTL

  /**
   * Acquire a distributed lock
   * Returns lock ID if successful, null if already locked
   */
  async acquire(
    resourceId: string,
    ttlSeconds: number = this.DEFAULT_TTL
  ): Promise<string | null> {
    const lockKey = `${REDIS_KEYS.ACCOUNT_LOCK}${resourceId}`
    const lockId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    try {
      // SET NX (only if not exists) with expiry
      const result = await redis.set(lockKey, lockId, {
        nx: true,
        ex: ttlSeconds,
      })

      if (result === 'OK') {
        logger.debug('Lock acquired', { resourceId, lockId, ttl: ttlSeconds })
        return lockId
      }

      logger.debug('Lock already held', { resourceId })
      return null
    } catch (error) {
      logger.error('Failed to acquire lock', error as Error, { resourceId })
      return null
    }
  }

  /**
   * Release a lock
   * Only releases if the lock ID matches (prevents releasing someone else's lock)
   */
  async release(resourceId: string, lockId: string): Promise<boolean> {
    const lockKey = `${REDIS_KEYS.ACCOUNT_LOCK}${resourceId}`

    try {
      // Lua script for atomic check-and-delete
      const script = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
        else
          return 0
        end
      `

      const result = await redis.eval(script, [lockKey], [lockId])

      if (result === 1) {
        logger.debug('Lock released', { resourceId, lockId })
        return true
      }

      logger.warn('Lock not released - ID mismatch', { resourceId, lockId })
      return false
    } catch (error) {
      logger.error('Failed to release lock', error as Error, { resourceId })
      return false
    }
  }

  /**
   * Extend a lock's TTL
   */
  async extend(
    resourceId: string,
    lockId: string,
    additionalSeconds: number
  ): Promise<boolean> {
    const lockKey = `${REDIS_KEYS.ACCOUNT_LOCK}${resourceId}`

    try {
      // Lua script for atomic check-and-extend
      const script = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("expire", KEYS[1], ARGV[2])
        else
          return 0
        end
      `

      const result = await redis.eval(
        script,
        [lockKey],
        [lockId, additionalSeconds.toString()]
      )

      return result === 1
    } catch (error) {
      logger.error('Failed to extend lock', error as Error, { resourceId })
      return false
    }
  }

  /**
   * Check if a resource is locked
   */
  async isLocked(resourceId: string): Promise<boolean> {
    const lockKey = `${REDIS_KEYS.ACCOUNT_LOCK}${resourceId}`

    try {
      const exists = await redis.exists(lockKey)
      return exists === 1
    } catch (error) {
      logger.error('Failed to check lock', error as Error, { resourceId })
      return false
    }
  }

  /**
   * Get remaining TTL for a lock
   */
  async getTTL(resourceId: string): Promise<number> {
    const lockKey = `${REDIS_KEYS.ACCOUNT_LOCK}${resourceId}`

    try {
      const ttl = await redis.ttl(lockKey)
      return ttl > 0 ? ttl : 0
    } catch (error) {
      logger.error('Failed to get lock TTL', error as Error, { resourceId })
      return 0
    }
  }

  /**
   * Force release all locks (use with caution!)
   */
  async releaseAll(pattern: string = '*'): Promise<number> {
    try {
      const keys = await redis.keys(`${REDIS_KEYS.ACCOUNT_LOCK}${pattern}`)
      
      if (keys.length === 0) return 0

      await redis.del(...keys)
      
      logger.warn('Force released all locks', { count: keys.length, pattern })
      return keys.length
    } catch (error) {
      logger.error('Failed to release all locks', error as Error)
      return 0
    }
  }
}

export const distributedLock = new DistributedLock()