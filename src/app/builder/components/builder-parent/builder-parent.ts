import { Component, inject } from '@angular/core';
import { DomainStore } from '../../../../domain/store/domain-store';
import { CreateSpread } from '../create-spread/create-spread';
import { MetadataList } from '../metadata-list/metadata-list';
import { PageCanvas } from '../page-canvas/page-canvas';
import { SpreadHeader } from '../spread-header/spread-header';

@Component({
  selector: 'app-builder-parent',
  imports: [CreateSpread, MetadataList, SpreadHeader, PageCanvas],
  templateUrl: './builder-parent.html',
})
export class BuilderParent {
  protected readonly domainStore = inject(DomainStore);
}
