export const buildUrl = (
  baseUrl: string,
  params: Record<string, string> = {}
) => {
  const url = new URL(baseUrl);
  const sp = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue; // игнорируем null/undefined
    if (Array.isArray(value)) {
      value.forEach((v) => sp.append(key, v));
    } else {
      sp.set(key, String(value)); // приводим к строке
    }
  }

  url.search = sp.toString();
  return url.href;
};
