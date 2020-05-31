import { Component, OnInit, Input, TemplateRef } from '@angular/core';

import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { DocumentoControllerService, DocumentoCategoriaControllerService, DocumentoCategoria } from 'src/apiclient';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DocumentoService } from '@app/services/documento';

@Component({
  selector: 'app-documento',
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.scss']
})
export class DocumentoComponent implements OnInit {
  @Input() empresaId: number;
  version: string | null = environment.version;
  documentoModal: BsModalRef;
  documentos: any;
  files: any = [];
  default = {
    keyboard: true,
    class: 'modal-dialog-centered'
  };
  nombre = '';
  notas = '';

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
  categorias: Array<DocumentoCategoria>;
  categoria: DocumentoCategoria;
  mostrar: boolean;

  constructor(
    private modalService: BsModalService,
    private router: Router,
    private documentoService: DocumentoService,
    private documentoControllerService: DocumentoControllerService,
    private documentoCategoriaControllerService: DocumentoCategoriaControllerService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  downloadFile(documento: any) {
    this.documentoService.download(documento);
  }

  uploadFile(event: any) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element);
    }
  }

  upload() {
    const formData = new FormData();
    formData.append('nota', this.notas);
    formData.append('documentoCategoriaId', this.categoria ? this.categoria.id.toString() : '1');
    formData.append('', this.files[0]);
    this.documentoService.upload(this.empresaId, formData).subscribe(data => {
      if (data) {
        this.ngOnInit();
        this.documentoModal.hide();
      }
    });
  }

  deleteAttachment(index: any) {
    this.files.splice(index, 1);
  }

  loadData() {
    this.documentoControllerService.documentoControllerFind(this.empresaId).subscribe(data => {
      this.documentos = data;
      this.dataLoaded = true;
    });
    this.documentoCategoriaControllerService.documentoCategoriaControllerFind().subscribe(data => {
      this.categorias = data;
    });
  }

  viewDocumento(id: any) {
    this.router.navigate(['/documento', id]);
  }

  deleteDocumento(success: boolean, id: any) {
    this.documentoControllerService.documentoControllerDeleteById(id).subscribe(data => {
      this.loadData();
    });
  }

  openDefaultModal(modalDefault: TemplateRef<any>) {
    this.documentoModal = this.modalService.show(modalDefault, this.default);
  }

  setNotas(texto: any) {
    this.notas = texto.target.value;
  }

  setCategoria(selected: DocumentoCategoria) {
    this.categoria = selected;
    this.mostrar = true;
  }
}
