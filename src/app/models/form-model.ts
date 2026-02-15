import { Node, NodeDto } from './node-types';

export type FormModelDto = {
  formId: ReturnType<typeof crypto.randomUUID>;
  formTitle: string;
  nodes: NodeDto[];
};

export class FormModel {
  formId: ReturnType<typeof crypto.randomUUID>;
  formTitle: string;
  nodes: Node[];

  constructor() {
    this.formId = crypto.randomUUID();
    this.formTitle = '';
    this.nodes = [];
  }

  setFormTitle(value: string): void {
    this.formTitle = value.trim();
  }

  // Apply domain checks here
  static serialize(formModel: FormModel): FormModelDto {
    const formModelDto: FormModelDto = { ...formModel };
    formModelDto.nodes = (formModel.nodes ?? []).map((n) => Node.serialize(n));
    return formModelDto;
  }

  static deserialize(formModelDto: FormModelDto): FormModel {
    const formModel = new FormModel();
    Object.assign(formModel, formModelDto);
    formModel.nodes = (formModelDto.nodes ?? []).map((n) => Node.deserialize(n));
    return formModel;
  }
}
