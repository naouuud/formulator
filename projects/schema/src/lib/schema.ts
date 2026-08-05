import { newPage, Page } from './page';
import { isOptionsQuestion } from './question';

export type Schema = {
  title: string;
  pages: Page[];
};

export const newSchema = (): Schema => ({
  title: '',
  pages: [newPage()],
});
