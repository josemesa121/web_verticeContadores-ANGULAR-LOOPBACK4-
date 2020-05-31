import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ObligacionControllerService, EmpresaControllerService } from 'src/apiclient';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-obligacion-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ObligacionManageComponent implements OnInit {
  isNewRecord = true;

  form = new FormGroup({});
  model = { nombre: '' };
  fields: FormlyFieldConfig[] = [
    {
      key: 'nombre',
      type: 'input',
      templateOptions: {
        label: 'Nombre',
        placeholder: 'p. ej. ISLR',
        required: true
      }
    },
    {
      key: 'tipo',
      type: 'select',
      templateOptions: {
        label: 'Tipo',
        required: true,
        options: [{ value: 1, label: 'Personal' }, { value: 2, label: 'Juridica' }, { value: 3, label: 'Ambas' }]
      }
    },
    {
      key: 'digitos',
      type: 'select',
      templateOptions: {
        label: 'Digitos',
        required: true,
        options: [{ value: 10, label: 'Un Digito' }, { value: 100, label: 'Dos Digitos' }]
      }
    },
    {
      key: 'periodicidad',
      type: 'select',
      templateOptions: {
        label: 'Periodicidad',
        required: true,
        options: [
          { value: 12, label: 'Mensual' },
          { value: 6, label: 'Bi Mensual' },
          { value: 4, label: 'Trimestral' },
          { value: 3, label: 'Cuatrimestral' },
          { value: 2, label: 'BiAnual' },
          { value: 1, label: 'Anual' }
        ]
      }
    },
    {
      key: 'obligacionAnioId',
      type: 'select',
      templateOptions: {
        label: 'Año Obligación',
        required: true,
        options: []
      }
    }
  ];
  anios: any[];

  constructor(
    private router: Router,
    private empresaControllerService: EmpresaControllerService,
    private obligacionControllerService: ObligacionControllerService
  ) {}

  ngOnInit() {
    this.empresaControllerService.obligacionAnios().subscribe(data => {
      this.anios = data;
      const optionsToshow: { value: any; label: any }[] = [];
      this.anios.forEach(element => {
        optionsToshow.push({ value: element.id, label: element.anio });
      });
      const obligacionAnioId = this.fields.filter(x => x.key === 'obligacionAnioId')[0];
      obligacionAnioId.templateOptions = {
        label: 'Año Obligación',
        required: true,
        options: optionsToshow
      };
    });
  }

  submit(model: any) {
    if (this.isNewRecord) {
      this.obligacionControllerService.obligacionControllerCreate(model).subscribe(data => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          title: 'Obligación',
          toast: true,
          text: 'creada correctamente',
          type: 'success'
        });

        this.router.navigate(['/obligacion', data.id]);
      });
    } else {
      this.obligacionControllerService.obligacionControllerUpdateById(model).subscribe(data => {
        this.router.navigate(['/obligacion', data.id]);
      });
    }
  }
}
