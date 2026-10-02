import { describe, expect, it } from 'vitest';
import { newOptionBoolMap, RSchema } from '@formulator/schema';
import { formToRSchema } from './r-schema.mapper';
import { FormModel } from './form.model';

const PAGE_1 = 'bda33b8b-a223-4130-90f9-964eadfbb9a5';
const PAGE_2 = 'c1d33b8b-a223-4130-90f9-964eadfbb9a6';
const TEXT_Q = '973b90e2-cdcc-43f8-9e7a-9e7d9afb6ab4';
const CHECKBOX_Q = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const RADIO_Q = '1443ae63-c3e6-4372-ad6c-89e58f774b2a';
const SELECT_Q = '2554bf74-d4f7-5483-be7d-9af69f885c3b';
const OPT_A = '8dda9037-f5be-44d6-93c5-7f0b85383af3';
const OPT_B = '4418ec44-a2e7-4071-94c5-f51531a611e4';
const UNKNOWN_Q = '11111111-1111-1111-1111-111111111111';

function templateRSchema(): RSchema {
  return {
    responses: [
      { questionId: TEXT_Q, value: '' },
      {
        questionId: CHECKBOX_Q,
        optionBoolMap: newOptionBoolMap([
          { id: OPT_A, label: 'A', value: 'a' },
          { id: OPT_B, label: 'B', value: 'b' },
        ]),
      },
    ],
  };
}

describe('formToRSchema', () => {
  it('copies string answers into matching string responses', () => {
    const rSchema = templateRSchema();
    const formModel: FormModel = {
      [PAGE_1]: {
        [TEXT_Q]: 'hello',
      },
    };

    const result = formToRSchema(formModel, rSchema);

    const textResponse = result.responses.find((r) => r.questionId === TEXT_Q);
    expect(textResponse).toEqual({ questionId: TEXT_Q, value: 'hello' });
  });

  it('maps radio string answer (option id) to optionBoolMap', () => {
    const rSchema: RSchema = {
      responses: [
        {
          questionId: RADIO_Q,
          optionBoolMap: newOptionBoolMap([
            { id: OPT_A, label: 'A', value: 'a' },
            { id: OPT_B, label: 'B', value: 'b' },
          ]),
        },
      ],
    };
    const formModel: FormModel = {
      [PAGE_1]: { [RADIO_Q]: OPT_B },
    };

    const result = formToRSchema(formModel, rSchema);

    expect(result.responses[0]).toEqual({
      questionId: RADIO_Q,
      optionBoolMap: { [OPT_A]: false, [OPT_B]: true },
    });
  });

  it('maps select string answer (option id) to optionBoolMap', () => {
    const rSchema: RSchema = {
      responses: [
        {
          questionId: SELECT_Q,
          optionBoolMap: newOptionBoolMap([
            { id: OPT_A, label: 'One', value: 'one' },
            { id: OPT_B, label: 'Two', value: 'two' },
          ]),
        },
      ],
    };
    const formModel: FormModel = {
      [PAGE_1]: { [SELECT_Q]: OPT_A },
    };

    const result = formToRSchema(formModel, rSchema);

    expect(result.responses[0]).toEqual({
      questionId: SELECT_Q,
      optionBoolMap: { [OPT_A]: true, [OPT_B]: false },
    });
  });

  it('copies bool map answers into matching option responses', () => {
    const rSchema = templateRSchema();
    const formModel: FormModel = {
      [PAGE_1]: {
        [CHECKBOX_Q]: { [OPT_A]: true, [OPT_B]: false },
      },
    };

    const result = formToRSchema(formModel, rSchema);

    const checkboxResponse = result.responses.find((r) => r.questionId === CHECKBOX_Q);
    expect(checkboxResponse).toEqual({
      questionId: CHECKBOX_Q,
      optionBoolMap: { [OPT_A]: true, [OPT_B]: false },
    });
  });

  it('merges answers from multiple pages', () => {
    const rSchema = templateRSchema();
    const formModel: FormModel = {
      [PAGE_1]: { [TEXT_Q]: 'from page 1' },
      [PAGE_2]: { [CHECKBOX_Q]: { [OPT_A]: false, [OPT_B]: true } },
    };

    const result = formToRSchema(formModel, rSchema);

    expect(result.responses).toEqual([
      { questionId: TEXT_Q, value: 'from page 1' },
      {
        questionId: CHECKBOX_Q,
        optionBoolMap: { [OPT_A]: false, [OPT_B]: true },
      },
    ]);
  });

  it('does not mutate the input rSchema', () => {
    const rSchema = templateRSchema();
    const before = structuredClone(rSchema);
    const formModel: FormModel = {
      [PAGE_1]: {
        [TEXT_Q]: 'changed',
        [CHECKBOX_Q]: { [OPT_A]: true, [OPT_B]: true },
      },
    };

    formToRSchema(formModel, rSchema);

    expect(rSchema).toEqual(before);
  });

  it('ignores form answers with no matching response', () => {
    const rSchema = templateRSchema();
    const formModel: FormModel = {
      [PAGE_1]: {
        [UNKNOWN_Q]: 'orphan',
        [TEXT_Q]: 'kept',
      },
    };

    const result = formToRSchema(formModel, rSchema);

    expect(result.responses).toHaveLength(2);
    expect(result.responses.find((r) => r.questionId === TEXT_Q)).toEqual({
      questionId: TEXT_Q,
      value: 'kept',
    });
  });

  it('leaves responses unchanged when there is no matching form answer', () => {
    const rSchema = templateRSchema();
    const formModel: FormModel = {
      [PAGE_1]: {},
    };

    const result = formToRSchema(formModel, rSchema);

    expect(result).toEqual(rSchema);
  });

  it('leaves optionBoolMap unchanged when string answer is not a valid option id', () => {
    const rSchema: RSchema = {
      responses: [
        {
          questionId: RADIO_Q,
          optionBoolMap: newOptionBoolMap([{ id: OPT_A, label: 'A', value: 'a' }]),
        },
      ],
    };
    const formModel: FormModel = {
      [PAGE_1]: { [RADIO_Q]: 'not-an-option-id' },
    };

    const result = formToRSchema(formModel, rSchema);

    expect(result.responses[0]).toEqual(rSchema.responses[0]);
  });

  it('skips bool map form answers when the response is a string', () => {
    const rSchema: RSchema = {
      responses: [{ questionId: TEXT_Q, value: 'original' }],
    };
    const formModel: FormModel = {
      [PAGE_1]: { [TEXT_Q]: { [OPT_A]: true } },
    };

    const result = formToRSchema(formModel, rSchema);

    expect(result.responses[0]).toEqual({ questionId: TEXT_Q, value: 'original' });
  });

  it('only updates option ids that exist on the response', () => {
    const rSchema = templateRSchema();
    const unknownOpt = '99999999-9999-9999-9999-999999999999';
    const formModel: FormModel = {
      [PAGE_1]: {
        [CHECKBOX_Q]: { [OPT_A]: true, [unknownOpt]: true, [OPT_B]: false },
      },
    };

    const result = formToRSchema(formModel, rSchema);
    const checkboxResponse = result.responses.find((r) => r.questionId === CHECKBOX_Q);
    expect(checkboxResponse).toEqual({
      questionId: CHECKBOX_Q,
      optionBoolMap: { [OPT_A]: true, [OPT_B]: false },
    });
  });
});
