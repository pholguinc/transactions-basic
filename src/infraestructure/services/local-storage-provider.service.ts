import fs from 'fs/promises'
import path from 'path'
import type { IStorageProvider } from '../../domain/shared/interfaces/storage-provider.interface'

export class LocalStorageProvider implements IStorageProvider {
  async save(fileName: string, content: string | Buffer, folder: string): Promise<string> {
    const baseDir = path.join(process.cwd(), 'storage', folder)
    const filePath = path.join(baseDir, fileName)

    await fs.mkdir(baseDir, { recursive: true })
    await fs.writeFile(filePath, content)

    return filePath
  }
}
