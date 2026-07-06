import { RichText } from './rich-text';

export type Note = {
  value: RichText;
};

export const newNote = (): Note => ({
  value: '',
});
