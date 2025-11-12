"use server"

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function getWarmupEmails() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  return db.warmupEmail.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function addWarmupEmail(data: {
  email: string
  name: string
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  imapHost: string
  imapPort: number
  imapUser: string
  imapPassword: string
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  // Verify email credentials before adding
  try {
    await verifyEmailCredentials(data)
  } catch (error) {
    throw new Error("Failed to verify email credentials. Please check your settings.")
  }

  const warmupEmail = await db.warmupEmail.create({
    data: {
      email: data.email,
      name: data.name,
      provider: "custom",
      smtpHost: data.smtpHost,
      smtpPort: data.smtpPort,
      smtpUsername: data.smtpUser,
      smtpPassword: data.smtpPassword,
      imapHost: data.imapHost,
      imapPort: data.imapPort,
      imapUsername: data.imapUser,
      imapPassword: data.imapPassword,
      isActive: true,
    },
  })

  revalidatePath("/dashboard/warmup")
  return warmupEmail
}

export async function deleteWarmupEmail(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  await db.warmupEmail.delete({
    where: { id },
  })

  revalidatePath("/dashboard/warmup")
}

export async function toggleWarmupEmail(id: string, isActive: boolean) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  await db.warmupEmail.update({
    where: { id },
    data: { isActive },
  })

  revalidatePath("/dashboard/warmup")
}

async function verifyEmailCredentials(data: {
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
}) {
  const nodemailer = require("nodemailer")

  const transporter = nodemailer.createTransport({
    host: data.smtpHost,
    port: data.smtpPort,
    secure: data.smtpPort === 465,
    auth: {
      user: data.smtpUser,
      pass: data.smtpPassword,
    },
  })

  await transporter.verify()
}
