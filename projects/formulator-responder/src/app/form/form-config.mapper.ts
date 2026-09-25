import { isOptionsQuestion, Schema } from '@formulator/schema';
import { FormConfig, newCheckboxConfig, newStringConfig } from './form.model';

export function schemaToFormConfig(schema: Schema): FormConfig {
  const formConfig: FormConfig = {};
  for (const page of schema.pages) {
    const questionElements = page.elements.filter((e) => e.type === 'question');
    const fieldConfigs = questionElements.map((q) => {
      const htmlType = q.el.htmlType;
      switch (htmlType) {
        case 'text':
        case 'radio':
        case 'select':
          return newStringConfig(q.id, q.el.validators);
        case 'checkbox':
          return newCheckboxConfig(
            q.id,
            q.el.validators,
            q.el.options.map((o) => o.id),
          );
        default:
          return newStringConfig(q.id, q.el.validators);
      }
    });
    formConfig[page.id] = fieldConfigs;
  }
  return formConfig;
}
