import { Component, inject } from '@angular/core';
import { DomainStore } from '../../../../domain/store/domain-store';

@Component({
  selector: 'app-create-spread',
  imports: [],
  templateUrl: './create-spread.html',
})
export class CreateSpread {
  protected domainStore = inject(DomainStore);
}
