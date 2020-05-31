import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { EmpresaControllerService } from 'src/apiclient';

import * as _ from 'lodash';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit {
  version: string | null = environment.version;

  dataLoaded = false;

  empresas: any;

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

  constructor(private router: Router, private empresaControllerService: EmpresaControllerService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.empresaControllerService.empresaControllerFind().subscribe(data => {
      this.empresas = data;
      this.orderBy('nombre');
      this.dataLoaded = true;
    });
  }

  editEmpresa(event: any, id: any) {
    event.preventDefault();
    this.router.navigate(['/empresa/editar', id]);
  }

  viewEmpresa(id: any) {
    this.router.navigate(['/empresa', id]);
  }

  deleteEmpresa(success: boolean, id: any) {
    this.empresaControllerService.empresaControllerDeleteById(id).subscribe(data => {
      this.loadData();
    });
  }

  orderBy(campo: string) {
    this.empresas = _.orderBy(this.empresas, [campo], ['asc']);
  }
}
