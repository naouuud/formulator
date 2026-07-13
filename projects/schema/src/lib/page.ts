import { Element } from './element';

export interface Page {
  id: string;
  title: string;
  elements: Element[];
}

export const newPage = (): Page => ({
  id: crypto.randomUUID(),
  title: '',
  elements: [] as Element[],
});
