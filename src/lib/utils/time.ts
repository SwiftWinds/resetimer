export function padLeft(num: number, pad: string, length: number) {
  return (new Array(length + 1).join(pad) + num).slice(-length);
}

export default function formatSeconds(seconds: number) {
  return `${padLeft(Math.floor(seconds / 60), "0", 2)}:${padLeft(seconds % 60, "0", 2)}`;
}
