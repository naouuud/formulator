import { Prop, PropType, PropValueMap } from './prop-types';

export type FieldFactory = () => Field;

export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  DATE = 'date',
}

export const fieldMap = new Map<FieldType, FieldFactory>([
  [FieldType.TEXT, () => new TextField()],
  [FieldType.TEXTAREA, () => new TextareaField()],
  [FieldType.SELECT, () => new SelectField()],
  [FieldType.CHECKBOX, () => new CheckBoxField()],
  [FieldType.RADIO, () => new RadioField()],
  [FieldType.DATE, () => new DateField()],
]);

export abstract class Field {
  abstract fieldType: FieldType;
  fieldId = crypto.randomUUID();
  props: Prop[] = [];
  options: Option[] = [];

  constructor() {
    this.setProp(PropType.LABEL, '');
    this.setProp(PropType.REQUIRED, true);
  }

  // 'squeeze' function to enforce type correctness during construction
  private _createProp<K extends PropType>(
    propType: K,
    value: PropValueMap[K]
  ): Extract<Prop, { propType: K }> {
    return { propType, value } as Extract<Prop, { propType: K }>;
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

  setProp<K extends PropType>(propTypeIn: K, valueIn: PropValueMap[K]) {
    const existing = this.getProp(propTypeIn);
    if (existing) {
      existing.value = valueIn;
      return;
    }
    this.props.push(this._createProp(propTypeIn, valueIn));
  }

  static getFactory(fieldType: FieldType): FieldFactory {
    const fieldFactory = fieldMap.get(fieldType);
    if (!fieldFactory) {
      throw new Error(
        `Internal Error: No factory registered for fieldType '${fieldType}'. Did you forget to add it to groupMap?`
      );
    }
    return fieldFactory;
  }

  static fromJSON(json: any): Field | undefined {
    const fieldFactory = Field.getFactory(json.fieldType);
    if (!fieldFactory) return;
    const field = fieldFactory();
    Object.assign(field, json);
    return field;
  }
}

export class TextField extends Field {
  fieldType: FieldType = FieldType.TEXT;

  constructor() {
    super();
    this.setProp(PropType.MAXLENGTH, 100);
    this.setProp(PropType.MINLENGTH, 0);
    this.setProp(PropType.PLACEHOLDER, '');
  }
}

export class TextareaField extends TextField {
  override fieldType: FieldType = FieldType.TEXTAREA;

  constructor() {
    super();
    this.setProp(PropType.MAXLENGTH, 500);
    this.setProp(PropType.PLACEHOLDER, 'Enter your text...');
  }
}

type Option = {
  label: string;
  value: string;
};

export class SelectField extends Field {
  fieldType: FieldType = FieldType.SELECT;
  placeholder: string = '';
}

export class RadioField extends Field {
  fieldType: FieldType = FieldType.RADIO;
}

export class CheckBoxField extends Field {
  fieldType: FieldType = FieldType.CHECKBOX;

  constructor() {
    super();
    this.setProp(PropType.REQUIRED, false);
  }
}

export class DateField extends Field {
  fieldType: FieldType = FieldType.DATE;

  constructor() {
    super();
    const year = new Date().getFullYear();
    this.setProp(PropType.MINYEARDISP, year - 100);
    this.setProp(PropType.MAXYEARDISP, year);
    this.setProp(PropType.MINDATE, '');
    this.setProp(PropType.MAXDATE, '');
  }
}
