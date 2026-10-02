import { describe, expect, it } from 'vitest';
import { isOptionsQuestion, newQuestion, OptionsQuestion } from './question';
import {
  newOptionBoolMap,
  validateFinalOptionBoolMap,
  validateNewOptionBoolMap,
  type Option,
  type OptionBoolMap,
} from './option';

const OPT_A = '8dda9037-f5be-44d6-93c5-7f0b85383af3';
const OPT_B = '4418ec44-a2e7-4071-94c5-f51531a611e4';
const OPT_C = 'd0fd213b-20a2-46fb-835c-f294d48f4051';
const UNKNOWN_UUID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
const NOT_A_UUID = 'not-a-valid-uuid';

function optionsQuestion(
  htmlType: 'checkbox' | 'radio' | 'select',
  options: Option[],
  settings?: { required?: boolean },
): OptionsQuestion {
  const question = newQuestion(htmlType);
  if (!isOptionsQuestion(question)) {
    throw new Error('expected options question');
  }
  question.options = options;
  if (settings?.required !== undefined) {
    question.validators.required = settings.required;
  }
  return question;
}

function fixedOptions(): Option[] {
  return [
    { id: OPT_A, label: 'One', value: 'One' },
    { id: OPT_B, label: 'Two', value: 'Two' },
    { id: OPT_C, label: 'Three', value: 'Three' },
  ];
}

function boolMapFrom(
  entries: Record<string, boolean>,
  options: Option[] = fixedOptions(),
): OptionBoolMap {
  const map = {} as OptionBoolMap;
  for (const opt of options) {
    map[opt.id] = entries[opt.id] ?? false;
  }
  return map;
}

describe('newOptionsBoolMap', () => {
  it('creates a map with every option id set to false', () => {
    const options = fixedOptions();
    expect(newOptionBoolMap(options)).toEqual({
      [OPT_A]: false,
      [OPT_B]: false,
      [OPT_C]: false,
    });
  });

  it('returns an empty map when there are no options', () => {
    expect(newOptionBoolMap([])).toEqual({});
  });
});

describe('validateNewOptionsBoolMap', () => {
  const question = optionsQuestion('checkbox', fixedOptions());

  it('accepts a bool map with exactly the question option ids and all false', () => {
    const boolMap = newOptionBoolMap(question.options);
    expect(validateNewOptionBoolMap(question, boolMap)).toBe(true);
  });

  it('rejects when a bool map key is not one of the question option ids', () => {
    const boolMap = boolMapFrom({ [OPT_A]: false, [OPT_B]: false, [OPT_C]: false });
    boolMap[UNKNOWN_UUID] = false;
    expect(validateNewOptionBoolMap(question, boolMap)).toBe(false);
  });

  it('rejects when a bool map key is not a valid option id shape (unknown id)', () => {
    const boolMap = boolMapFrom({ [OPT_A]: false, [OPT_B]: false, [OPT_C]: false });
    boolMap[NOT_A_UUID] = false;
    expect(validateNewOptionBoolMap(question, boolMap)).toBe(false);
  });

  it('rejects when the bool map is missing one or more option ids', () => {
    const boolMap = { [OPT_A]: false, [OPT_B]: false } as OptionBoolMap;
    expect(validateNewOptionBoolMap(question, boolMap)).toBe(false);
  });

  it('rejects when any value in the bool map is true', () => {
    const boolMap = boolMapFrom({
      [OPT_A]: true,
      [OPT_B]: false,
      [OPT_C]: false,
    });
    expect(validateNewOptionBoolMap(question, boolMap)).toBe(false);
  });
});

describe('validateFinalOptionsBoolMap', () => {
  describe('option id alignment', () => {
    const question = optionsQuestion('checkbox', fixedOptions());

    it('accepts a bool map with exactly the question option ids and boolean values', () => {
      const boolMap = boolMapFrom({
        [OPT_A]: false,
        [OPT_B]: true,
        [OPT_C]: false,
      });
      expect(validateFinalOptionBoolMap(question, boolMap)).toBe(true);
    });

    it('rejects when the bool map has too many keys', () => {
      const boolMap = boolMapFrom({
        [OPT_A]: false,
        [OPT_B]: false,
        [OPT_C]: false,
      });
      boolMap[UNKNOWN_UUID] = false;
      expect(validateFinalOptionBoolMap(question, boolMap)).toBe(false);
    });

    it('rejects when the bool map has too few keys', () => {
      const boolMap = { [OPT_A]: false, [OPT_B]: false } as OptionBoolMap;
      expect(validateFinalOptionBoolMap(question, boolMap)).toBe(false);
    });

    it('rejects when a key is not an option id on the question', () => {
      const boolMap = boolMapFrom({
        [OPT_A]: false,
        [OPT_B]: false,
        [OPT_C]: false,
      });
      boolMap[NOT_A_UUID] = false;
      expect(validateFinalOptionBoolMap(question, boolMap)).toBe(false);
    });
  });

  describe('bool map values', () => {
    const question = optionsQuestion('checkbox', fixedOptions());

    it('rejects when a map entry is not a boolean', () => {
      const boolMap = boolMapFrom({
        [OPT_A]: false,
        [OPT_B]: false,
        [OPT_C]: false,
      });
      (boolMap as Record<string, unknown>)[OPT_B] = 'true';
      expect(validateFinalOptionBoolMap(question, boolMap)).toBe(false);
    });
  });

  describe('checkbox', () => {
    describe('when optional', () => {
      const question = optionsQuestion('checkbox', fixedOptions(), { required: false });

      it('accepts none selected', () => {
        expect(validateFinalOptionBoolMap(question, newOptionBoolMap(question.options))).toBe(true);
      });

      it('accepts one selected', () => {
        const boolMap = boolMapFrom({
          [OPT_A]: true,
          [OPT_B]: false,
          [OPT_C]: false,
        });
        expect(validateFinalOptionBoolMap(question, boolMap)).toBe(true);
      });

      it('accepts multiple selected', () => {
        const boolMap = boolMapFrom({
          [OPT_A]: true,
          [OPT_B]: true,
          [OPT_C]: false,
        });
        expect(validateFinalOptionBoolMap(question, boolMap)).toBe(true);
      });
    });

    describe('when required', () => {
      const question = optionsQuestion('checkbox', fixedOptions(), { required: true });

      it('rejects none selected', () => {
        expect(validateFinalOptionBoolMap(question, newOptionBoolMap(question.options))).toBe(
          false,
        );
      });

      it('accepts one selected', () => {
        const boolMap = boolMapFrom({
          [OPT_A]: true,
          [OPT_B]: false,
          [OPT_C]: false,
        });
        expect(validateFinalOptionBoolMap(question, boolMap)).toBe(true);
      });

      it('accepts multiple selected', () => {
        const boolMap = boolMapFrom({
          [OPT_A]: true,
          [OPT_B]: true,
          [OPT_C]: false,
        });
        expect(validateFinalOptionBoolMap(question, boolMap)).toBe(true);
      });
    });
  });

  describe('radio', () => {
    describe('when required', () => {
      const question = optionsQuestion('radio', fixedOptions(), { required: true });

      it('accepts exactly one selected option', () => {
        const boolMap = boolMapFrom({
          [OPT_A]: false,
          [OPT_B]: true,
          [OPT_C]: false,
        });
        expect(validateFinalOptionBoolMap(question, boolMap)).toBe(true);
      });

      it('rejects none selected', () => {
        expect(validateFinalOptionBoolMap(question, newOptionBoolMap(question.options))).toBe(
          false,
        );
      });

      it('rejects more than one selected option', () => {
        const boolMap = boolMapFrom({
          [OPT_A]: true,
          [OPT_B]: true,
          [OPT_C]: false,
        });
        expect(validateFinalOptionBoolMap(question, boolMap)).toBe(false);
      });
    });

    describe('when optional', () => {
      const question = optionsQuestion('radio', fixedOptions(), { required: false });

      it('accepts none selected', () => {
        expect(validateFinalOptionBoolMap(question, newOptionBoolMap(question.options))).toBe(true);
      });

      it('accepts exactly one selected option', () => {
        const boolMap = boolMapFrom({
          [OPT_A]: false,
          [OPT_B]: true,
          [OPT_C]: false,
        });
        expect(validateFinalOptionBoolMap(question, boolMap)).toBe(true);
      });

      it('rejects more than one selected option', () => {
        const boolMap = boolMapFrom({
          [OPT_A]: true,
          [OPT_B]: true,
          [OPT_C]: false,
        });
        expect(validateFinalOptionBoolMap(question, boolMap)).toBe(false);
      });
    });
  });

  describe('select', () => {
    describe('when required', () => {
      const question = optionsQuestion('select', fixedOptions(), { required: true });

      it('accepts exactly one selected option', () => {
        const boolMap = boolMapFrom({
          [OPT_A]: true,
          [OPT_B]: false,
          [OPT_C]: false,
        });
        expect(validateFinalOptionBoolMap(question, boolMap)).toBe(true);
      });

      it('rejects none selected', () => {
        expect(validateFinalOptionBoolMap(question, newOptionBoolMap(question.options))).toBe(
          false,
        );
      });

      it('rejects more than one selected option', () => {
        const boolMap = boolMapFrom({
          [OPT_A]: true,
          [OPT_B]: true,
          [OPT_C]: false,
        });
        expect(validateFinalOptionBoolMap(question, boolMap)).toBe(false);
      });
    });

    describe('when optional', () => {
      const question = optionsQuestion('select', fixedOptions(), { required: false });

      it('accepts none selected', () => {
        expect(validateFinalOptionBoolMap(question, newOptionBoolMap(question.options))).toBe(true);
      });

      it('accepts exactly one selected option', () => {
        const boolMap = boolMapFrom({
          [OPT_A]: true,
          [OPT_B]: false,
          [OPT_C]: false,
        });
        expect(validateFinalOptionBoolMap(question, boolMap)).toBe(true);
      });

      it('rejects more than one selected option', () => {
        const boolMap = boolMapFrom({
          [OPT_A]: true,
          [OPT_B]: true,
          [OPT_C]: false,
        });
        expect(validateFinalOptionBoolMap(question, boolMap)).toBe(false);
      });
    });
  });
});
