// EXCEL -> ElementRef, ViewChild
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

// EXCEL
import * as XLSX from 'xlsx';

import {
  EmpresaControllerService,
  ObligacionControllerService,
  EmpresaObligacionControllerService,
  EmpresaObligacion
} from 'src/apiclient';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
moment.locale('es');
import Swal from 'sweetalert2';
@Component({
  selector: 'app-empresa-view-obligacion',
  templateUrl: './view-obligacion.component.html',
  styleUrls: ['./view-obligacion.component.scss']
})
export class EmpresaViewObligacionComponent implements OnInit {
  // EXCEL
  @ViewChild('TABLE', { static: false }) TABLE: ElementRef;

  model: any;
  obligacionModel: any;
  obligaciones: any[];

  modalObligacion: any;
  modalEditing = false;
  form = new FormGroup({});

  dataLoaded = false;

  modalFields: FormlyFieldConfig[] = [
    {
      key: 'nota',
      type: 'input',
      templateOptions: {
        label: 'Nota',
        placeholder: ''
      }
    }
  ];

  constructor(
    private empresaControllerService: EmpresaControllerService,
    private obligacionControllerService: ObligacionControllerService,
    private empresaObligacionControllerService: EmpresaObligacionControllerService,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.empresaControllerService.empresaControllerFindById(params.id).subscribe(data => {
        this.model = data;
      });

      this.obligacionControllerService.obligacionControllerFindById(params.oid).subscribe(data => {
        this.obligacionModel = data;
      });

      this.empresaControllerService.empresaControllerFindEmpresaObligacion(params.id, params.oid).subscribe(data => {
        this.obligaciones = data;
        this.dataLoaded = true;
      });
    });
  }

  // EXCEL
  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'view-obligacion.xlsx');
  }

  fechaES(fecha: Date) {
    return moment(fecha)
      .utc()
      .format('LL');
  }

  fechaMoment(fecha: Date) {
    return moment(fecha)
      .utc()
      .fromNow();
  }

  marcarCompletado(item: any) {
    const newStatus = item.status ? 0 : 1;

    this.empresaObligacionControllerService
      .empresaObligacionControllerUpdateById(item.id, { status: newStatus } as EmpresaObligacion)
      .subscribe(data => {
        item.status = newStatus;
      });
  }

  actualizarNota() {
    this.empresaObligacionControllerService
      .empresaObligacionControllerUpdateById(this.modalObligacion.id, {
        nota: this.modalObligacion.nota
      } as EmpresaObligacion)
      .subscribe(
        data => {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          Toast.fire({
            title: 'Nota',
            toast: true,
            text: 'creada correctamente',
            type: 'success'
          });
          this.modalService.dismissAll();
        },
        err => {
          // manejar errores
        }
      );
  }

  open(content: any, obligacion: any) {
    this.modalObligacion = obligacion;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      result => {
        // this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
}
