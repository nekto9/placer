/** Аплоадер */
export const getUploaderEndpoints = () => ({
  uploadAvatar: {
    invalidatesTags: ['getUsers'],
    query: (data: { body: { avatar: File; fileId: string } }) => {
      const formData = new FormData();
      formData.append('avatar', data.body.avatar);
      formData.append('fileId', data.body.fileId);

      return {
        url: '/api/v1/upload/avatar',
        method: 'POST',
        body: formData,
      };
    },
  },

  uploadCover: {
    invalidatesTags: ['getPlaces'],
    query: (data: { body: { cover: File[]; fileIds: string[] } }) => {
      const formData = new FormData();

      // Добавляем массив id файлов
      for (let i = 0; i < data.body.fileIds.length; i++) {
        formData.append('fileIds', data.body.fileIds[i]);
      }

      // Добавляем все выбранные файлы
      for (let i = 0; i < data.body.cover.length; i++) {
        formData.append('cover', data.body.cover[i]);
      }

      return {
        url: '/api/v1/upload/cover',
        method: 'POST',
        body: formData,
      };
    },
  },
});
