const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL;

export function getFileURL(
  file: File | string | null | undefined
): string | undefined {
  if (!file) return undefined;

  if (typeof file === "string") {
    return `${baseURL}/storage/${file}`;
  }

  return URL.createObjectURL(file);
}
