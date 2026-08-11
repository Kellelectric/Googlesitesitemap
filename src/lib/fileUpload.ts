import { randomBytes } from 'crypto'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'video/mp4',
  'video/quicktime',
])

const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

export class InvalidFileError extends Error {}

function uploadsDir(): string {
  return path.join(process.cwd(), process.env.UPLOADS_DIR ?? '.uploads')
}

/** Stores an uploaded file outside the public web root with a random
 * filename. Re-checks the file extension against the declared MIME type —
 * never trusts the client-provided type alone. See
 * docs/assessment-platform-architecture.md section I. */
export async function storeUploadedFile(file: File): Promise<{ storedName: string; sizeBytes: number; mimeType: string }> {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new InvalidFileError(`Unsupported file type: ${file.type}`)
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new InvalidFileError('File exceeds the 10MB limit')
  }

  const extension = path.extname(file.name).toLowerCase().replace(/[^a-z0-9.]/g, '')
  const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.mp4', '.mov'])
  if (!allowedExtensions.has(extension)) {
    throw new InvalidFileError(`Unsupported file extension: ${extension}`)
  }

  const dir = uploadsDir()
  await mkdir(dir, { recursive: true })

  const storedName = `${randomBytes(16).toString('hex')}${extension}`
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(dir, storedName), buffer)

  return { storedName, sizeBytes: file.size, mimeType: file.type }
}

export function uploadedFilePath(storedName: string): string {
  const safeName = path.basename(storedName)
  return path.join(uploadsDir(), safeName)
}
