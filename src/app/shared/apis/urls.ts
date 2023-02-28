//Resumen: Librerias genéricas relacionadas con servicios
//Autor: MP

import { cParamApiQuery } from './paramApiQuery';
import * as val from "../validaciones/validaciones";
import * as cry from "../encriptacion/cifrado_frontback";
import { Router } from '@angular/router';

// Compone la url de un servicio a partir de un id (api viewset) y/o parámetros get
export function ComponerUrlServicio(sUrlCompleta: string, id: number = 0,
  paramGet: cParamApiQuery | null = null,
  paramFields: string | null = null): string {

  // Ejemplo: http://127.0.0.1:8000/api/publicaciones/materias'

  if (id > 0) {

    // exclusivas de api viewset
    // Ejemplo: http://127.0.0.1:8000/api/publicaciones/materias/5/

    sUrlCompleta = sUrlCompleta + id.toString() + "/";

    // Quitamos los espacios en blanco a los parámetros expandibles, de lo contrario, no resuelve bien la carga de datos.
    // Ejemplo: ?&expand=id_fk_medico, id_fk_causa_defuncion, id_fk_causa_defuncion2 x
    //          ?&expand=id_fk_medico,id_fk_causa_defuncion,id_fk_causa_defuncion2

    if (!val.isNullUndefined(paramFields)) {
      sUrlCompleta += '?' + paramFields.replace(' ', '');
    }

  } else {
    if (!val.isNullUndefined(paramGet) || !val.isNullUndefined(paramFields)) {
      sUrlCompleta += "?";
    }
    if (!val.isNullUndefined(paramGet)) {

      // Ejemplo sin paginación:
      // http://127.0.0.1:8000/api/publicaciones/materias/?param=JSONfiltro....

      // Ejemplo con paginación:
      // http://127.0.0.1:8000/api/publicaciones/materias/?limit=23&page=2&param=JSONfiltro....

      // Comprobamos si hay paginación

      if (!val.isNullUndefined(paramGet.limite) && paramGet.limite > 0) {
        sUrlCompleta = sUrlCompleta + "&limit=" + paramGet.limite.toString()

        // Comprobamos si hemos recibido el nº de página

        if (!val.isNullUndefined(paramGet.pagina) && paramGet.pagina > 0)
          sUrlCompleta = sUrlCompleta + "&page=" + paramGet.pagina.toString()
      }

      // Añadimos los parámetros GET ?, quitándole los saltos de línea y espacios
      // en blanco finales y los parámetros de la clase limite y pagina que no hacen falta

      const oFiltro: any = { "filtroQ":paramGet.filtroQ, "ordena":paramGet.ordena }

      sUrlCompleta = sUrlCompleta + "&param=" + JSON.stringify(oFiltro).split("\n").join("").trim();


    }

    if (!val.isNullUndefined(paramFields)) {
      sUrlCompleta += paramFields;
    }

  }

  return sUrlCompleta;

}

// Abre una url externa
// Autor: MP
export function AbrirUrlExterna(sUrl: string, sTarget: string = "_blank"): boolean {

  if (val.validarUrlExterna(sUrl)) {
    const link = document.createElement('a');
    link.target = sTarget;
    link.href = sUrl;
    link.setAttribute('visibility', 'hidden');
    link.click();
    return true;
  } else {
    return false;
  }

}

export function AbrirEnlace(oRouter: Router, sUrl: string, oParam: any = null, bJSON: boolean = false, bEncriptar: boolean = false): void {

  if (!val.isNullUndefinedVacio(sUrl)) {
    if (val.validarUrlExterna(sUrl)) {
      this.AbrirUrlExterna(sUrl)
    } else {
      if (val.isNullUndefinedVacio(oParam)) {
        oRouter.navigate([sUrl]);
      } else {

        let sParametros: string = '';

        if (bJSON) {
          sParametros = JSON.stringify(oParam);
        }

        if (bEncriptar) {
          sParametros = cry.CifrarCadenaAES_FrontBack(sParametros);
        }

        oRouter.navigate([sUrl, sParametros]);
      }

    }
  }
}
