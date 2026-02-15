import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BuilderService } from '../../services/builder-service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { filter } from 'rxjs';

@Component({
  selector: 'app-builder-form-title',
  imports: [ReactiveFormsModule],
  templateUrl: './builder-form-title.html',
  styleUrl: './builder-form-title.css',
})
export class BuilderFormTitle implements OnInit, OnChanges {
  @Input() formTitle!: string;
  titleControl = new FormControl('');

  constructor(private builderService: BuilderService) {}

  ngOnInit(): void {
    this.titleControl.valueChanges
      .pipe(filter((value) => value != null))
      .subscribe((value) => this.builderService.setFormTitle_S(value));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.titleControl.setValue(this.formTitle, { emitEvent: false }); // No save
  }

  endEdit(event: Partial<KeyboardEvent>) {
    // event.preventDefault();
    (event.target as HTMLInputElement).blur();
  }
}
