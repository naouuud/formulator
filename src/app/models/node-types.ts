import { createDateRange, Option, Prop, PropType, PropValueMap, todayString } from './prop-types';

export class EmptyOptionError extends Error {}
export class DuplicateOptionError extends Error {}
export const OPTION_OTHER_TEXT = 'Other (please specify)';
export const LABEL_MAX_LENGTH = 200;
export const OPTION_MAX_LENGTH = 50;

export type NodeDto = {
  nodeType: NodeType;
  nodeId: ReturnType<typeof crypto.randomUUID>;
  props: Prop[];
  children: NodeDto[];
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
  EMAIL = 'email',
  PHONE = 'phone',
}

export class Node {
  nodeType: NodeType;
  nodeId: ReturnType<typeof crypto.randomUUID>;
  props: Prop[];
  children: Node[];

  constructor() {
    this.nodeType = NodeType.NONE;
    this.nodeId = crypto.randomUUID();
    this.props = [];
    this.children = [];
  }

  // addNode(nodeType: NodeType) {
  //   const node = Node.create(nodeType);
  //   this.nodes.push(node);
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
      // this.nodes[0].nodeType = FieldType.CHECKBOX;
    }
    if (this.nodeType === NodeType.CHECKBOX) {
      this.nodeType = NodeType.RADIO;
      return;
      // this.nodes[0].nodeType = FieldType.RADIO;
    }
  }

  // static create(nodeType: NodeType): Node {
  //   const factory = nodeMap.get(nodeType);
  //   if (!factory) {
  //     throw new Error(
  //       `Internal Error: No factory registered for NodeType '${nodeType}'. Did you forget to add it to nodeMap?`,
  //     );
  //   }
  //   return factory();
  // }

  static serialize(node: Node): NodeDto {
    const nodeDto: NodeDto = { ...node };
    nodeDto.children = (node.children ?? []).map((n: Node) => Node.serialize(n));
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
    node.children = (node.children ?? []).map((n: NodeDto) => Node.deserialize(n));
    return node;
  }

  static flatten(...nodes: Node[]): Node[] {
    const allNodes: Node[] = [];
    const queue: Node[] = [];
    allNodes.push(...nodes);
    queue.push(...nodes);

    const iter = (queueRef: Node[]) => {
      const originalLength = queueRef.length;
      for (let i = 0; i < originalLength; i++) {
        const nextNode = queueRef.shift()!;
        allNodes.push(...nextNode.children);
        queueRef.push(...nextNode.children);
      }
      if (!queueRef.length) return allNodes;
      return iter(queueRef);
    };

    return iter(queue);
  }
}
