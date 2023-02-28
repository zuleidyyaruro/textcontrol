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

  onClickSave() {
    saveDocument();

    // let documentSave =
    // {
    //   "denominacion": "Denominacion de prueba",
    //   "plantilla": "<html><body><p>Cambiar contenido cuando este el diseño OK</p></body></html>",
    //   "editable": true,
    //   "observaciones": "",
    //   "grupo_documento_plantilla": 1,
    //   "tipo_documento_plantilla": 1,
    //   "siglas_app": "CMT",
    //   "borrado": false,
    //   "id_fk_usuario": 1
    // }


    // this._sTextControl.createDocumentoPlantilla(documentSave).subscribe(res => {
    //   console.log(res)
    // })

  }

  onClickLoad() {
    console.log("1")
    loadDocument();
  }
}
