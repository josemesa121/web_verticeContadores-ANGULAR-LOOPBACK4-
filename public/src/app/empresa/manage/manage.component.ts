import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { EmpresaControllerService } from 'src/apiclient';
import { DocumentoControllerService } from 'src/apiclient';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empresa-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class EmpresaManageComponent implements OnInit {
  isNewRecord = true;

  form = new FormGroup({});
  model = { nombre: '' };
  fields: FormlyFieldConfig[] = [
    {
      key: 'nombre',
      type: 'input',
      templateOptions: {
        label: 'Nombre',
        placeholder: 'p. ej. Kumisoft',
        required: true
      }
    },
    {
      key: 'tipo',
      type: 'select',
      templateOptions: {
        label: 'Tipo',
        required: true,
        options: [{ value: 1, label: 'Persona Natural' }, { value: 2, label: 'Juridica' }]
      }
    },
    {
      key: 'nit',
      type: 'input',
      templateOptions: {
        label: 'NIT',
        placeholder: 'p. ej. 101946546',
        required: true
      }
    },
    {
      key: 'nitDigito',
      type: 'input',
      templateOptions: {
        label: 'Dígito de Verificación',
        placeholder: '',
        required: true
      }
    },
    {
      key: 'contacto',
      type: 'input',
      templateOptions: {
        label: 'Representante Legal',
        placeholder: ''
      }
    },
    {
      key: 'direccion',
      type: 'input',
      templateOptions: {
        label: 'Dirección',
        placeholder: 'Cúcuta, Colombia'
      }
    },
    {
      key: 'email',
      type: 'input',
      templateOptions: {
        label: 'Email',
        placeholder: 'Kumisoft@yahoo.es'
      }
    },
    {
      key: 'telefono',
      type: 'input',
      templateOptions: {
        label: 'Teléfono',
        placeholder: 'p. ej. 31100987'
      }
    },
    {
      key: 'cedula',
      type: 'input',
      templateOptions: {
        label: 'Cédula',
        placeholder: 'p. ej. 31234566'
      }
    },
    {
      key: 'clave_dian',
      type: 'input',
      templateOptions: {
        label: 'Clave ingreso DIAN',
        placeholder: 'p. ej. A1234'
      }
    },
    {
      key: 'clave_firma_dian',
      type: 'input',
      templateOptions: {
        label: 'Clave firma DIAN',
        placeholder: 'p. ej. A1234'
      }
    },
    {
      key: 'place_iyc',
      type: 'input',
      templateOptions: {
        label: 'Placa Industria y Comercio',
        placeholder: 'p. ej. 4466788'
      }
    },
    {
      key: 'placa_reteica',
      type: 'input',
      templateOptions: {
        label: 'Placa REITECA',
        placeholder: 'p. ej. 4466788'
      }
    },
    {
      key: 'datos_contabilidad',
      type: 'input',
      templateOptions: {
        label: 'Datos para ingresar a contabilidad',
        placeholder: 'p. ej. Usuario21'
      }
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private empresaControllerService: EmpresaControllerService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.empresaControllerService.empresaControllerFindById(params.id).subscribe(data => {
        this.model = data;
        this.isNewRecord = false;
      });
    });
  }

  submit(model: any) {
    if (this.isNewRecord) {
      this.empresaControllerService.empresaControllerCreate(model).subscribe(data => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          title: 'Empresa',
          toast: true,
          text: 'creada correctamente',
          type: 'success'
        });

        this.router.navigate(['/empresa']);
      });
    } else {
      this.empresaControllerService.empresaControllerReplaceById(model.id, model).subscribe(data => {
        this.router.navigate(['/empresa']);
      });
    }
  }
}
