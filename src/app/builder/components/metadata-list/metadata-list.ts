import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { DomainStore } from '../../../../domain/store/domain-store';

@Component({
  selector: 'app-metadata-list',
  imports: [NgClass],
  templateUrl: './metadata-list.html',
})
export class MetadataList {
  protected readonly domainStore = inject(DomainStore);
}
