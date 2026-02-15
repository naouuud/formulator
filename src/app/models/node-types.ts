import {
  createDateRange,
  createProp,
  Option,
  Prop,
  PropType,
  PropValueMap,
  todayString,
} from './prop-types';

export class EmptyOptionError extends Error {}
export class DuplicateOptionError extends Error {}
export const OPTION_OTHER_TEXT = 'Other (please specify)';
export const LABEL_MAX_LENGTH = 200;
export const OPTION_MAX_LENGTH = 50;

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
  EMAIL = 'email',
  PHONE = 'phone',
  GROUP = 'group',
}

export type NodeFactory = () => Node;

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

  addNodes(...nodes: Node[]): void {
    this.nodes.push(...nodes);
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
    const newProp = createProp(propTypeIn, valueIn, editableIn); // Enforces type correctness during construction
    this.props.push(newProp);
  }

  deleteProp(propType: PropType): void {
    const prop = this.props.find((p) => p.propType === propType);
    if (prop) {
      this.props.splice(this.props.indexOf(prop), 1);
    }
  }

  // Returns ref, can mutate directly
  getOptions(): Option[] {
    // console.log('template reevaluated');
    return this.getPropValue(PropType.OPTIONS) ?? [];
  }

  // Sets new array, never reference
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
    }
    if (this.nodeType === NodeType.CHECKBOX) {
      this.nodeType = NodeType.RADIO;
      return;
    }
  }

  // Class methods
  static nodeMap = new Map<NodeType, NodeFactory>([
    [NodeType.TEXT, Node.#createTextNode],
    [NodeType.TEXTAREA, Node.#createTextareaNode],
    [NodeType.NUMBER, Node.#createNumberNode],
    [NodeType.SELECT, Node.#createSelectNode],
    [NodeType.CHECKBOX, Node.#createCheckboxNode],
    [NodeType.RADIO, Node.#createRadioNode],
    [NodeType.DATE, Node.#createDateNode],
    [NodeType.EMAIL, Node.#createEmailNode],
    [NodeType.PHONE, Node.#createPhoneNode],
    [NodeType.GROUP, Node.#createGroupNode],
  ]);

  static create(nodeType: NodeType): Node {
    const factory = Node.nodeMap.get(nodeType);
    if (!factory) {
      throw new Error(
        `Internal Error: No factory registered for NodeType '${nodeType}'. Did you forget to add it to nodeMap?`,
      );
    }
    return factory();
  }

  static reorder(nodeList: Node[], fromIndex: number, toIndex: number): void {
    const [movedItem] = nodeList.splice(fromIndex, 1); // remove item
    nodeList.splice(toIndex, 0, movedItem); // insert at new index
  }

  static delete(nodeList: Node[], nodeId: string): void {
    const deleteNode = nodeList.find((n) => n.nodeId === nodeId);
    if (deleteNode === undefined) {
      throw Error(`No node with nodeId '${nodeId}' found to delete`);
    }
    const deleteIdx = nodeList.indexOf(deleteNode);
    nodeList.splice(deleteIdx, 1);
  }

  static append(nodeList: Node[], ...nodes: Node[]) {
    nodeList.push(...nodes);
  }

  static flat(...nodes: Node[]): Node[] {
    const allNodes: Node[] = [];
    const queue: Node[] = [];
    allNodes.push(...nodes);
    queue.push(...nodes);

    const iter = (queueRef: Node[]) => {
      const originalLength = queueRef.length;
      for (let i = 0; i < originalLength; i++) {
        const nextNode = queueRef.shift()!;
        allNodes.push(...nextNode.nodes);
        queueRef.push(...nextNode.nodes);
      }
      if (!queueRef.length) return allNodes;
      return iter(queueRef);
    };

    return iter(queue);
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

  // return Node ref - UNUSED
  static find(nodeId: string, ...nodes: Node[]): Node | null {
    const iter = (nodes: Node[]): Node | null => {
      const node = nodes.find((n) => n.nodeId === nodeId);
      if (node) return node;
      const newNodes: Node[] = [];
      nodes.forEach((n) => newNodes.push(...n.nodes));
      if (newNodes.length) return iter(newNodes);
      return null;
    };

    return iter(nodes);
  }

  // return Node[] ref - UNUSED
  static findList(nodeId: string, ...nodeLists: Node[][]): Node[] | null {
    const iter = (nodeLists: Node[][]): Node[] | null => {
      for (const nodeList of nodeLists) {
        const node = nodeList.find((n) => n.nodeId === nodeId);
        if (node) return nodeList;
      }
      const newList: Node[][] = [];
      nodeLists.forEach((nodeList) => {
        nodeList.forEach((n) => {
          newList.push(n.nodes);
        });
      });
      if (newList.length) return iter(newList);
      return null;
    };

    return iter(nodeLists);
  }

  // NODE FACTORIES
  static #createTextNode(): Node {
    const node = new Node();
    node.nodeType = NodeType.TEXT;
    node.setProp(PropType.LABEL, '');
    node.setProp(PropType.REQUIRED, true);
    node.setProp(PropType.MAXLENGTHCHAR, 100);
    node.setProp(PropType.PLACEHOLDER, 'Enter response here...');
    return node;
  }

  static #createTextareaNode(): Node {
    const node = new Node();
    node.nodeType = NodeType.TEXTAREA;
    node.setProp(PropType.LABEL, '');
    node.setProp(PropType.REQUIRED, true);
    node.setProp(PropType.MAXLENGTHWORD, 500);
    node.setProp(PropType.PLACEHOLDER, 'Enter response here...');
    return node;
  }

  static #createNumberNode(): Node {
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

  static #createSelectNode(): Node {
    const node = new Node();
    node.nodeType = NodeType.SELECT;
    node.setProp(PropType.LABEL, '');
    node.setProp(PropType.REQUIRED, true);
    node.setProp(PropType.OPTIONS, []);
    return node;
  }

  static #createRadioNode(): Node {
    const node = new Node();
    node.nodeType = NodeType.RADIO;
    node.setProp(PropType.LABEL, '');
    node.setProp(PropType.REQUIRED, true);
    node.setProp(PropType.OPTIONOTHER, false);
    node.setProp(PropType.OPTIONS, []);
    node.setProp(PropType.ALLOWTOGGLE, true);
    return node;
  }

  static #createCheckboxNode(): Node {
    const node = new Node();
    node.nodeType = NodeType.CHECKBOX;
    node.setProp(PropType.LABEL, '');
    node.setProp(PropType.REQUIRED, true);
    node.setProp(PropType.OPTIONOTHER, false);
    node.setProp(PropType.OPTIONS, []);
    node.setProp(PropType.ALLOWTOGGLE, true);
    return node;
  }

  static #createDateNode(): Node {
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

  static #createEmailNode(): Node {
    const node = new Node();
    node.nodeType = NodeType.EMAIL;
    node.setProp(PropType.LABEL, 'Email');
    node.setProp(PropType.REQUIRED, true);
    node.setProp(PropType.EMAIL, true);
    node.setProp(PropType.MAXLENGTHCHAR, 50, false);
    node.setProp(PropType.PLACEHOLDER, 'Enter your email...');
    return node;
  }

  static #createPhoneNode(): Node {
    const node = new Node();
    node.nodeType = NodeType.PHONE;
    node.setProp(PropType.LABEL, 'Phone number');
    node.setProp(PropType.REQUIRED, true);
    node.setProp(PropType.PATTERNPHONE, true);
    node.setProp(PropType.MAXLENGTHCHAR, 15, false);
    node.setProp(PropType.PLACEHOLDER, 'Enter phone number...');
    return node;
  }

  static #createGroupNode(): Node {
    const node = new Node();
    node.nodeType = NodeType.GROUP;
    node.setProp(PropType.LABEL, '');
    return node;
  }
}
