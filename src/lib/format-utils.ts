export const formatRupiah = (value: number | string) => {
  const num = typeof value === "string" ? parseInt(value) : value;
  return num.toLocaleString("id-ID");
};

export const parseRupiah = (value: string) => {
  return parseInt(value.replace(/\./g, "")) || 0;
};
