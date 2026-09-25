import { Validators } from '@formulator/schema';
import { isUuid } from '../../utils/is-uuid';

interface BaseFieldConfig {
  questionId: string;
  required: boolean;
}

export type FieldConfig =
  | (BaseFieldConfig & { kind: 'string' })
  | (BaseFieldConfig & { kind: 'checkbox'; optionIds: string[] });

export type CheckboxRecord = Record<string, boolean>;

export type PageModel = Record<string, string | CheckboxRecord>;

export type FormModel = Record<string, PageModel>;

export type Answer = PageModel[string];

export const isStringAnswer = (v: Answer): v is string => typeof v === 'string';

export const newStringConfig = (questionId: string, validators: Validators): FieldConfig => {
  if (!isUuid(questionId)) {
    throw new Error(`Field name ${questionId} is not a valid UUID`);
  }
  return {
    kind: 'string',
    questionId,
    required: validators.required,
  };
};

export const newCheckboxConfig = (
  questionId: string,
  validators: Validators,
  optionIds: string[],
): FieldConfig => {
  if (!isUuid(questionId)) {
    throw new Error(`Field name ${questionId} is not a valid UUID`);
  }
  return {
    kind: 'checkbox',
    questionId,
    required: validators.required,
    optionIds,
  };
};

export type FormConfig = {
  [pageId: string]: FieldConfig[];
};
