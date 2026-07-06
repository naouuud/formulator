export type Option = { id: string; label: string; value: string | number };

export type OptionList = {
  id: string;
  options: Option[];
};

export const newOption = (label: string, value: string | number): Option => ({
  id: crypto.randomUUID(),
  label,
  value,
});

export const newOptionList = (): OptionList => ({
  id: crypto.randomUUID(),
  options: [] as Option[],
});
