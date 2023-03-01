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
    debugger;
    let datos = localStorage.getItem("datos");
    let objeto =
    {
      "id": 11,
      "username": "zuleidy.yaruro@maggioli-latam.com",
      "denominacion": "Prueba 6",
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
      "id": 11,
      "username": "zuleidy.yaruro@maggioli-latam.com",
      "denominacion": "Prueba",
      "plantilla":
        "{\rtf1\ansi\ansicpg1252\\uc1\deff0\adeff0\deflang0\deflangfe0\adeflang0{\fonttbl" +
        "{\f0\fswiss\fcharset0\fprq2{\*\panose 020B0604020202020204}Arial;}" +
        "{\f1\froman\fcharset2\fprq2{\*\panose 05050102010706020507}Symbol;}}" +
        "{\colortbl;\red0\green0\blue0;}" +
        "{\stylesheet{\s0\ltrpar\itap0\nowidctlpar\ql\li0\ri0\lin0\rin0\cbpat0\rtlch\af0\afs24\ltrch\f0\fs24\lang1033\langnp1033\langfe1033\langfenp1033 [Normal];}{\*\cs10\additive Default Paragraph Font;}}" +
        "{\info" +
        "{\*\txInfo{\txVer 31.0.822.500}}}" +
        "\paperw12240\paperh15840\margl1440\margt1440\margr1440\margb1440\deftab1134\widowctrl\trackmoves0\trackformatting1\lytexcttp\formshade\sectd" +
        "\headery567\footery567\pgwsxn12240\pghsxn15840\marglsxn1440\margtsxn1440\margrsxn1440\margbsxn1440\pgbrdropt32\pard\ltrpar\itap0\nowidctlpar\ql\li0\ri0\lin0\rin0\plain\rtlch\af0\afs20\alang1033\ltrch\f0\fs20\lang1033\langnp1033\langfe1033\langfenp1033 creaci\loch\af0\dbch\af0\hich\f0\'f3\hich\af0\dbch\af0\loch\f0 n prueba}",
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
