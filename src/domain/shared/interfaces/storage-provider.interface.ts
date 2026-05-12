export interface IStorageProvider {
  /**
   * Guarda un contenido en el storage y devuelve la ruta o URL
   * @param fileName Nombre del archivo
   * @param content Contenido (Buffer o string)
   * @param folder Carpeta de destino
   */
  save(fileName: string, content: string | Buffer, folder: string): Promise<string>
}
