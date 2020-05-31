import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { ObligacionControllerService, EmpresaControllerService } from 'src/apiclient';

@Component({
  selector: 'app-obligacion',
  templateUrl: './obligacion.component.html',
  styleUrls: ['./obligacion.component.scss']
})
export class ObligacionComponent implements OnInit {
  version: string | null = environment.version;

  obligaciones: any;

  anios: any[];
  mostrar = false;
  aniosList: number;

  dataLoaded = false;

  confirmDgConfig = {
    title: 'Esta seguro',
    text: 'No podras revertir esta accion',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, eliminar.',
    cancelButtonText: 'Cancelar'
  };

  constructor(
    private router: Router,
    private empresaControllerService: EmpresaControllerService,
    private obligacionControllerService: ObligacionControllerService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dataLoaded = false;

    let selectedAnio: { anio: number; id: number } = null;
    this.empresaControllerService.obligacionAnios().subscribe(data => {
      this.anios = data;
      selectedAnio = this.anios[this.anios.length - 1];
      this.aniosList = selectedAnio.anio;
      if (this.aniosList) {
        this.mostrar = true;
        this.obligacionControllerService.obligacionControllerFindByObligationId(selectedAnio.id).subscribe(data => {
          this.obligaciones = data;
          this.dataLoaded = true;
        });
      } else {
        this.obligacionControllerService.obligacionControllerFind().subscribe(data => {
          this.obligaciones = data;
          this.dataLoaded = true;
        });
      }
    });
  }

  oblig(selected: any) {
    this.dataLoaded = false;

    this.aniosList = selected.anio;
    this.mostrar = true;
    this.obligacionControllerService.obligacionControllerFindByObligationId(selected.id).subscribe(data => {
      this.obligaciones = data;
      this.dataLoaded = true;
    });
  }

  viewObligacion(id: any) {
    this.router.navigate(['/obligacion', id]);
  }

  deleteObligacion(success: boolean, id: any) {
    this.obligacionControllerService.obligacionControllerDeleteById(id).subscribe(data => {
      this.loadData();
    });
  }
}
