import { describe, expect, it } from 'vitest';
import { newElement } from './element';
import { newOption } from './option';
import { newPage } from './page';
import { isOptionsQuestion } from './question';
import { schemaMeetsPublishingRequirements, newSchema, Schema } from './schema';

/** Minimal publishable schema: titled, one page, one labeled text question. */
function publishableSchema(overrides: Partial<Schema> = {}): Schema {
  const question = newElement({ elementType: 'question', htmlType: 'text' });
  question.el.label = 'Your name';

  const page = newPage();
  page.elements = [question];

  return {
    title: 'Customer feedback',
    pages: [page],
    ...overrides,
  };
}

describe('meetsPublishingRequirements', () => {
  it('returns true for a minimal valid schema', () => {
    expect(schemaMeetsPublishingRequirements(publishableSchema())).toBe(true);
  });

  it('returns false for a new empty schema', () => {
    expect(schemaMeetsPublishingRequirements(newSchema())).toBe(false);
  });

  it('returns false when the title is missing or whitespace-only', () => {
    expect(schemaMeetsPublishingRequirements(publishableSchema({ title: '' }))).toBe(false);
    expect(schemaMeetsPublishingRequirements(publishableSchema({ title: '   ' }))).toBe(false);
  });

  it('returns false when any page has no elements', () => {
    const emptyPage = newPage();
    const validPage = publishableSchema().pages[0];

    expect(schemaMeetsPublishingRequirements(publishableSchema({ pages: [emptyPage] }))).toBe(
      false,
    );
    expect(
      schemaMeetsPublishingRequirements(publishableSchema({ pages: [validPage, emptyPage] })),
    ).toBe(false);
  });

  it('returns false when there are no questions', () => {
    const note = newElement({ elementType: 'note' });
    note.el.label = 'Intro';

    const page = newPage();
    page.elements = [note];

    expect(schemaMeetsPublishingRequirements(publishableSchema({ pages: [page] }))).toBe(false);
  });

  it('returns false when a note or question label is empty or whitespace-only', () => {
    const note = newElement({ elementType: 'note' });
    note.el.label = '   ';

    const page = newPage();
    page.elements = [note, publishableSchema().pages[0].elements[0]];

    expect(schemaMeetsPublishingRequirements(publishableSchema({ pages: [page] }))).toBe(false);

    const question = newElement({ elementType: 'question', htmlType: 'text' });
    question.el.label = '';
    page.elements = [question];

    expect(schemaMeetsPublishingRequirements(publishableSchema({ pages: [page] }))).toBe(false);
  });

  it('returns false when an options question has no options', () => {
    const select = newElement({ elementType: 'question', htmlType: 'select' });
    select.el.label = 'Choose one';

    const page = newPage();
    page.elements = [select];

    expect(schemaMeetsPublishingRequirements(publishableSchema({ pages: [page] }))).toBe(false);
  });

  it('returns false when an option label is empty or whitespace-only', () => {
    const select = newElement({ elementType: 'question', htmlType: 'select' });
    select.el.label = 'Choose one';

    if (select.type === 'question' && isOptionsQuestion(select.el)) {
      select.el.options = [newOption('   ', 'a')];
    }

    const page = newPage();
    page.elements = [select];

    expect(schemaMeetsPublishingRequirements(publishableSchema({ pages: [page] }))).toBe(false);
  });

  it('returns true when an options question has labeled options', () => {
    const select = newElement({ elementType: 'question', htmlType: 'radio' });
    select.el.label = 'Rate us';

    if (select.type === 'question' && isOptionsQuestion(select.el)) {
      select.el.options = [newOption('Good', 'good'), newOption('Bad', 'bad')];
    }

    const page = newPage();
    page.elements = [select];

    expect(schemaMeetsPublishingRequirements(publishableSchema({ pages: [page] }))).toBe(true);
  });

  it('returns true when a question exists on a later non-empty page', () => {
    const notePage = newPage();
    const note = newElement({ elementType: 'note' });
    note.el.label = 'Welcome';
    notePage.elements = [note];

    const questionPage = publishableSchema().pages[0];

    expect(
      schemaMeetsPublishingRequirements(publishableSchema({ pages: [notePage, questionPage] })),
    ).toBe(true);
  });
});
