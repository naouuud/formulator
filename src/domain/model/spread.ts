import { isOptionsQuestion, Schema } from '@formulator/schema';

export type Spread = {
  readonly id: string;
  readonly spreadTitle: string;
  readonly version: number;
  /** @property Estimated completion time in minutes */
  readonly schema: Schema;
  readonly createdAt: Date;
  readonly lastModifiedAt: Date | null;
};

export function meetsPublishingRequirements(schema: Schema): boolean {
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
