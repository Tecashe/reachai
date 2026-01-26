/**
 * Spintax Utility
 * Parsons and resolves spintax formatted strings: {Hi|Hello|Hey}
 */

/**
 * Resolves a spintax string into a single variation
 * @param text The text containing spintax
 * @param seed Optional seed for deterministic resolution (simple implementation)
 * @returns The resolved text
 */
export function resolveSpintax(text: string, seed: number = 0): string {
    // Simple seeded random function
    const random = (min: number, max: number, variationSeed: number) => {
        const x = Math.sin(seed + variationSeed) * 10000
        return Math.floor((x - Math.floor(x)) * (max - min)) + min
    }

    let variationIndex = 0

    // Recursive function to handle nested spintax
    const processSpintax = (input: string): string => {
        return input.replace(/\{([^{}]+)\}/g, (match, content) => {
            const choices = content.split("|")
            const index = seed
                ? random(0, choices.length, variationIndex++)
                : Math.floor(Math.random() * choices.length)
            return choices[index]
        })
    }

    let result = text
    // Handle nested spintax by processing until no braces remain (up to a limit to prevent infinite loops)
    let iterations = 0
    const maxIterations = 5 // Depth limit

    while (result.match(/\{([^{}]+)\}/) && iterations < maxIterations) {
        result = processSpintax(result)
        iterations++
    }

    return result
}

/**
 * Validates if the text contains valid spintax
 */
export function hasSpintax(text: string): boolean {
    return /\{([^{}]+)\|([^{}]+)\}/.test(text)
}

/**
 * Counts approximate number of variations
 * Warning: Can be very large for nested spintax
 */
export function countVariations(text: string): number {
    let count = 1
    const matches = text.matchAll(/\{([^{}]+)\}/g)

    for (const match of matches) {
        const choices = match[1].split("|")
        count *= choices.length
    }

    return count
}
