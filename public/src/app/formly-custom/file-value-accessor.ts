import { Directive, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: 'input[type=file]',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: FileValueAccessor, multi: true }]
})
export class FileValueAccessor implements ControlValueAccessor {
  @HostListener('change', ['$event.target.files']) onChange = (_: any) => {};
  @HostListener('blur') onTouched = () => {};

  writeValue(value: any) {}
  registerOnChange(fn: (_: any) => void) {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
}
