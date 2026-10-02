import { describe, expect, it } from 'vitest';
import { newElement, QuestionElement } from './element';
import { newOptionBoolMap, type Option } from './option';
import { newPage } from './page';
import { isOptionsQuestion } from './question';
import {
  newRSchema,
  newResponse,
  validateFinalRSchema,
  validateNewRSchema,
  type Response,
  type RSchema,
} from './r-schema';
import type { Schema } from './schema';

const TEXT_Q_ID = '973b90e2-cdcc-43f8-9e7a-9e7d9afb6ab4';
const RADIO_Q_ID = '1443ae63-c3e6-4372-ad6c-89e58f774b2a';
const CHECKBOX_Q_ID = '9e8d9cae-e00d-4acc-97a6-7842f2ee43ff';
const OPT_A = '8dda9037-f5be-44d6-93c5-7f0b85383af3';
const OPT_B = '4418ec44-a2e7-4071-94c5-f51531a611e4';

function radioOptions(): Option[] {
  return [
    { id: OPT_A, label: 'Yes', value: 'Yes' },
    { id: OPT_B, label: 'No', value: 'No' },
  ];
}

function checkboxOptions(): Option[] {
  return [
    { id: OPT_A, label: 'A', value: 'A' },
    { id: OPT_B, label: 'B', value: 'B' },
  ];
}

type MixedFixture = {
  schema: Schema;
  text: QuestionElement;
  radio: QuestionElement;
  checkbox: QuestionElement;
};

function mixedSchema(settings?: {
  textRequired?: boolean;
  radioRequired?: boolean;
  checkboxRequired?: boolean;
}): MixedFixture {
  const text = newElement({ elementType: 'question', htmlType: 'text' });
  text.id = TEXT_Q_ID;
  text.el.label = 'Name';
  text.el.validators.required = settings?.textRequired ?? true;

  const radio = newElement({ elementType: 'question', htmlType: 'radio' });
  radio.id = RADIO_Q_ID;
  radio.el.label = 'Pick one';
  radio.el.validators.required = settings?.radioRequired ?? true;
  if (isOptionsQuestion(radio.el)) {
    radio.el.options = radioOptions();
  }

  const checkbox = newElement({ elementType: 'question', htmlType: 'checkbox' });
  checkbox.id = CHECKBOX_Q_ID;
  checkbox.el.label = 'Pick many';
  checkbox.el.validators.required = settings?.checkboxRequired ?? false;
  if (isOptionsQuestion(checkbox.el)) {
    checkbox.el.options = checkboxOptions();
  }

  const note = newElement({ elementType: 'note' });
  note.el.label = 'Disclaimer';

  const page = newPage();
  page.elements = [text, radio, checkbox, note];

  return {
    schema: { title: 'Survey', pages: [page] },
    text,
    radio,
    checkbox,
  };
}

function responseFor(questionEl: QuestionElement, patch?: Partial<Response>): Response {
  const base = newResponse(questionEl);
  return { ...base, ...patch } as Response;
}

function findResponse(rSchema: RSchema, questionId: string): Response {
  const response = rSchema.responses.find((r) => r.questionId === questionId);
  if (!response) throw new Error(`missing response for ${questionId}`);
  return response;
}

describe('validateNewRSchema', () => {
  it('accepts an rSchema from newRSchema when the schema has text and options questions and a note', () => {
    const { schema } = mixedSchema();
    const rSchema = newRSchema(schema);
    expect(validateNewRSchema(rSchema, schema)).toBe(true);
  });

  it('rejects when a question has no response', () => {
    const { schema } = mixedSchema();
    const rSchema = newRSchema(schema);
    rSchema.responses = rSchema.responses.filter((r) => r.questionId !== RADIO_Q_ID);
    expect(validateNewRSchema(rSchema, schema)).toBe(false);
  });

  it('rejects when there is an extra response for an unknown question id', () => {
    const { schema } = mixedSchema();
    const rSchema = newRSchema(schema);
    rSchema.responses.push({
      questionId: 'd4e5f6a7-b8c9-0123-def0-456789abcdef',
      value: '',
    });
    expect(validateNewRSchema(rSchema, schema)).toBe(false);
  });

  it('rejects duplicate responses for the same question when another question is missing', () => {
    const { schema, text } = mixedSchema();
    const rSchema = newRSchema(schema);
    rSchema.responses = [
      responseFor(text),
      responseFor(text),
      ...rSchema.responses.filter((r) => r.questionId !== TEXT_Q_ID),
    ].slice(0, 3);
    expect(validateNewRSchema(rSchema, schema)).toBe(false);
  });

  it('does not require responses for notes', () => {
    const { schema } = mixedSchema();
    const rSchema = newRSchema(schema);
    expect(rSchema.responses).toHaveLength(3);
    expect(validateNewRSchema(rSchema, schema)).toBe(true);
  });

  it('rejects a non-options response with a non-empty value', () => {
    const { schema, text } = mixedSchema();
    const rSchema = newRSchema(schema);
    Object.assign(findResponse(rSchema, text.id), { value: 'draft' });
    expect(validateNewRSchema(rSchema, schema)).toBe(false);
  });

  it('rejects a non-options response that uses optionBoolMap instead of value', () => {
    const { schema, text } = mixedSchema();
    const rSchema = newRSchema(schema);
    const idx = rSchema.responses.findIndex((r) => r.questionId === text.id);
    rSchema.responses[idx] = {
      questionId: text.id,
      optionBoolMap: newOptionBoolMap(radioOptions()),
    };
    expect(validateNewRSchema(rSchema, schema)).toBe(false);
  });

  it('rejects an options response when any optionBoolMap entry is true', () => {
    const { schema, radio } = mixedSchema();
    const rSchema = newRSchema(schema);
    const radioMap = findResponse(rSchema, radio.id);
    if ('optionBoolMap' in radioMap) {
      radioMap.optionBoolMap[OPT_A] = true;
    }
    expect(validateNewRSchema(rSchema, schema)).toBe(false);
  });

  it('rejects a checkbox options response when any optionBoolMap entry is true', () => {
    const { schema, checkbox } = mixedSchema();
    const rSchema = newRSchema(schema);
    const checkboxMap = findResponse(rSchema, checkbox.id);
    if ('optionBoolMap' in checkboxMap) {
      checkboxMap.optionBoolMap[OPT_B] = true;
    }
    expect(validateNewRSchema(rSchema, schema)).toBe(false);
  });
});

describe('validateFinalRSchema', () => {
  describe('cardinality', () => {
    it('rejects the same cardinality failures as validateNewRSchema', () => {
      const { schema } = mixedSchema();
      const rSchema = newRSchema(schema);
      rSchema.responses.pop();
      expect(validateFinalRSchema(rSchema, schema)).toBe(false);
    });
  });

  describe('text and other non-options questions', () => {
    it('rejects a required text question with an empty value', () => {
      const { schema } = mixedSchema({ textRequired: true });
      const rSchema = newRSchema(schema);
      expect(validateFinalRSchema(rSchema, schema)).toBe(false);
    });

    it('accepts a required text question with a non-empty value', () => {
      const { schema, text, radio, checkbox } = mixedSchema({
        textRequired: true,
        radioRequired: true,
        checkboxRequired: false,
      });
      const rSchema = newRSchema(schema);
      Object.assign(findResponse(rSchema, text.id), { value: 'Ada' });
      const radioMap = findResponse(rSchema, radio.id);
      if ('optionBoolMap' in radioMap) {
        radioMap.optionBoolMap[OPT_B] = true;
      }
      const checkboxMap = findResponse(rSchema, checkbox.id);
      if ('optionBoolMap' in checkboxMap) {
        expect(checkboxMap.optionBoolMap).toEqual(newOptionBoolMap(checkboxOptions()));
      }
      expect(validateFinalRSchema(rSchema, schema)).toBe(true);
    });

    it('accepts an optional text question with an empty value when options answers are valid', () => {
      const { schema, text, radio } = mixedSchema({
        textRequired: false,
        radioRequired: false,
        checkboxRequired: false,
      });
      const rSchema = newRSchema(schema);
      expect(findResponse(rSchema, text.id)).toMatchObject({ value: '' });
      const radioMap = findResponse(rSchema, radio.id);
      if ('optionBoolMap' in radioMap) {
        expect(radioMap.optionBoolMap[OPT_A]).toBe(false);
      }
      expect(validateFinalRSchema(rSchema, schema)).toBe(true);
    });

    it('rejects when a non-options response uses optionBoolMap instead of value', () => {
      const { schema, text } = mixedSchema({ textRequired: false, radioRequired: false });
      const rSchema = newRSchema(schema);
      const idx = rSchema.responses.findIndex((r) => r.questionId === text.id);
      rSchema.responses[idx] = {
        questionId: text.id,
        optionBoolMap: { x: false },
      };
      expect(validateFinalRSchema(rSchema, schema)).toBe(false);
    });
  });

  describe('options questions', () => {
    it('rejects when an options response has value instead of optionBoolMap', () => {
      const { schema, radio } = mixedSchema();
      const rSchema = newRSchema(schema);
      const idx = rSchema.responses.findIndex((r) => r.questionId === radio.id);
      rSchema.responses[idx] = { questionId: radio.id, value: 'Yes' };
      expect(validateFinalRSchema(rSchema, schema)).toBe(false);
    });

    it('rejects a required radio question with no selection', () => {
      const { schema } = mixedSchema({ textRequired: false, radioRequired: true });
      const rSchema = newRSchema(schema);
      expect(validateFinalRSchema(rSchema, schema)).toBe(false);
    });

    it('rejects a required checkbox question with no selection', () => {
      const { schema, text, radio } = mixedSchema({
        textRequired: false,
        radioRequired: false,
        checkboxRequired: true,
      });
      const rSchema = newRSchema(schema);
      Object.assign(findResponse(rSchema, text.id), { value: 'ok' });
      const radioMap = findResponse(rSchema, radio.id);
      if ('optionBoolMap' in radioMap) {
        expect(Object.values(radioMap.optionBoolMap).some(Boolean)).toBe(false);
      }
      expect(validateFinalRSchema(rSchema, schema)).toBe(false);
    });

    it('accepts valid final options maps for radio and checkbox', () => {
      const { schema, text, radio, checkbox } = mixedSchema({
        textRequired: true,
        radioRequired: true,
        checkboxRequired: true,
      });
      const rSchema = newRSchema(schema);
      Object.assign(findResponse(rSchema, text.id), { value: 'Answer' });

      const radioMap = findResponse(rSchema, radio.id);
      if ('optionBoolMap' in radioMap) {
        radioMap.optionBoolMap[OPT_A] = true;
      }

      const checkboxMap = findResponse(rSchema, checkbox.id);
      if ('optionBoolMap' in checkboxMap) {
        checkboxMap.optionBoolMap[OPT_A] = true;
        checkboxMap.optionBoolMap[OPT_B] = true;
      }

      expect(validateFinalRSchema(rSchema, schema)).toBe(true);
    });

    it('rejects a radio question with more than one option selected', () => {
      const { schema, text, radio } = mixedSchema({
        textRequired: false,
        radioRequired: false,
      });
      const rSchema = newRSchema(schema);
      Object.assign(findResponse(rSchema, text.id), { value: 'x' });
      const radioMap = findResponse(rSchema, radio.id);
      if ('optionBoolMap' in radioMap) {
        radioMap.optionBoolMap[OPT_A] = true;
        radioMap.optionBoolMap[OPT_B] = true;
      }
      expect(validateFinalRSchema(rSchema, schema)).toBe(false);
    });
  });
});
