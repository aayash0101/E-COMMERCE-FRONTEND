const API_BASE = import.meta.env.VITE_API_URL as string;

export const SERVER_ORIGIN = API_BASE.replace(/\/api\/v1\/?$/, "");

export const getImageUrl = (path: string): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${SERVER_ORIGIN}${path}`;
};