import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';
import { EmpresaControllerService } from 'src/apiclient';

import * as moment from 'moment';
import { DataService } from '@app/services/data.service';
moment.locale('es');
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;
  fechas: any;
  fechasArray: any;

  currentWeek: any;

  dataLoaded = false;

  constructor(private empresaController: EmpresaControllerService, private dataService: DataService) { }

  ngOnInit() { }

  // EXCEL
  ExportTOExcel() {
    const requestBody = { fechasArray: this.fechasArray, fechas: this.fechas, currentWeek: this.currentWeek };
    console.log(requestBody);
    this.dataService
      .exportExcelObligacionesRango(requestBody)
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'resumen_semanal.xlsx');
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => console.log(error));
  }

  loadData($event: any) {
    this.dataLoaded = false;
    this.currentWeek = $event;
    this.isLoading = true;
    this.empresaController.empresaControllerFindObligacionesRango($event.start, $event.end).subscribe(data => {
      this.fechas = data;
      this.fechasArray = Object.keys(this.fechas);
      this.isLoading = false;
      this.dataLoaded = true;
    });
  }

  getObligactionByFecha(fecha: string) {
    return this.fechas[fecha];
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
}
