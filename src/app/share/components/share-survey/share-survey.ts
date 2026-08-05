import { Component, effect, inject, signal, untracked } from '@angular/core';
import { DomainStore } from '../../../../domain/store/domain-store';

type ResponderField = 'email' | 'firstName' | 'lastName';

type ResponderDraft = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emptyResponder(): ResponderDraft {
  return {
    id: crypto.randomUUID(),
    email: '',
    firstName: '',
    lastName: '',
  };
}

@Component({
  selector: 'app-share-survey',
  imports: [],
  templateUrl: './share-survey.html',
})
export class ShareSurvey {
  protected readonly domainStore = inject(DomainStore);

  protected readonly responders = signal<ResponderDraft[]>([emptyResponder()]);
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly fieldErrors = signal<Record<string, Partial<Record<ResponderField, string>>>>(
    {},
  );

  private lastSnapId: string | undefined;

  constructor() {
    effect(() => {
      const snapId = this.domainStore.activeSnap()?.id;
      untracked(() => {
        if (snapId === this.lastSnapId) return;
        this.lastSnapId = snapId;
        this.resetForm();
      });
    });

    effect(() => {
      if (!this.submitting() || this.domainStore.createSpillsLoading()) return;

      untracked(() => {
        const error = this.domainStore.createSpillsError();
        if (error) {
          this.errorMessage.set(error);
          this.submitting.set(false);
          return;
        }

        this.submitting.set(false);
        this.resetForm();
      });
    });
  }

  protected addResponder(): void {
    this.responders.update((rows) => [...rows, emptyResponder()]);
    this.errorMessage.set(null);
  }

  protected removeResponder(id: string): void {
    if (this.responders().length <= 1) return;
    this.responders.update((rows) => rows.filter((row) => row.id !== id));
    this.clearFieldErrors(id);
    this.errorMessage.set(null);
  }

  protected updateField(id: string, field: ResponderField, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.responders.update((rows) =>
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
    this.clearFieldError(id, field);
    this.errorMessage.set(null);
  }

  protected fieldError(id: string, field: ResponderField): string | null {
    return this.fieldErrors()[id]?.[field] ?? null;
  }

  protected canSend(): boolean {
    return this.collectResponders().length > 0;
  }

  protected send(): void {
    if (this.submitting()) return;

    const validation = this.validate();
    if (!validation.valid) {
      this.fieldErrors.set(validation.fieldErrors);
      this.errorMessage.set(validation.message);
      return;
    }

    const snapId = this.domainStore.activeSnap()?.id;
    if (!snapId) {
      this.errorMessage.set('No published edition selected.');
      return;
    }

    this.fieldErrors.set({});
    this.errorMessage.set(null);
    this.submitting.set(true);
    this.domainStore.createSpills({ snapId, responders: validation.responders });
  }

  private resetForm(): void {
    this.responders.set([emptyResponder()]);
    this.submitting.set(false);
    this.errorMessage.set(null);
    this.fieldErrors.set({});
  }

  private collectResponders(): ResponderDraft[] {
    return this.responders().filter(
      (row) => row.email.trim() || row.firstName.trim() || row.lastName.trim(),
    );
  }

  private validate(): {
    valid: boolean;
    message: string | null;
    fieldErrors: Record<string, Partial<Record<ResponderField, string>>>;
    responders: { email: string; firstName?: string; lastName?: string }[];
  } {
    const rows = this.collectResponders();
    const fieldErrors: Record<string, Partial<Record<ResponderField, string>>> = {};
    let hasInvalidEmail = false;

    if (!rows.length) {
      return {
        valid: false,
        message: 'Add at least one responder with an email address.',
        fieldErrors,
        responders: [],
      };
    }

    const responders: { email: string; firstName?: string; lastName?: string }[] = [];

    for (const row of rows) {
      const email = row.email.trim();
      if (!email) {
        fieldErrors[row.id] = { ...fieldErrors[row.id], email: 'Email is required.' };
        hasInvalidEmail = true;
        continue;
      }
      if (!EMAIL_PATTERN.test(email)) {
        fieldErrors[row.id] = { ...fieldErrors[row.id], email: 'Enter a valid email address.' };
        hasInvalidEmail = true;
        continue;
      }

      responders.push({
        email,
        firstName: row.firstName.trim() || undefined,
        lastName: row.lastName.trim() || undefined,
      });
    }

    if (hasInvalidEmail) {
      return {
        valid: false,
        message: 'Fix the highlighted email addresses before sending.',
        fieldErrors,
        responders: [],
      };
    }

    return { valid: true, message: null, fieldErrors, responders };
  }

  private clearFieldErrors(id: string): void {
    this.fieldErrors.update((errors) => {
      const next = { ...errors };
      delete next[id];
      return next;
    });
  }

  private clearFieldError(id: string, field: ResponderField): void {
    this.fieldErrors.update((errors) => {
      const rowErrors = errors[id];
      if (!rowErrors?.[field]) return errors;
      const nextRowErrors = { ...rowErrors };
      delete nextRowErrors[field];
      const next = { ...errors };
      if (Object.keys(nextRowErrors).length) {
        next[id] = nextRowErrors;
      } else {
        delete next[id];
      }
      return next;
    });
  }
}
