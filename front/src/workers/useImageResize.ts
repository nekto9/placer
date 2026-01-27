import { useCallback } from 'react';
import { ImageData, WorkerOutput } from './types';

export function useImageResize() {
  const processImage = useCallback(
    (input: ImageData): Promise<WorkerOutput> => {
      return new Promise((resolve, reject) => {
        const url = new URL('./imageResize.worker.ts', import.meta.url);
        const worker = new Worker(url, { type: 'module' });

        worker.onmessage = (e) => {
          worker.terminate();
          if (e.data.success) {
            resolve(e.data);
          } else {
            reject(new Error(e.data.error));
          }
        };

        worker.onerror = (err) => {
          worker.terminate();
          reject(err);
        };

        worker.postMessage(input);
      });
    },
    []
  );

  return { processImage };
}
