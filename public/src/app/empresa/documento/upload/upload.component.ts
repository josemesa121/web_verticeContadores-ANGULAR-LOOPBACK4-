import { Component, ElementRef, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { DocumentoControllerService } from 'src/apiclient';
import { DocumentoService } from '@app/services/documento';

@Component({
  selector: 'app-document-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  @Input() empresaId: number;
  form = this.fb.group({
    nota: this.fb.control(''),
    archivo: this.fb.control('')
  });
  model = {};

  archivo: any;

  @ViewChild('labelImport', { static: false })
  labelImport: ElementRef;

  constructor(private fb: FormBuilder, private documentoService: DocumentoService) {
    this.form.get('archivo').valueChanges.subscribe(x => {
      this.archivo = x;
    });
  }

  ngOnInit() {}

  onChange(files: any) {
    this.labelImport.nativeElement.innerText = Array.from(files)
      .map((File: any) => File.name)
      .join(', ');
    this.archivo = files;
    console.log('upload', this.archivo);
  }

  submit(model: any) {
    console.log(model);
    console.log(typeof this.archivo);
    console.log(this.archivo);
    console.log(JSON.stringify(this.archivo));
    const formData = new FormData();
    formData.append('nota', ' la nota desde anglar');
    formData.append('documentoCategoriaId', '1');
    formData.append('', this.archivo[0]);
    this.documentoService.upload(this.empresaId, formData).subscribe(data => {
      console.log('submit', data);
    });
  }
}
