export function cleanUrl(url: string) {
  return url
    .toLowerCase()
    .replace("https://", "")
    .replace("http://", "")
    .replace(/^(www\.)/, "");
}
