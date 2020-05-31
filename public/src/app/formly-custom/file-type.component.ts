import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-file',
  template: `
    <input type="file" [formControl]="formControl" [formlyAttributes]="field" />
  `
})
// tslint:disable-next-line: component-class-suffix
export class FormlyFieldFile extends FieldType {}
