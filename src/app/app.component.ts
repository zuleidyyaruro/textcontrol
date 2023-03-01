import { Component, OnInit } from '@angular/core';
import { TextControlService } from './services/text-control.service';


declare const saveDocument: any;
declare const loadDocument: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TextControlService]
})
export class AppComponent {

  title = 'textprueba';

  constructor(
    private _sTextControl: TextControlService
  ) {

  }

  // crear
  async onClickSave() {

    await saveDocument();
    let datos = localStorage.getItem("datos");

    let objeto =
    {
      "id": 4,
      "username": "zuleidy.yaruro@maggioli-latam.com",
      "denominacion": "Prueba",
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


    localStorage.removeItem("datos")

  }

  onClickLoad() {
    console.log("1")
    const objetoModificar = {
      "id": 4,
      "username": "zuleidy.yaruro@maggioli-latam.com",
      "denominacion": "Prueba",
      "plantilla": "<p>sajdhsajdhkjasdasdaszxczxczx</p>",
      "editable": true,
      "observaciones": null,
      "grupo_documento_plantilla": 2,
      "tipo_documento_plantilla": 0,
      "siglas_app": "CMT",
      "borrado": false,
      "id_fk_usuario": 3
    }
    loadDocument(objetoModificar.plantilla);

  }
}
