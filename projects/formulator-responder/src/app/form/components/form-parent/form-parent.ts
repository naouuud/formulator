import { Component, computed, effect, inject, untracked } from '@angular/core';
import { AppStore } from '../../../../store/app-store';
import { FormService } from '../../form.service';
import { FormPage } from '../form-page/form-page';

@Component({
  selector: 'form-parent',
  imports: [FormPage],
  providers: [FormService],
  templateUrl: './form-parent.html',
})
export class FormParent {
  protected readonly formService = inject(FormService);
  protected readonly store = inject(AppStore);
  protected readonly activePageIdx = computed(() => this.store.activePageIdx());
  protected readonly schema = computed(() => {
    const schema = this.store.schema();
    if (!schema) {
      throw new Error('Schema is null');
    }
    return schema;
  });

  protected readonly pageNumber = computed(() => this.activePageIdx() + 1);
  protected readonly activePage = computed(() => this.schema().pages[this.activePageIdx()]);
  protected readonly pageTitle = computed(() => {
    const activePage = this.activePage();
    if (!activePage) return; // case: activePageIdx out of bounds, no TS check
    return activePage.title.trim() || `Page ${this.pageNumber()}`;
  });
  protected readonly hasMultiplePages = computed(() => {
    const schema = this.schema();
    return schema && schema.pages.length > 1;
  });

  protected readonly isFirstPage = computed(() => this.activePageIdx() === 0);
  protected readonly isLastPage = computed(() => {
    const activePageIdx = this.activePageIdx();
    const pagesLength = this.schema().pages.length;
    return activePageIdx >= (pagesLength ?? 0) - 1;
  });
  protected readonly pageValid = computed(() =>
    this.formService.fieldTree[this.activePage().id]().valid(),
  );
  protected readonly formValid = computed(() => this.formService.fieldTree().valid());

  constructor() {
    this.formService.initialize(this.schema());

    effect(() => {
      const schema = this.schema();
      untracked(() => this.formService.initialize(schema));
    });
  }

  nextPage(): void {
    if (!this.pageValid()) {
      this.formService.markPageTouched(this.activePage().id);
      return;
    }
    this.store.incrementPageIdx();
  }

  submit(): void {
    if (!this.pageValid()) {
      this.formService.markPageTouched(this.activePage().id);
      return;
    }
    if (!this.formValid()) {
      console.error('an error occurred');
      return;
    }
    console.log('form submitted');
  }
}
