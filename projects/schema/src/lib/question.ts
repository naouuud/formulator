import { Option } from './option';
import { RichText } from './rich-text';
import { Validators } from './validators';

export type HTMLType =
  | 'text'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'date_time'
  | 'calendar_date'
  | 'clock_time';

export type OptionValueType = 'string' | 'number' | 'boolean';

interface BaseQuestion {
  label: RichText;
  htmlType: HTMLType;
  validators: Validators;
}

export type OptionsQuestion = BaseQuestion & {
  htmlType: 'select' | 'radio' | 'checkbox';
  optionValueType: OptionValueType;
  options: Option[];
};

export type Question =
  | (BaseQuestion & {
      htmlType: 'text' | 'date' | 'date_time' | 'calendar_date' | 'clock_time';
    })
  | OptionsQuestion;

export function isOptionsQuestion(q: Question): q is OptionsQuestion {
  return 'options' in q;
}

export const newQuestion = (htmlType: HTMLType): Question => {
  const validators: Validators = {
    required: true,
  };
  if (htmlType === 'select' || htmlType === 'radio' || htmlType === 'checkbox') {
    return {
      label: '',
      htmlType,
      validators,
      optionValueType: 'string',
      options: [] as Option[],
    };
  } else {
    return {
      label: '',
      htmlType,
      validators,
    };
  }
};
