export type Option = { id: string; label: string; value: string };

export const newOption = (label: string, value: string): Option => ({
  id: crypto.randomUUID(),
  label,
  value,
});
