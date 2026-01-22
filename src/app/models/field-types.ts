import { createDateRange, Prop, PropType, PropValueMap, todayString } from './prop-types';

export type FieldFactory = () => Field;
export class EmptyOptionError extends Error {}
export class DuplicateOptionError extends Error {}
export type Option = string;
export const OptionOtherText = 'Other (please specify)';

export enum FieldType {
  NONE = 'none',
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  DATE = 'date',
}

export class Field {
  fieldType: FieldType = FieldType.NONE;
  fieldId = crypto.randomUUID();
  props: Prop[] = [];
  options: Option[] = [];

  addOption(optionIn: Option) {
    if (!optionIn.trim()) {
      throw new EmptyOptionError('Invalid option, must contain at least one character');
    }
    for (let option of this.options) {
      if (optionIn === option) {
        throw new DuplicateOptionError(`Duplicate option '${optionIn}'`);
      }
    }
    this.options.push(optionIn);
  }

  reorderOption(fromIndex: number, toIndex: number): void {
    const newArray = [...this.options];
    const [movedItem] = newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, movedItem);
    this.options = newArray;
  }

  deleteOption(idx: number) {
    this.options.splice(idx, 1);
  }

  // addOptionOther() {
  //   this.options.push(OPTION_OTHER_TEXT);
  // }

  // removeOptionOther() {
  //   const options = this.options;
  //   if (options.length) return;
  //   const lastOption = options[options.length - 1];
  //   if (lastOption !== OPTION_OTHER_TEXT) return;
  //   options.splice(options.length - 1, 1);
  // }

  getProp<K extends PropType>(propTypeIn: K): Extract<Prop, { propType: K }> | undefined {
    const prop = this.props.find((p) => p.propType === propTypeIn);
    if (prop) return prop as Extract<Prop, { propType: K }>;
    return;
  }

  getPropValue<K extends PropType>(propTypeIn: K): PropValueMap[K] | null {
    const prop = this.getProp(propTypeIn);
    if (prop) {
      return prop.value as PropValueMap[K];
    }
    return null;
  }

  setProp<K extends PropType>(propTypeIn: K, valueIn: PropValueMap[K], editableIn: boolean = true) {
    const existing = this.getProp(propTypeIn);
    if (existing) {
      existing.value = valueIn;
      existing.editable = editableIn;
      return;
    }
    this.props.push(this.#createProp(propTypeIn, valueIn, editableIn));
  }

  // 'squeeze' function to enforce type correctness during construction
  #createProp<K extends PropType>(
    propType: K,
    value: PropValueMap[K],
    editable: boolean,
  ): Extract<Prop, { propType: K }> {
    return { propType, value, editable } as Extract<Prop, { propType: K }>;
  }

  static create(fieldType: FieldType): Field {
    const factory = fieldMap.get(fieldType);
    if (!factory) {
      throw new Error(
        `Internal Error: No factory registered for fieldType '${fieldType}'. Did you forget to add it to groupMap?`,
      );
    }
    return factory();
  }

  static deserialize(serializedModel: any): Field | undefined {
    const fieldType = serializedModel.fieldType;
    if (fieldType == null) {
      // === undefined || === null
      throw new Error(`No groupType available on saved model, unable to initialize group`);
    }
    if (!Object.values(FieldType).includes(fieldType)) {
      throw new Error(`Invalid groupType '${fieldType}'`);
    }
    const field = Field.create(fieldType);
    Object.assign(field, serializedModel);
    return field;
  }
}

const fieldMap = new Map<FieldType, FieldFactory>([
  [FieldType.TEXT, createTextField],
  [FieldType.TEXTAREA, createTextareaField],
  [FieldType.SELECT, createSelectField],
  [FieldType.CHECKBOX, createCheckboxField],
  [FieldType.RADIO, createRadioField],
  [FieldType.DATE, createDateField],
]);

function createTextField(): Field {
  const field = new Field();
  field.fieldType = FieldType.TEXT;
  field.setProp(PropType.LABEL, '');
  field.setProp(PropType.REQUIRED, true);
  field.setProp(PropType.MAXLENGTHCHAR, 100);
  field.setProp(PropType.PLACEHOLDER, '');
  return field;
}

function createTextareaField(): Field {
  const field = new Field();
  field.fieldType = FieldType.TEXTAREA;
  field.setProp(PropType.LABEL, '');
  field.setProp(PropType.REQUIRED, true);
  field.setProp(PropType.MAXLENGTHWORD, 500);
  field.setProp(PropType.PLACEHOLDER, 'Enter your text...');
  return field;
}

function createSelectField(): Field {
  const field = new Field();
  field.fieldType = FieldType.SELECT;
  field.setProp(PropType.LABEL, '');
  field.setProp(PropType.REQUIRED, true);
  return field;
}

function createRadioField(): Field {
  const field = new Field();
  field.fieldType = FieldType.RADIO;
  field.setProp(PropType.LABEL, '');
  field.setProp(PropType.REQUIRED, true);
  field.setProp(PropType.OPTIONOTHER, false);

  return field;
}

function createCheckboxField(): Field {
  const field = new Field();
  field.fieldType = FieldType.CHECKBOX;
  field.setProp(PropType.LABEL, '');
  field.setProp(PropType.REQUIRED, true);
  field.setProp(PropType.OPTIONOTHER, false);
  return field;
}

function createDateField(): Field {
  const field = new Field();
  field.fieldType = FieldType.DATE;
  field.setProp(PropType.LABEL, '');
  field.setProp(PropType.REQUIRED, true);
  const maxDateString = todayString();
  const minDateString = todayString(-100);
  const dateRange = createDateRange(maxDateString, minDateString); // use factory
  field.setProp(PropType.DATERANGE, dateRange);
  return field;
}
