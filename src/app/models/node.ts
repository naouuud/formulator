import { trustedHTMLFromString } from '@angular/cdk/private';
import { Prop, PropType, PropValueMap } from './prop-types';

type NodeFactory = () => Node;
type NodeDto = {
  nodeType: NodeType;
  nodeId: ReturnType<typeof crypto.randomUUID>;
  props: Prop[];
  nodes: NodeDto[];
};

export enum GroupType {
  NONE = 'none',
}

export enum NodeType {
  NONE = 'none',
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  DATE = 'date',
  // Complex
  BIRTHDAY = 'birthday',
  GENDER = 'gender',
  PHONE = 'phone',
  EMAIL = 'email',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  NAME = 'name',
  ADDRESS = 'address',
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
    // if (nodeType == null) {
    //   // === undefined || === null
    //   throw new Error(`No NodeType available on saved model, unable to initialize node`);
    // }
    // if (!Object.values(NodeType).includes(nodeType)) {
    //   throw new Error(`Invalid NodeType '${nodeType}'`);
    // }
    const node = new Node();
    Object.assign(node, nodeDto);
    if (node.nodes.length) node.nodes = node.nodes.map((n: NodeDto) => Node.deserialize(n));
    return node;
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
}

const nodeMap = new Map<NodeType, NodeFactory>([
  [NodeType.TEXT, createTextNode],
  [NodeType.TEXTAREA, createTextareaNode],
  [NodeType.SELECT, createSelectNode],
  [NodeType.CHECKBOX, createCheckboxNode],
  [NodeType.RADIO, createRadioNode],
  [NodeType.DATE, createDateNode],
]);

// BASICS
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
  return new Node();
}
function createSelectNode(): Node {
  return new Node();
}
function createCheckboxNode(): Node {
  return new Node();
}
function createRadioNode(): Node {
  return new Node();
}
function createDateNode(): Node {
  return new Node();
}

//COMPLEX
export function createNameNode(): Node {
  const node = new Node();
  node.nodeType = NodeType.NAME;

  const firstName = Node.create(NodeType.TEXT);
  firstName.setProp(PropType.LABEL, 'First Name', false);
  firstName.setProp(PropType.PLACEHOLDER, 'Enter first name...');
  firstName.setProp(PropType.REQUIRED, true);
  firstName.setProp(PropType.MAXLENGTHCHAR, 100, false);

  const lastName = Node.create(NodeType.TEXT);
  lastName.setProp(PropType.LABEL, 'Last Name', false);
  lastName.setProp(PropType.PLACEHOLDER, 'Enter last name...');
  lastName.setProp(PropType.REQUIRED, true);
  lastName.setProp(PropType.MAXLENGTHCHAR, 100, false);

  node.nodes.push(firstName, lastName);
  return node;
}
