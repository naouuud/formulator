import { createDateRange, Option, Prop, PropType, PropValueMap, todayString } from './prop-types';

export type FieldDto = {
  fieldType: FieldType;
  fieldId: ReturnType<typeof crypto.randomUUID>;
  props: Prop[];
};

export type FieldFactory = () => Field;
export class EmptyOptionError extends Error {}
export class DuplicateOptionError extends Error {}
export const OPTION_OTHER_TEXT = 'Other (please specify)';
export const LABEL_MAX_LENGTH = 200;
export const OPTION_MAX_LENGTH = 50;

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

  // returns ref, can mutate directly
  getOptions(): Option[] {
    return this.getPropValue(PropType.OPTIONS) ?? [];
  }

  // always sets new array, never reference
  setOptions(newArray: Option[]): void {
    this.setProp(PropType.OPTIONS, [...newArray]);
  }

  addOption(optionIn: Option) {
    if (!optionIn.trim()) {
      throw new EmptyOptionError('Invalid option, must contain at least one character');
    }
    const options = this.getOptions();
    // check if duplicate
    for (let option of options) {
      if (optionIn === option) {
        throw new DuplicateOptionError(`Duplicate option '${optionIn}'`);
      }
    }
    options.push(optionIn); // direct mutation
  }

  reorderOption(fromIndex: number, toIndex: number): void {
    const options = this.getOptions();
    const [movedItem] = options.splice(fromIndex, 1);
    options.splice(toIndex, 0, movedItem);
  }

  deleteOption(idx: number) {
    const options = this.getOptions();
    options.splice(idx, 1);
  }

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

  static deserialize(fieldDto: FieldDto): Field {
    const fieldType = fieldDto.fieldType;
    if (fieldType == null) {
      // === undefined || === null
      throw new Error(`No groupType available on saved model, unable to initialize group`);
    }
    if (!Object.values(FieldType).includes(fieldType)) {
      throw new Error(`Invalid groupType '${fieldType}'`);
    }
    const field = Field.create(fieldType);
    Object.assign(field, fieldDto);
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
  field.setProp(PropType.PLACEHOLDER, 'Enter response here...');
  return field;
}

function createTextareaField(): Field {
  const field = new Field();
  field.fieldType = FieldType.TEXTAREA;
  field.setProp(PropType.LABEL, '');
  field.setProp(PropType.REQUIRED, true);
  field.setProp(PropType.MAXLENGTHWORD, 500);
  field.setProp(PropType.PLACEHOLDER, 'Enter response here...');
  return field;
}

function createSelectField(): Field {
  const field = new Field();
  field.fieldType = FieldType.SELECT;
  field.setProp(PropType.LABEL, '');
  field.setProp(PropType.REQUIRED, true);
  field.setProp(PropType.OPTIONS, []);
  return field;
}

function createRadioField(): Field {
  const field = new Field();
  field.fieldType = FieldType.RADIO;
  field.setProp(PropType.LABEL, '');
  field.setProp(PropType.REQUIRED, true);
  field.setProp(PropType.OPTIONOTHER, false);
  field.setProp(PropType.OPTIONS, []);
  return field;
}

function createCheckboxField(): Field {
  const field = new Field();
  field.fieldType = FieldType.CHECKBOX;
  field.setProp(PropType.LABEL, '');
  field.setProp(PropType.REQUIRED, true);
  field.setProp(PropType.OPTIONOTHER, false);
  field.setProp(PropType.OPTIONS, []);
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
