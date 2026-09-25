import { inject, Injectable, Injector, runInInjectionContext, signal } from '@angular/core';
import { applyWhenValue, FieldTree, form, required, SchemaFn } from '@angular/forms/signals';
import { Schema } from '@formulator/schema';
import {
  CheckboxRecord,
  FormConfig,
  FormModel,
  isStringAnswer,
  newCheckboxConfig,
  newStringConfig,
  PageModel,
} from './form.model';
import { validationMessages } from './validation-messages';

@Injectable()
export class FormService {
  #formModel = signal<FormModel>({});
  #fieldTree: FieldTree<FormModel> | null = null;
  #initializedFor: Schema | null = null;

  get fieldTree() {
    if (!this.#fieldTree) {
      throw new Error('Validation Service not initialized');
    }
    return this.#fieldTree;
  }

  private readonly injector = inject(Injector);

  initialize(schema: Schema): void {
    if (schema === this.#initializedFor) return;
    this.#initializedFor = schema;

    runInInjectionContext(this.injector, () => {
      const formConfig = this.#schemaToFormConfig(schema);
      this.#formModel.set(this.#buildFormModel(formConfig));
      this.#fieldTree = form(this.#formModel, this.#buildSchemaFn(formConfig));
    });
  }

  getFieldState(pageId: string, elementId: string) {
    const field = this.fieldTree[pageId][elementId];
    if (!field) {
      throw new Error('Field not found in fieldTree');
    }
    return field();
  }

  asStringField(pageId: string, questionId: string) {
    const questionTree = this.fieldTree[pageId][questionId] as FieldTree<string>;
    if (!questionTree) {
      throw new Error('Field not found in fieldTree');
    }
    return questionTree;
  }

  asCheckboxOptionField(pageId: string, questionId: string, optionId: string) {
    const questionTree = this.fieldTree[pageId][questionId] as FieldTree<CheckboxRecord>;
    if (!questionTree) {
      throw new Error('Field not found in fieldTree');
    }
    const optionTree = questionTree[optionId];
    if (!optionTree) {
      throw new Error('Checkbox option not found in fieldTree');
    }
    return optionTree;
  }

  markPageTouched(pageId: string): void {
    const page = this.fieldTree[pageId];
    if (!page) {
      throw new Error('Field not found in fieldTree');
    }
    page().markAsTouched();
  }

  #buildFormModel(formConfig: FormConfig): FormModel {
    const formModel: FormModel = {};
    for (const [pageId, fieldConfigs] of Object.entries(formConfig)) {
      const pageModel: PageModel = {};
      for (const fieldConfig of fieldConfigs) {
        switch (fieldConfig.kind) {
          case 'string':
            pageModel[fieldConfig.questionId] = '';
            break;
          case 'checkbox':
            const checkBoxRecord: CheckboxRecord = {};
            for (const optionId of fieldConfig.optionIds) {
              checkBoxRecord[optionId] = false;
            }
            pageModel[fieldConfig.questionId] = checkBoxRecord;
            break;
        }
      }
      formModel[pageId] = pageModel;
    }
    return formModel;
  }

  #buildSchemaFn(formConfig: FormConfig): SchemaFn<FormModel> {
    return (path) => {
      for (const [pageId, fieldConfigs] of Object.entries(formConfig)) {
        const pagePath = path[pageId];
        for (const fieldConfig of fieldConfigs) {
          const questionPath = pagePath[fieldConfig.questionId];
          applyWhenValue(questionPath, isStringAnswer, (stringPath) => {
            if (fieldConfig.required) {
              required(stringPath, { message: validationMessages.required });
            }
          });
        }
      }
    };
  }

  #schemaToFormConfig(schema: Schema): FormConfig {
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
}
