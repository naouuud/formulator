import { Prop, PropType, PropValueMap } from './prop-types';

type NodeFactory = () => Node;
export type NodeDto = {
  nodeType: NodeType;
  nodeId: ReturnType<typeof crypto.randomUUID>;
  props: Prop[];
  nodes: NodeDto[];
};

export enum NodeType {
  // Simple
  NONE = 'none',
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  DATE = 'date',
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
  [NodeType.SELECT, createSelectNode],
  [NodeType.CHECKBOX, createCheckboxNode],
  [NodeType.RADIO, createRadioNode],
  [NodeType.DATE, createDateNode],
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
