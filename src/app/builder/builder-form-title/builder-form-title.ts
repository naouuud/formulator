import { Component, Input, OnInit } from '@angular/core';
import { BuilderService } from '../../services/builder-service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { filter, throttleTime } from 'rxjs';

@Component({
  selector: 'app-builder-form-title',
  imports: [ReactiveFormsModule],
  templateUrl: './builder-form-title.html',
  styleUrl: './builder-form-title.css',
})
export class BuilderFormTitle implements OnInit {
  @Input() formName!: string;
  formControl = new FormControl('');

  constructor(private builderService: BuilderService) {}
  ngOnInit(): void {
    this.formControl.setValue(this.formName);
    this.formControl.valueChanges
      .pipe(
        filter((value) => value != null)
        // throttleTime(1000, undefined, { leading: true, trailing: true })
      )
      .subscribe((value) => this.setFormName(value));
  }

  setFormName(value: string) {
    this.builderService.setFormName_S(value);
  }
}
