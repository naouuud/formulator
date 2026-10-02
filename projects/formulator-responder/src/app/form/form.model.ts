import { Validators } from '@formulator/schema';
import { isUuid } from '../../utils/is-uuid';

export type FormModel = Record<string, PageModel>;

export type PageModel = Record<string, string | BoolMap>;

export type BoolMap = Record<string, boolean>;

export type Answer = PageModel[string];

export const isStringAnswer = (v: Answer): v is string => typeof v === 'string';
export const isBoolMapAnswer = (v: Answer): v is BoolMap => typeof v === 'object';

export type FormConfig = {
  [pageId: string]: FieldConfig[];
};

interface BaseFieldConfig {
  questionId: string;
  required: boolean;
}

export type FieldConfig =
  | (BaseFieldConfig & { kind: 'string' })
  | (BaseFieldConfig & { kind: 'boolMap'; optionIds: string[] });

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

export const newBoolMapConfig = (
  questionId: string,
  validators: Validators,
  optionIds: string[],
): FieldConfig => {
  if (!isUuid(questionId)) {
    throw new Error(`Field name ${questionId} is not a valid UUID`);
  }
  return {
    kind: 'boolMap',
    questionId,
    required: validators.required,
    optionIds,
  };
};

export const collectQuestions = (formModel: FormModel): PageModel => {
  let questions: PageModel = {};
  for (const page of Object.values(formModel)) {
    questions = { ...questions, ...page };
  }
  return questions;
};
