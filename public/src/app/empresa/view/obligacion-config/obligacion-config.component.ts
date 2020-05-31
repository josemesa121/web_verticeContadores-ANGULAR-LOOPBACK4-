import { Component, OnInit, Input } from '@angular/core';
import { EmpresaControllerService, ObligacionControllerService } from 'src/apiclient';

@Component({
  selector: 'app-empresa-obligacion-config',
  templateUrl: './obligacion-config.component.html',
  styleUrls: ['./obligacion-config.component.scss']
})
export class EmpresaObligacionConfigComponent implements OnInit {
  @Input() empresaId: number;
  obligaciones: any[];
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
    confirmButtonText: 'Si, seleccionar.',
    cancelButtonText: 'Cancelar'
  };

  constructor(
    private empresaControllerService: EmpresaControllerService,
    private obligacionControllerService: ObligacionControllerService
  ) {}

  ngOnInit() {
    // this.oblig(1)
    this.empresaControllerService.obligacionAnios().subscribe(data => {
      this.anios = data;
      const selectedAnio = this.anios[this.anios.length - 1];
      this.aniosList = selectedAnio.anio;
      this.mostrar = true;
      this.oblig(selectedAnio.id, selectedAnio);
    });
  }

  oblig(id_year: number, anio: any) {
    this.dataLoaded = false;

    this.aniosList = anio;
    this.mostrar = true;
    this.empresaControllerService
      .empresaControllerFindObligacionesConfigByAnio(this.empresaId, id_year)
      .subscribe(data => {
        this.obligaciones = data;
        this.dataLoaded = true;
      });
  }

  toggleObligacion(obligacion: any) {
    if (obligacion.activo) {
      this.empresaControllerService
        .empresaControllerDeleteEmpresaObligacion(this.empresaId, obligacion.id)
        .subscribe(data => {
          obligacion.activo = !obligacion.activo;
        });
    } else {
      this.empresaControllerService
        .empresaControllerCreateEmpresaObligacion(this.empresaId, obligacion.id)
        .subscribe(data => {
          obligacion.activo = !obligacion.activo;
        });
    }
  }
}
