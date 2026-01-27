export interface ImageData {
  /** Входной файл */
  sourceFile: File;
  /** Нужные размеры на выходе (ширина) */
  outputWidth: number;
  /** Нужные размеры на выходе (высота) */
  outputHeight: number;
}

export interface WorkerOutput {
  mimeType: string;
  buffer: ArrayBuffer;
}
