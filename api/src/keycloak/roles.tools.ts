/** Возвращает чистое название роли без префиксов */
export const getCleanRoleName = (role: string): string => role.split(':')[1];
