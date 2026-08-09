import { QuestionElement } from './element';
import { Question } from './question';
import { Schema } from './schema';

export type RSchema = {
  responses: Response[];
};

export type Response = {
  questionId: string;
  value: string;
};

export const newRSchema = (schema: Schema): RSchema => ({
  responses: collectQuestions(schema).map((question) => ({ questionId: question.id, value: '' })),
});

/**
 * Validate newly created `RSchema`.
 */
export function validateRSchemaStructure(rSchema: RSchema, schema: Schema): boolean {
  const responses = rSchema.responses;
  const questions = collectQuestions(schema);

  const everyQuestionHasOneResponse = () => {
    const responsesByQuestionId = responses.map((response) => response.questionId);
    return (
      responsesByQuestionId.length === questions.length &&
      questions.every((element) => responsesByQuestionId.includes(element.id))
    );
  };

  if (!everyQuestionHasOneResponse) return false;

  return true;
}

/**
 * Validate `RSchema` at submission time.
 */
export function validateRSchema(rSchema: RSchema, schema: Schema): boolean {
  const responses = rSchema.responses;
  const questions = collectQuestions(schema);

  const everyQuestionHasOneResponse = () => {
    const responsesByQuestionId = responses.map((response) => response.questionId);
    return (
      responsesByQuestionId.length === questions.length &&
      questions.every((element) => responsesByQuestionId.includes(element.id))
    );
  };

  if (!everyQuestionHasOneResponse) return false;

  for (const response of responses) {
    const question = questions.find((q) => q.id === response.questionId)!.el;
    if (!validateRequired(question, response)) return false;
  }

  return true;
}

function validateRequired(question: Question, response: Response): boolean {
  return question.validators.required ? !!response.value.trim().length : true;
}

function collectQuestions(schema: Schema): QuestionElement[] {
  return schema.pages
    .flatMap((page) => page.elements)
    .filter((element): element is QuestionElement => element.type === 'question');
}
