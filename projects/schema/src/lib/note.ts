import { RichText } from './rich-text';

export type Note = {
  label: RichText;
};

export const newNote = (): Note => ({
  label: '',
});
