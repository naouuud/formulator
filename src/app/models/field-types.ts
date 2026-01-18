import { Prop, PropType, PropValueMap } from './prop-types';

export type FieldFactory = () => Field;

export enum FieldType {
  NONE = 'none',
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  DATE = 'date',
}

export class EmptyOptionError extends Error {}
export class DuplicateOptionError extends Error {}

export class Field {
  fieldType: FieldType = FieldType.NONE;
  fieldId = crypto.randomUUID();
  props: Prop[] = [];
  options: Option[] = [];

  constructor() {
    this.setProp(PropType.LABEL, '');
    this.setProp(PropType.REQUIRED, true);
  }

  // toggleRadioCheckbox(): void {
  //   if (this.fieldType === FieldType.CHECKBOX) this.fieldType = FieldType.RADIO;
  //   if (this.fieldType === FieldType.RADIO) this.fieldType = FieldType.CHECKBOX;
  // }

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
    this.props.push(this._createProp(propTypeIn, valueIn, editableIn));
  }

  // 'squeeze' function to enforce type correctness during construction
  private _createProp<K extends PropType>(
    propType: K,
    value: PropValueMap[K],
    editable: boolean,
  ): Extract<Prop, { propType: K }> {
    return { propType, value, editable } as Extract<Prop, { propType: K }>;
  }

  static create(fieldType: FieldType): Field {
    const factory = Field.#getFactory(fieldType);
    return factory();
  }

  static fromJSON(json: any): Field | undefined {
    const fieldFactory = Field.#getFactory(json.fieldType);
    if (!fieldFactory) return;
    const field = fieldFactory();
    Object.assign(field, json);
    return field;
  }

  static #getFactory(fieldType: FieldType): FieldFactory {
    const fieldMap = new Map<FieldType, FieldFactory>([
      [FieldType.TEXT, createTextField],
      [FieldType.TEXTAREA, createTextareaField],
      [FieldType.SELECT, createSelectField],
      [FieldType.CHECKBOX, createCheckboxField],
      [FieldType.RADIO, createRadioField],
      [FieldType.DATE, createDateField],
    ]);
    const fieldFactory = fieldMap.get(fieldType);
    if (!fieldFactory) {
      throw new Error(
        `Internal Error: No factory registered for fieldType '${fieldType}'. Did you forget to add it to groupMap?`,
      );
    }
    return fieldFactory;
  }
}

// FACTORIES

function createTextField(): Field {
  const field = new Field();
  field.fieldType = FieldType.TEXT;
  field.setProp(PropType.MAXLENGTHCHAR, 100);
  // this.setProp(PropType.MINLENGTHCHAR, 0);
  field.setProp(PropType.PLACEHOLDER, '');
  return field;
}

// export class TextField extends Field {
//   fieldType: FieldType = FieldType.TEXT;

//   constructor() {
//     super();
//     this.setProp(PropType.MAXLENGTHCHAR, 100);
//     // this.setProp(PropType.MINLENGTHCHAR, 0);
//     this.setProp(PropType.PLACEHOLDER, '');
//   }
// }

function createTextareaField(): Field {
  const field = new Field();
  field.fieldType = FieldType.TEXTAREA;
  field.setProp(PropType.MAXLENGTHWORD, 500);
  // this.setProp(PropType.MINLENGTHWORD, 0);
  field.setProp(PropType.PLACEHOLDER, 'Enter your text...');
  return field;
}

// export class TextareaField extends Field {
//   fieldType: FieldType = FieldType.TEXTAREA;
//   constructor() {
//     super();
//     this.setProp(PropType.MAXLENGTHWORD, 500);
//     // this.setProp(PropType.MINLENGTHWORD, 0);
//     this.setProp(PropType.PLACEHOLDER, 'Enter your text...');
//   }
// }

export type Option = string;

function createSelectField(): Field {
  const field = new Field();
  field.fieldType = FieldType.SELECT;
  return field;
}

// export class SelectField extends Field {
//   fieldType: FieldType = FieldType.SELECT;
//   placeholder: string = '';
// }

function createRadioField(): Field {
  const field = new Field();
  field.fieldType = FieldType.RADIO;
  return field;
}

// export class RadioField extends Field {
//   fieldType: FieldType = FieldType.RADIO;
// }

function createCheckboxField(): Field {
  const field = new Field();
  field.fieldType = FieldType.CHECKBOX;
  return field;
}

// export class CheckBoxField extends Field {
//   fieldType: FieldType = FieldType.CHECKBOX;

//   constructor() {
//     super();
//     this.setProp(PropType.REQUIRED, false);
//   }
// }

function createDateField(): Field {
  const field = new Field();
  const year = new Date().getFullYear();
  field.setProp(PropType.MINYEARDISP, year - 100);
  field.setProp(PropType.MAXYEARDISP, year);
  field.setProp(PropType.MINDATE, '');
  field.setProp(PropType.MAXDATE, '');

  return field;
}

// export class DateField extends Field {
//   fieldType: FieldType = FieldType.DATE;

//   constructor() {
//     super();
//     const year = new Date().getFullYear();
//     this.setProp(PropType.MINYEARDISP, year - 100);
//     this.setProp(PropType.MAXYEARDISP, year);
//     this.setProp(PropType.MINDATE, '');
//     this.setProp(PropType.MAXDATE, '');
//   }
// }
