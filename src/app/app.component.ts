import { Component, OnInit } from '@angular/core';
import { TextControlService } from './services/text-control.service';
import { lastValueFrom } from 'rxjs';


declare const saveDocument: any;
declare const loadDocument: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TextControlService]
})
export class AppComponent implements OnInit {

  title = 'textprueba';
  documento: any;

  constructor(
    private _sTextControl: TextControlService
  ) {

  }

  ngOnInit(): void {
    localStorage.removeItem("datos");
  }

  // crear
  async onClickSave() {

    saveDocument();

    setTimeout(() => {
      let datos = localStorage.getItem("datos");
      debugger;
      let objeto =
      {
        "id": 11,
        "username": "zuleidy.yaruro@maggioli-latam.com",
        "denominacion": "Prueba 11",
        "plantilla": datos,
        "editable": true,
        "observaciones": null,
        "grupo_documento_plantilla": 2,
        "tipo_documento_plantilla": 0,
        "siglas_app": "CMT",
        "borrado": false,
        "id_fk_usuario": 3
      }
      if (objeto.id > 0) {
        this._sTextControl.updateDocumentoPlantilla(objeto).subscribe(res => {
          console.log(res)
        })
      } else {
        this._sTextControl.createDocumentoPlantilla(objeto).subscribe(res => {
          console.log(res)
        })
      }
    }, 500);

    localStorage.removeItem("datos")

  }

  async onClickLoad() {

    const res = await lastValueFrom(this._sTextControl.getDocumentosPlantilla(11));
    this.documento = await res.plantilla;

    loadDocument(this.documento)

  }

}
