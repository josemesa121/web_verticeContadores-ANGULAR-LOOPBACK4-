import { Component, OnInit } from '@angular/core';
import { ObligacionControllerService, ObligacionFecha, ObligacionFechaControllerService } from 'src/apiclient';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NgbDateNativeAdapter, NgbDateAdapter, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@app/services/data.service';

import Swal from 'sweetalert2';

moment.locale('es');
@Component({
  selector: 'app-obligacion-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class ObligacionViewComponent implements OnInit {
  model: any;
  fechas: ObligacionFecha[];

  params: any;

  nombre: any = '';

  fecha: any;
  fechaSend: any;

  dataLoaded = false;

  constructor(
    private obligacionControllerService: ObligacionControllerService,
    private obligacionFechaControllerService: ObligacionFechaControllerService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.params = this.route.snapshot.params;

    this.route.params.subscribe(params => {
      this.obligacionControllerService.obligacionControllerFindById(params.id).subscribe(data => {
        this.model = data;
        this.nombre = data.nombre;
      });

      this.obligacionControllerService.obligacionControllerFindFechas(params.id).subscribe(data => {
        for (const el of data) {
          if (el.hasOwnProperty('fecha')) {
            el.fecha = new Date(el.fecha);
          }
        }
        this.fechas = data;
        this.dataLoaded = true;
      });
    });
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

  actualizarFecha(newDate: any, fecha: ObligacionFecha) {
    this.obligacionFechaControllerService.obligacionFechaControllerReplaceById(fecha.id, fecha).subscribe(data => {});
  }

  updateObligacion(form: any) {
    this.dataService
      .updateObligacion({ id: this.params.id, nombre: this.nombre })
      .then(response => {
        this.model.nombre = this.nombre;
        this.modalService.dismissAll();

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          title: 'Obligación',
          toast: true,
          text: 'Nombre actualizado.',
          type: 'success'
        });
      })
      .catch(error => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          title: 'Opps',
          toast: true,
          text: 'hubo un error desconocido.',
          type: 'error'
        });
      });
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  loadModalFecha(content: any, data: any) {
    this.fecha = data;
    this.fechaSend = Object.assign({}, data);
    this.open(content);
  }

  updateFecha(form: any) {
    this.dataService
      .updateFechaObligacion(this.fechaSend)
      .then(response => {
        this.fecha.descripcion = this.fechaSend.descripcion;
        this.modalService.dismissAll();

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          title: 'Fecha',
          toast: true,
          text: 'Descripción actualizada.',
          type: 'success'
        });
      })
      .catch(error => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          title: 'Opps',
          toast: true,
          text: 'hubo un error desconocido.',
          type: 'error'
        });
      });
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
