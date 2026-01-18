const getFilteredFiles = (files) => {
  return files.filter(
    (file) =>
      !file.includes('/dist/') &&
      !file.includes('/build/') &&
      !file.includes('/prismaClient/') &&
      !file.endsWith('.spec.ts')
  );
};

const frontActions = (files) => {
  const filtered = getFilteredFiles(files);
  if (!filtered.length) return [];
  return [
    `yarn workspace @placer/front eslint --fix ${filtered.join(' ')}`,
    `yarn workspace @placer/front prettier --write ${filtered.join(' ')}`,
  ];
};

const apiActions = (files) => {
  const filtered = getFilteredFiles(files);
  if (!filtered.length) return [];
  return [
    `yarn workspace @placer/api eslint --fix ${filtered.join(' ')}`,
    `yarn workspace @placer/api prettier --write ${filtered.join(' ')}`,
  ];
};

export default {
  'front/**/*.{ts,tsx,js,jsx}': frontActions,
  'api/**/*.{ts,tsx,js}': apiActions,
};
