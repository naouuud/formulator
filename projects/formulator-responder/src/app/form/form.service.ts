import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, Injector, runInInjectionContext, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  applyWhenValue,
  FieldTree,
  form,
  required,
  requiredError,
  SchemaFn,
  validate,
} from '@angular/forms/signals';
import { RSchema, Schema, validateFinalRSchema } from '@formulator/schema';
import { Router } from '@angular/router';
import { catchError, EMPTY, exhaustMap, finalize, Subject, tap } from 'rxjs';
import { SpillService } from '../../external/api/spill.service';
import { AppStore } from '../app-store';
import { isUuid } from '../../utils/is-uuid';
import { schemaToFormConfig } from './form-config.mapper';
import {
  BoolMap,
  FormConfig,
  FormModel,
  isBoolMapAnswer,
  isStringAnswer,
  PageModel,
} from './form.model';
import { formToRSchema } from './r-schema.mapper';
import { validationMessages } from './validation-messages';

export type SubmissionParameters = {
  rSchemaTemplate: RSchema;
  schema: Schema;
};

@Injectable()
export class FormService {
  private readonly injector = inject(Injector);
  private readonly appStore = inject(AppStore);
  private readonly spillService = inject(SpillService);
  private readonly router = inject(Router);

  #formModel = signal<FormModel>({});
  #fieldTree: FieldTree<FormModel> | null = null;
  #initializedFor: Schema | null = null;

  #submit$ = new Subject<void>();

  get fieldTree() {
    if (!this.#fieldTree) {
      throw new Error('Validation Service not initialized');
    }
    return this.#fieldTree;
  }

  constructor() {
    this.#submit$
      .pipe(
        takeUntilDestroyed(),
        exhaustMap(() => {
          const spillId = this.appStore.spillId();
          if (!isUuid(spillId)) {
            this.appStore.setSubmissionError('Missing or invalid spill Id');
            return EMPTY;
          }
          const rSchemaTemplate = this.appStore.rSchemaTemplate();
          if (!rSchemaTemplate) {
            this.appStore.setSubmissionError('No RSchema template found');
            return EMPTY;
          }
          const schema = this.appStore.schema();
          if (!schema) {
            this.appStore.setSubmissionError('No active Schema found');
            return EMPTY;
          }
          const rSchema = formToRSchema(this.#formModel(), rSchemaTemplate);
          if (!validateFinalRSchema(rSchema, schema)) {
            this.appStore.setSubmissionError('Invalid RSchema');
            return EMPTY;
          }
          this.appStore.clearSubmissionError();
          this.appStore.setSubmitting();
          return this.spillService.updateSpill(spillId, rSchema).pipe(
            tap(() => {
              void this.router.navigate(['/', spillId, 'complete']);
            }),
            catchError((err: HttpErrorResponse) => {
              this.appStore.setSubmissionError(`Submit error: ${err.message}`);
              return EMPTY;
            }),
            finalize(() => this.appStore.clearSubmitting()),
          );
        }),
      )
      .subscribe();
  }

  initialize(schema: Schema): void {
    if (schema === this.#initializedFor) return;
    this.#initializedFor = schema;

    runInInjectionContext(this.injector, () => {
      const formConfig = schemaToFormConfig(schema);
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
    const questionTree = this.fieldTree[pageId][questionId] as FieldTree<BoolMap>;
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
          case 'boolMap':
            const boolMap: BoolMap = {};
            for (const optionId of fieldConfig.optionIds) {
              boolMap[optionId] = false;
            }
            pageModel[fieldConfig.questionId] = boolMap;
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
          applyWhenValue(questionPath, isBoolMapAnswer, (boolMapPath) => {
            if (fieldConfig.required) {
              validate(boolMapPath, (ctx) => {
                const hasSelection = Object.values(ctx.value()).some(Boolean);
                if (hasSelection) {
                  return undefined;
                }
                return requiredError({ message: 'Select at least one option.' });
              });
            }
          });
        }
      }
    };
  }

  submit(): void {
    this.#submit$.next();
  }
}
