export type Option = { id: string; label: string; value: string | number | boolean };

export const newOption = (label: string, value: string | number | boolean): Option => ({
  id: crypto.randomUUID(),
  label,
  value,
});
