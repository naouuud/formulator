import { OptionsQuestion, Question } from './question';

export type Option = { id: string; label: string; value: string };

export type OptionBoolMap = Record<string, boolean>;

export const newOption = (label: string, value: string): Option => ({
  id: crypto.randomUUID(),
  label,
  value,
});

export const newOptionBoolMap = (options: Option[]) => {
  const ids = options.map((o) => o.id);
  const boolMap = {} as OptionBoolMap;
  for (const id of ids) {
    boolMap[id] = false;
  }
  return boolMap;
};

export const validateNewOptionBoolMap = (
  question: OptionsQuestion,
  boolMap: OptionBoolMap,
): boolean => validateOptionBoolMapShape(question, boolMap, (value) => value === false);

export const validateFinalOptionBoolMap = (
  question: OptionsQuestion,
  boolMap: OptionBoolMap,
): boolean => {
  if (!validateOptionBoolMapShape(question, boolMap, (value) => typeof value === 'boolean')) {
    return false;
  }

  if (!validateOptionBoolMapRequired(question, boolMap)) return false;

  return true;
};

function validateOptionBoolMapShape(
  question: OptionsQuestion,
  boolMap: OptionBoolMap,
  isValidValue: (value: boolean) => boolean,
): boolean {
  const optionIds = question.options.map((o) => o.id);
  let boolMapLength = 0;

  for (const id of Object.keys(boolMap)) {
    if (!optionIds.includes(id) || !isValidValue(boolMap[id])) return false;
    boolMapLength++;
  }

  if (optionIds.length !== boolMapLength || !optionIds.every((id) => id in boolMap)) return false;

  return true;
}

function validateOptionBoolMapRequired(question: Question, boolMap: OptionBoolMap): boolean {
  const trueCount = Object.values(boolMap).filter((value) => value).length;

  if (question.htmlType === 'checkbox') {
    if (question.validators.required && trueCount === 0) return false;
  } else {
    if (question.validators.required && trueCount !== 1) return false;
    else if (trueCount > 1) {
      return false;
    }
  }

  return true;
}
