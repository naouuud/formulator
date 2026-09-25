import { describe, expect, it } from 'vitest';
import { isOptionsQuestion, newElement, newPage, newSchema } from '@formulator/schema';
import { schemaToFormConfig } from './form-config.mapper';

const PAGE_ID = 'bda33b8b-a223-4130-90f9-964eadfbb9a5';
const TEXT_Q_ID = '973b90e2-cdcc-43f8-9e7a-9e7d9afb6ab4';
const CHECKBOX_Q_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const OPT_A = '8dda9037-f5be-44d6-93c5-7f0b85383af3';
const OPT_B = '4418ec44-a2e7-4071-94c5-f51531a611e4';

describe('schemaToFormConfig', () => {
  it('maps pages with no questions to empty field lists', () => {
    const schema = newSchema();
    expect(schema.pages).toHaveLength(1);
    expect(schemaToFormConfig(schema)).toEqual({
      [schema.pages[0].id]: [],
    });
  });

  it('skips notes and maps question types on a page', () => {
    const text = newElement({ elementType: 'question', htmlType: 'text' });
    text.id = TEXT_Q_ID;
    text.el.validators.required = true;

    const radio = newElement({ elementType: 'question', htmlType: 'radio' });
    radio.id = '1443ae63-c3e6-4372-ad6c-89e58f774b2a';
    radio.el.validators.required = false;
    if (isOptionsQuestion(radio.el)) {
      radio.el.options = [{ id: OPT_A, label: 'A', value: 'A' }];
    }

    const note = newElement({ elementType: 'note' });

    const page = newPage();
    page.id = PAGE_ID;
    page.elements = [text, note, radio];

    const config = schemaToFormConfig({
      title: 'Test',
      pages: [page],
    });

    expect(Object.keys(config)).toEqual([PAGE_ID]);
    expect(config[PAGE_ID]).toEqual([
      { kind: 'string', questionId: TEXT_Q_ID, required: true },
      { kind: 'string', questionId: radio.id, required: false },
    ]);
  });

  it('maps checkbox questions with option ids', () => {
    const checkbox = newElement({ elementType: 'question', htmlType: 'checkbox' });
    checkbox.id = CHECKBOX_Q_ID;
    if (isOptionsQuestion(checkbox.el)) {
      checkbox.el.options = [
        { id: OPT_A, label: 'One', value: 'One' },
        { id: OPT_B, label: 'Two', value: 'Two' },
      ];
      checkbox.el.validators.required = true;
    }

    const page = newPage();
    page.id = PAGE_ID;
    page.elements = [checkbox];

    const config = schemaToFormConfig({ title: 'Test', pages: [page] });

    expect(config[PAGE_ID]).toEqual([
      {
        kind: 'checkbox',
        questionId: CHECKBOX_Q_ID,
        required: true,
        optionIds: [OPT_A, OPT_B],
      },
    ]);
  });

  it('maps select questions as string fields', () => {
    const select = newElement({ elementType: 'question', htmlType: 'select' });
    select.id = TEXT_Q_ID;
    select.el.validators.required = false;
    if (isOptionsQuestion(select.el)) {
      select.el.options = [{ id: OPT_A, label: 'Red', value: 'Red' }];
    }

    const page = newPage();
    page.id = PAGE_ID;
    page.elements = [select];

    const config = schemaToFormConfig({ title: 'Test', pages: [page] });

    expect(config[PAGE_ID][0]).toEqual({
      kind: 'string',
      questionId: TEXT_Q_ID,
      required: false,
    });
  });

  it('maps unsupported html types to string config', () => {
    const date = newElement({ elementType: 'question', htmlType: 'date' });
    date.id = TEXT_Q_ID;
    date.el.validators.required = false;

    const page = newPage();
    page.id = PAGE_ID;
    page.elements = [date];

    const config = schemaToFormConfig({ title: 'Test', pages: [page] });

    expect(config[PAGE_ID][0]).toEqual({
      kind: 'string',
      questionId: TEXT_Q_ID,
      required: false,
    });
  });

  it('builds config for multiple pages', () => {
    const page1 = newPage();
    page1.id = PAGE_ID;
    const q1 = newElement({ elementType: 'question', htmlType: 'text' });
    q1.id = TEXT_Q_ID;
    page1.elements = [q1];

    const page2 = newPage();
    page2.id = 'c1d2e3f4-a5b6-7890-cdef-123456789abc';
    const q2 = newElement({ elementType: 'question', htmlType: 'text' });
    q2.id = 'd4e5f6a7-b8c9-0123-def0-456789abcdef';
    page2.elements = [q2];

    const config = schemaToFormConfig({ title: 'Test', pages: [page1, page2] });

    expect(Object.keys(config).sort()).toEqual([PAGE_ID, page2.id].sort());
    expect(config[page1.id]).toHaveLength(1);
    expect(config[page2.id]).toHaveLength(1);
  });
});
