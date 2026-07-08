import { TestBed } from '@angular/core/testing';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { of } from 'rxjs';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { SpreadService } from '../../external/api/spread.service';
import { UiStore } from '../../ui/store/ui-store';
import { QuestionElement } from '../model/element';
import { newElement } from '../model/element';
import { Option } from '../model/option';
import { newPage } from '../model/page';
import { isOptionsQuestion } from '../model/question';
import { Spread } from '../model/spread';
import { DomainStore } from './domain-store';

type TestFixtures = {
  spread: Spread;
  element: QuestionElement;
  optionA: Option;
  optionB: Option;
};

function createSelectQuestionFixtures(options?: Option[]): TestFixtures {
  const element = newElement({ elementType: 'question', htmlType: 'select' }) as QuestionElement;
  const optionA: Option = options?.[0] ?? { id: 'opt-a', label: 'Yes', value: 'Yes' };
  const optionB: Option = options?.[1] ?? { id: 'opt-b', label: 'No', value: 'No' };

  if (!isOptionsQuestion(element.el)) {
    throw new Error('Expected select question');
  }

  element.el.options = [optionA, optionB];

  const page = newPage();
  page.elements = [element];

  const spread: Spread = {
    id: 'spread-1',
    title: 'Test spread',
    version: 0,
    ectm: null,
    pages: [page],
    createdAt: null,
    lastModifiedAt: null,
  };

  return { spread, element, optionA, optionB };
}

function getQuestionOptions(store: InstanceType<typeof DomainStore>): Option[] {
  const element = store.activeSpread()?.pages[0].elements[0];
  if (element?.type !== 'question' || !isOptionsQuestion(element.el)) {
    throw new Error('Expected options question');
  }
  return element.el.options;
}

function setActiveSpread(
  store: InstanceType<typeof DomainStore>,
  spread: Spread,
  activePageIdx = 0,
): void {
  patchState(unprotected(store), { activeSpread: spread, activePageIdx });
}

describe('DomainStore.editOption', () => {
  let store: InstanceType<typeof DomainStore>;
  let fixtures: TestFixtures;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        DomainStore,
        {
          provide: SpreadService,
          useValue: {
            update: vi.fn(() => of({})),
            getAll: vi.fn(),
            getById: vi.fn(),
            create: vi.fn(),
            delete: vi.fn(),
          },
        },
        {
          provide: UiStore,
          useValue: {
            startSpreadSaving: vi.fn(),
            stopSpreadSaving: vi.fn(),
            clearSpreadSavingError: vi.fn(),
            setSpreadSavingError: vi.fn(),
            setDeleteSpreadError: vi.fn(),
            clearDeleteSpreadError: vi.fn(),
          },
        },
      ],
    });

    store = TestBed.inject(DomainStore);
  });

  beforeEach(() => {
    fixtures = createSelectQuestionFixtures();
    setActiveSpread(store, fixtures.spread);
  });

  it('updates the label and value of an existing option', () => {
    store.editOption(fixtures.element.id, fixtures.optionA.id, 'Yeah', 'Yeah');

    const options = getQuestionOptions(store);
    expect(options.find((o) => o.id === fixtures.optionA.id)).toEqual({
      id: 'opt-a',
      label: 'Yeah',
      value: 'Yeah',
    });
    expect(options.find((o) => o.id === fixtures.optionB.id)).toEqual(fixtures.optionB);
  });

  it('does not change state when label and value are unchanged', () => {
    const before = structuredClone(getQuestionOptions(store));

    store.editOption(fixtures.element.id, fixtures.optionA.id, 'Yes', 'Yes');

    expect(getQuestionOptions(store)).toEqual(before);
  });

  it('rejects a duplicate label from another option', () => {
    store.editOption(fixtures.element.id, fixtures.optionA.id, 'No', 'Maybe');

    const options = getQuestionOptions(store);
    expect(options.find((o) => o.id === fixtures.optionA.id)).toEqual(fixtures.optionA);
  });

  it('rejects a duplicate value from another option', () => {
    store.editOption(fixtures.element.id, fixtures.optionA.id, 'Maybe', 'No');

    const options = getQuestionOptions(store);
    expect(options.find((o) => o.id === fixtures.optionA.id)).toEqual(fixtures.optionA);
  });

  it('allows changing only the value when the label stays the same', () => {
    fixtures = createSelectQuestionFixtures([
      { id: 'opt-a', label: 'United States', value: 'US' },
      { id: 'opt-b', label: 'Canada', value: 'CA' },
    ]);
    setActiveSpread(store, fixtures.spread);

    store.editOption(fixtures.element.id, 'opt-a', 'United States', 'USA');

    const options = getQuestionOptions(store);
    expect(options.find((o) => o.id === 'opt-a')).toEqual({
      id: 'opt-a',
      label: 'United States',
      value: 'USA',
    });
  });

  it('rejects an empty label', () => {
    store.editOption(fixtures.element.id, fixtures.optionA.id, '   ', 'Yes');

    expect(getQuestionOptions(store).find((o) => o.id === fixtures.optionA.id)).toEqual(
      fixtures.optionA,
    );
  });

  it('does nothing when the option id does not exist', () => {
    const before = structuredClone(getQuestionOptions(store));

    store.editOption(fixtures.element.id, 'missing-id', 'New', 'New');

    expect(getQuestionOptions(store)).toEqual(before);
  });
});
