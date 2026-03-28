export function resolveLocalFileUrl(relativePath: string) {
  const baseUrl = window.location.href.split("#")[0];
  return new URL(relativePath, baseUrl).toString();
}