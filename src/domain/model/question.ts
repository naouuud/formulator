import { newOptionList, OptionList } from './option';
import { RichText } from './rich-text';
import { Validators } from './validators';

export type HTMLType =
  | 'text'
  | 'select'
  | 'checkbox'
  | 'date'
  | 'date_time'
  | 'calendar_date'
  | 'clock_time';

interface BaseQuestion {
  label: RichText;
  htmlType: HTMLType;
  validators: Validators;
}

export type Question =
  | (BaseQuestion & {
      htmlType: 'text' | 'date' | 'date_time' | 'calendar_date' | 'clock_time';
    })
  | (BaseQuestion & {
      htmlType: 'select' | 'checkbox';
      optionList: OptionList;
    });

export const newQuestion = (htmlType: HTMLType): Question => {
  const validators: Validators = {
    required: true,
  };
  if (htmlType === 'select' || htmlType === 'checkbox') {
    return {
      label: '',
      htmlType,
      validators,
      optionList: newOptionList(),
    };
  } else {
    return {
      label: '',
      htmlType,
      validators,
    };
  }
};
