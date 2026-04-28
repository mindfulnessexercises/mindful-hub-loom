const DOWNLOAD_BUCKET = "download-assets";

export function getDownloadAssetUrl(path: string): string {
  if (!path || /^https?:\/\//i.test(path)) return path;

  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!baseUrl) return path;

  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${baseUrl}/storage/v1/object/public/${DOWNLOAD_BUCKET}/${normalizedPath}`;
}