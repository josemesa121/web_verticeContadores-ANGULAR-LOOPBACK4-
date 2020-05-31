import { Component, OnInit } from '@angular/core';
import { EmpresaControllerService } from 'src/apiclient';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-empresa-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class EmpresaViewComponent implements OnInit {
  model: any;
  obligaciones: any[];
  anios: any[];
  mostrar = false;
  aniosList: number;

  dataLoaded = false;
  dataLoadedDetalles = false;

  constructor(
    private empresaControllerService: EmpresaControllerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let selectedAnio: { anio: number; id: number } = null;
      this.empresaControllerService.obligacionAnios().subscribe(data => {
        this.anios = data;
        selectedAnio = this.anios[this.anios.length - 1];
        this.aniosList = selectedAnio.anio;
        this.mostrar = true;
        if (this.aniosList) {
          this.empresaControllerService.empresaControllerFindById(params.id).subscribe(data => {
            this.model = data;
            this.dataLoadedDetalles = true;
            this.loadEmpresaObligacionesByAnio(selectedAnio.id);
          });
        } else {
          this.empresaControllerService.empresaControllerFindById(params.id).subscribe(data => {
            this.model = data;
            this.dataLoadedDetalles = true;
            this.loadEmpresaObligaciones();
          });
        }
      });
    });
  }

  loadEmpresaObligaciones() {
    this.dataLoaded = false;
    this.empresaControllerService.empresaControllerFindObligaciones(this.model.id).subscribe(data => {
      this.obligaciones = data;
      this.dataLoaded = true;
    });
  }

  oblig(selected: any) {
    this.aniosList = selected.anio;
    this.mostrar = true;
    this.loadEmpresaObligacionesByAnio(selected.id);
  }

  loadEmpresaObligacionesByAnio(selectedAnio: number) {
    this.dataLoaded = false;

    this.empresaControllerService
      .empresaControllerFindObligacionesByAnioId(this.model.id, selectedAnio)
      .subscribe(data => {
        this.obligaciones = data;
        this.dataLoaded = true;
      });
  }

  viewEmpresaObligacion(id: any, oid: any) {
    this.router.navigate(['empresa', id, 'obligacion', oid]);
  }

  beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'obligaciones') {
      this.loadEmpresaObligaciones();
    }
  }
}
