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

export function meetsPublishingRequirements(schema: Schema): boolean {
  if (!schema.title.trim().length) return false;

  let questionCount = 0;

  for (const page of schema.pages) {
    if (!page.elements.length) return false;

    for (const element of page.elements) {
      if (!element.el.label.trim().length) return false;

      if (element.type === 'question') {
        questionCount++;
        const el = element.el;
        if (isOptionsQuestion(el)) {
          if (!el.options.length) return false;
          for (const option of el.options) {
            if (!option.label.trim().length) return false;
          }
        }
      }
    }
  }

  return questionCount > 0;
}
