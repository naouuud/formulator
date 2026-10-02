import { isOptionBoolMapResponse, isStringResponse, RSchema } from '@formulator/schema';
import { collectQuestions, FormModel, isBoolMapAnswer, isStringAnswer } from './form.model';

export function formToRSchema(formModel: FormModel, rSchema: RSchema): RSchema {
  const updated = structuredClone(rSchema);
  const questions = collectQuestions(formModel);

  for (const response of updated.responses) {
    if (!(response.questionId in questions)) continue;
    const answer = questions[response.questionId];

    if (isStringResponse(response) && isStringAnswer(answer)) response.value = answer;

    if (isOptionBoolMapResponse(response)) {
      if (isStringAnswer(answer)) {
        // '' clears selection (all false); unknown non-empty ids skip this response (optionBoolMap stays as in input rSchema).
        if (answer !== '' && !(answer in response.optionBoolMap)) continue;
        for (const optionId in response.optionBoolMap) {
          response.optionBoolMap[optionId] = optionId === answer;
        }
      }
      if (isBoolMapAnswer(answer)) {
        for (const optionId in response.optionBoolMap) {
          if (!(optionId in answer)) continue;
          response.optionBoolMap[optionId] = answer[optionId];
        }
      }
    }
  }

  return updated;
}
