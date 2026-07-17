import { newPage, Page } from './page';

export type Schema = {
  title: string;
  pages: Page[];
};

export const newSchema = (): Schema => ({
  title: '',
  pages: [newPage()],
});
