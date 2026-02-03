import { createDateRange, Option, Prop, PropType, PropValueMap, todayString } from './prop-types';

export class EmptyOptionError extends Error {}
export class DuplicateOptionError extends Error {}
export const OPTION_OTHER_TEXT = 'Other (please specify)';
export const LABEL_MAX_LENGTH = 200;
export const OPTION_MAX_LENGTH = 50;

type NodeFactory = () => Node;
export type NodeDto = {
  nodeType: NodeType;
  nodeId: ReturnType<typeof crypto.randomUUID>;
  props: Prop[];
  nodes: NodeDto[];
};

export enum NodeType {
  NONE = 'none',
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  DATE = 'date',
  GROUP = 'group',
}

export class Node {
  nodeType: NodeType;
  nodeId: ReturnType<typeof crypto.randomUUID>;
  props: Prop[];
  nodes: Node[];

  constructor() {
    this.nodeType = NodeType.NONE;
    this.nodeId = crypto.randomUUID();
    this.props = [];
    this.nodes = [];
  }

  addNode(nodeType: NodeType) {
    const node = Node.create(nodeType);
    this.nodes.push(node);
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
      throw new EmptyOptionError('Option cannot be empty');
    }
    const options = this.getOptions();
    // check if duplicate
    for (let option of options) {
      if (optionIn === option) {
        throw new DuplicateOptionError(`Option '${optionIn} already exists'`);
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

  toggleRadioCheckbox(): void {
    if (this.nodeType === NodeType.RADIO) {
      this.nodeType = NodeType.CHECKBOX;
      return;
      // this.fields[0].fieldType = FieldType.CHECKBOX;
    }
    if (this.nodeType === NodeType.CHECKBOX) {
      this.nodeType = NodeType.RADIO;
      return;
      // this.fields[0].fieldType = FieldType.RADIO;
    }
  }

  static create(nodeType: NodeType): Node {
    const factory = nodeMap.get(nodeType);
    if (!factory) {
      throw new Error(
        `Internal Error: No factory registered for NodeType '${nodeType}'. Did you forget to add it to nodeMap?`,
      );
    }
    return factory();
  }

  static serialize(node: Node): NodeDto {
    const nodeDto: NodeDto = { ...node };
    nodeDto.nodes = (node.nodes ?? []).map((n: Node) => Node.serialize(n));
    return nodeDto;
  }

  static deserialize(nodeDto: NodeDto): Node {
    if (nodeDto.nodeType == null) {
      // === undefined || === null
      throw new Error(`No NodeType available on saved model, unable to initialize node`);
    }
    if (!Object.values(NodeType).includes(nodeDto.nodeType)) {
      throw new Error(`Invalid NodeType '${nodeDto.nodeType}'`);
    }
    const node = new Node();
    Object.assign(node, nodeDto);
    node.nodes = (node.nodes ?? []).map((n: NodeDto) => Node.deserialize(n));
    return node;
  }
}

const nodeMap = new Map<NodeType, NodeFactory>([
  [NodeType.TEXT, createTextNode],
  [NodeType.TEXTAREA, createTextareaNode],
  [NodeType.NUMBER, createNumberNode],
  [NodeType.SELECT, createSelectNode],
  [NodeType.CHECKBOX, createCheckboxNode],
  [NodeType.RADIO, createRadioNode],
  [NodeType.DATE, createDateNode],
  [NodeType.GROUP, createGroupNode],
]);

// SIMPLE
function createTextNode(): Node {
  const node = new Node();
  node.nodeType = NodeType.TEXT;
  node.setProp(PropType.LABEL, '');
  node.setProp(PropType.REQUIRED, true);
  node.setProp(PropType.MAXLENGTHCHAR, 100);
  node.setProp(PropType.PLACEHOLDER, 'Enter response here...');
  return node;
}

function createTextareaNode(): Node {
  const node = new Node();
  node.nodeType = NodeType.TEXTAREA;
  node.setProp(PropType.LABEL, '');
  node.setProp(PropType.REQUIRED, true);
  node.setProp(PropType.MAXLENGTHWORD, 500);
  node.setProp(PropType.PLACEHOLDER, 'Enter response here...');
  return node;
}

function createNumberNode(): Node {
  const node = new Node();
  node.nodeType = NodeType.NUMBER;
  node.setProp(PropType.LABEL, '', true);
  node.setProp(PropType.REQUIRED, true);
  node.setProp(PropType.PATTERNNUMBER, true);
  node.setProp(PropType.MAXLENGTHCHAR, 20, false);
  // node.setProp(PropType.MAXVALUE, 1_000_000_000);
  // node.setProp(PropType.MINVALUE, -1_000_000_000);
  node.setProp(PropType.PLACEHOLDER, 'Enter number...');
  return node;
}

function createSelectNode(): Node {
  const node = new Node();
  node.nodeType = NodeType.SELECT;
  node.setProp(PropType.LABEL, '');
  node.setProp(PropType.REQUIRED, true);
  node.setProp(PropType.OPTIONS, []);
  return node;
}

function createRadioNode(): Node {
  const node = new Node();
  node.nodeType = NodeType.RADIO;
  node.setProp(PropType.LABEL, '');
  node.setProp(PropType.REQUIRED, true);
  node.setProp(PropType.OPTIONOTHER, false);
  node.setProp(PropType.OPTIONS, []);
  return node;
}

function createCheckboxNode(): Node {
  const node = new Node();
  node.nodeType = NodeType.CHECKBOX;
  node.setProp(PropType.LABEL, '');
  node.setProp(PropType.REQUIRED, true);
  node.setProp(PropType.OPTIONOTHER, false);
  node.setProp(PropType.OPTIONS, []);
  return node;
}

function createDateNode(): Node {
  const node = new Node();
  node.nodeType = NodeType.DATE;
  node.setProp(PropType.LABEL, '');
  node.setProp(PropType.REQUIRED, true);
  const maxDateString = todayString();
  const minDateString = todayString(-100);
  const dateRange = createDateRange(maxDateString, minDateString); // use factory
  node.setProp(PropType.DATERANGE, dateRange);
  return node;
}

function createGroupNode(): Node {
  const node = new Node();
  node.nodeType = NodeType.GROUP;
  node.setProp(PropType.LABEL, 'Group Label');
  return node;
}

// COMPLEX
export function createNameNode(): Node {
  const node0 = new Node();
  node0.setProp(PropType.LABEL, 'Full Name');

  const node1a = Node.create(NodeType.TEXT);
  node1a.setProp(PropType.LABEL, 'First Name', false);
  node1a.setProp(PropType.PLACEHOLDER, 'Enter first name...');
  node1a.setProp(PropType.REQUIRED, true);
  node1a.setProp(PropType.MAXLENGTHCHAR, 100, false);

  const node1b = Node.create(NodeType.TEXT);
  node1b.setProp(PropType.LABEL, 'Last Name', false);
  node1b.setProp(PropType.PLACEHOLDER, 'Enter last name...');
  node1b.setProp(PropType.REQUIRED, true);
  node1b.setProp(PropType.MAXLENGTHCHAR, 100, false);

  node0.nodes.push(node1a, node1b);
  return node0;
}
