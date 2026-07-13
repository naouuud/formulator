import { newNote, Note } from './note';
import { HTMLType, newQuestion, Question } from './question';

export type BaseElement = {
  id: string;
};

export type NoteElement = BaseElement & {
  type: 'note';
  el: Note;
};

export type QuestionElement = BaseElement & {
  type: 'question';
  el: Question;
};

export type Element = NoteElement | QuestionElement;

export type CreateElementParams =
  | {
      elementType: 'note';
    }
  | {
      elementType: 'question';
      htmlType: HTMLType;
    };

export const newElement = (params: CreateElementParams): Element => {
  const id = crypto.randomUUID();
  return params.elementType === 'note'
    ? {
        id,
        type: params.elementType,
        el: newNote(),
      }
    : {
        id,
        type: params.elementType,
        el: newQuestion(params.htmlType),
      };
};

// export function isNote(el: Question | Note | null | undefined): el is Note {
//   return !!el && 'value' in el;
// }
