import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormRepoLocal } from '../../services/form-repo-local';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import { FORM_REPO } from '../../app.config';
import { IFormRepo } from '../../services/form-repo';

@Component({
  selector: 'app-builder-form-title',
  imports: [ReactiveFormsModule],
  templateUrl: './builder-form-title.html',
  styleUrl: './builder-form-title.css',
})
export class BuilderFormTitle implements OnInit, OnChanges {
  @Input() formTitle!: string;
  titleControl = new FormControl('');

  constructor(@Inject(FORM_REPO) private formRepo: IFormRepo) {}

  ngOnInit(): void {
    this.titleControl.valueChanges
      .pipe(filter((value) => value != null))
      .subscribe((value) => this.formRepo.setFormTitle_S(value));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.titleControl.setValue(this.formTitle, { emitEvent: false }); // No save
  }

  endEdit(event: Partial<KeyboardEvent>) {
    // event.preventDefault();
    (event.target as HTMLInputElement).blur();
  }
}
