/// <reference lib="webworker" />

import { ImageData } from './types';

self.onmessage = async (event: MessageEvent<ImageData>) => {
  const { sourceFile, outputWidth, outputHeight } = event.data;

  try {
    if (!sourceFile.type.startsWith('image/')) {
      throw new Error('File is not an image');
    }

    // Читаем файл как ArrayBuffer
    const buffer = await sourceFile.arrayBuffer();
    const blob = new Blob([buffer], { type: sourceFile.type });

    // Создаём ImageBitmap (работает в worker’е)
    const imageBitmap = await createImageBitmap(blob);

    const { width: srcW, height: srcH } = imageBitmap;

    // Вычисляем, какую область исходного изображения взять (cover)
    const srcAspect = srcW / srcH;
    const dstAspect = outputWidth / outputHeight;

    let srcX = 0,
      srcY = 0,
      srcCropW = srcW,
      srcCropH = srcH;

    if (srcAspect > dstAspect) {
      // Исходник "шире" → обрезаем по ширине
      srcCropW = srcH * dstAspect;
      srcX = (srcW - srcCropW) / 2;
    } else {
      // Исходник "выше" → обрезаем по высоте
      srcCropH = srcW / dstAspect;
      srcY = (srcH - srcCropH) / 2;
    }

    // Создаём OffscreenCanvas нужного размера
    const canvas = new OffscreenCanvas(outputWidth, outputHeight);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D context not available');

    // Рисуем обрезанную и масштабированную область
    ctx.drawImage(
      imageBitmap,
      srcX,
      srcY,
      srcCropW,
      srcCropH, // источник
      0,
      0,
      outputWidth,
      outputHeight // назначение
    );

    // Создаем сжатый JPEG Blob
    const compressedBlob = await canvas.convertToBlob({
      type: 'image/jpeg',
      quality: 0.8,
    });

    // Готовим данные для передачи между потоками
    const arrayBuffer = await compressedBlob.arrayBuffer();

    // Отправляем обратно
    self.postMessage(
      {
        success: true,
        mimeType: compressedBlob.type,
        buffer: arrayBuffer,
      },
      [arrayBuffer]
    );
  } catch (error) {
    self.postMessage({
      success: false,
      error: (error as Error).message,
    });
  }
};
