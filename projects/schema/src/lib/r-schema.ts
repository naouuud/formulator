import { QuestionElement } from './element';
import {
  newOptionBoolMap,
  OptionBoolMap,
  validateFinalOptionBoolMap,
  validateNewOptionBoolMap,
} from './option';
import { isOptionsQuestion, OptionsQuestion, Question } from './question';
import { Schema } from './schema';

export type RSchema = {
  responses: Response[];
};

type BaseResponse = {
  questionId: string;
};

export type StringResponse = BaseResponse & {
  value: string;
};

export type OptionBoolResponse = BaseResponse & {
  optionBoolMap: OptionBoolMap;
};

export type Response = StringResponse | OptionBoolResponse;

export const isStringResponse = (response: Response): response is StringResponse => {
  return (
    'value' in response && typeof response.value === 'string' && !('optionBoolMap' in response)
  );
};

export const isOptionBoolMapResponse = (response: Response): response is OptionBoolResponse => {
  return 'optionBoolMap' in response && !('value' in response);
};

export function newResponse(questionEl: QuestionElement): Response {
  switch (questionEl.el.htmlType) {
    case 'text':
      return {
        questionId: questionEl.id,
        value: '',
      };
    case 'select':
    case 'radio':
    case 'checkbox':
      return {
        questionId: questionEl.id,
        optionBoolMap: newOptionBoolMap(questionEl.el.options),
      };
    default:
      return {
        questionId: questionEl.id,
        value: '',
      };
  }
}

const validateNewStringResponse = (response: Response): boolean => {
  if (!isStringResponse(response) || response.value !== '') return false;
  return true;
};

const validateNewOptionBoolResponse = (question: OptionsQuestion, response: Response): boolean =>
  isOptionBoolMapResponse(response) && validateNewOptionBoolMap(question, response.optionBoolMap);

const validateFinalOptionBoolResponse = (question: OptionsQuestion, response: Response): boolean =>
  isOptionBoolMapResponse(response) && validateFinalOptionBoolMap(question, response.optionBoolMap);

export const newRSchema = (schema: Schema): RSchema => ({
  responses: collectQuestions(schema).map((questionEl) => newResponse(questionEl)),
});

/**
 * Validate newly created `RSchema`.
 */
export function validateNewRSchema(rSchema: RSchema, schema: Schema): boolean {
  const responses = rSchema.responses;
  const questions = collectQuestions(schema);

  if (!everyQuestionHasOneResponse(responses, questions)) return false;

  for (const response of responses) {
    const question = questions.find((q) => q.id === response.questionId)!.el;
    if (isOptionsQuestion(question)) {
      if (!validateNewOptionBoolResponse(question, response)) return false;
    } else {
      if (!validateNewStringResponse(response)) return false;
    }
  }

  return true;
}

/**
 * Validate `RSchema` at submission time.
 */
export function validateFinalRSchema(rSchema: RSchema, schema: Schema): boolean {
  const responses = rSchema.responses;
  const questions = collectQuestions(schema);

  if (!everyQuestionHasOneResponse(responses, questions)) return false;

  for (const response of responses) {
    const question = questions.find((q) => q.id === response.questionId)!.el;
    if (isOptionsQuestion(question)) {
      if (!validateFinalOptionBoolResponse(question, response)) return false;
    } else {
      if (!isStringResponse(response)) return false;
      if (!validateStringRequired(question, response)) return false;
    }
  }

  return true;
}

function everyQuestionHasOneResponse(responses: Response[], questionEls: QuestionElement[]) {
  const responsesByQuestionId = responses.map((response) => response.questionId);
  return (
    responsesByQuestionId.length === questionEls.length &&
    questionEls.every((questionEl) => responsesByQuestionId.includes(questionEl.id))
  );
}

function validateStringRequired(question: Question, response: StringResponse): boolean {
  return question.validators.required ? !!response.value.trim().length : true;
}

function collectQuestions(schema: Schema): QuestionElement[] {
  return schema.pages
    .flatMap((page) => page.elements)
    .filter((element): element is QuestionElement => element.type === 'question');
}
