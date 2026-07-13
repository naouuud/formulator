import { describe, expect, it } from 'vitest';
import { isOptionsQuestion, newQuestion } from './question';

describe('newQuestion', () => {
  it('creates a text question without options', () => {
    const question = newQuestion('text');

    expect(question.htmlType).toBe('text');
    expect(isOptionsQuestion(question)).toBe(false);
  });

  it('creates a select question with an empty options array and string value type', () => {
    const question = newQuestion('select');

    expect(isOptionsQuestion(question)).toBe(true);
    if (isOptionsQuestion(question)) {
      expect(question.options).toEqual([]);
      expect(question.optionValueType).toBe('string');
    }
  });
});
