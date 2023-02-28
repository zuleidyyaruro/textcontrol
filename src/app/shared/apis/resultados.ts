//Resumen: Retorno de resultados de las APIs
//Autor: MP

import * as val from '../validaciones/validaciones';
import { isDevMode } from '@angular/core';

export enum eResultado {
  OK = 0,                              // No hay errores
  ERROR_TOKEN = -1,                    // Error token
  ERROR_AUTENTICACION = -2,            // Error de autenticación
  ERROR_GENERICO = -3,                 // Error genérico
  ERROR_INTEGRACION_NO_EXISTE = -4,    // No existe la integración indicada
  ERROR_INTEGRACION_NO_POSEE = -5,     // El usuario no posee la integración
  ERROR_USUARIO_SIN_ENTIDAD = -6,      // El usuario no está asociado a ninguna Entidad
  ERROR_VALIDACION = -300,             // Error de validación
  ERROR_NOTFOUND = -400,               // Error de datos inexistentes
  ERROR_PERSONALIZADO = -900           // Error personalizado
}

// Resultado genérico
export class cResultado {

  public cod_resultado!: number;
  public msg_resultado!: string;
  public resultado: any;

  contructor() {
    this.cod_resultado = eResultado.OK;
    this.msg_resultado = '';
    this.resultado = null;
  }
}

// Resultado paginación API
export class cResultadoPaginacionAPI {
  public next: string;
  public num_pages: number;
  public page_number: number;
  public page_size: number;
  public previous: string;
  public total: number;
  public total_per_page: number;
  public url: string;
  public url_sin_paginacion: string;
}

// Resultado error API
// Autor: MP
export class cResultadoErrorHTTPAPI {

  public status: number = 0;
  public statusText: string = '';
  public message: string = '';
  public url: string = '';

}

// Clase que unifica los valores retornados por las APIS o los errores HTTP producidos:
// Tipos de valores que pueden retornar las APIS:
// GET:
//      1. Cómo colección única de datos Ej. [{...},{...},{...}]
//      2. Con formato paginado: {items:[{...},{...},{...}], next:N,num_pages:N,page_number:N,page_size:N,previous:N,total:N,total_per_page:N}
//      3. clase cResultado {cod_resultado:xx,msg_resultado:xxx,resultado:xxxx}
// POST,PUT,DELETE,PATCH:
//      1. clase cResultado {cod_resultado:xx,msg_resultado:xxx,resultado:xxxx}
//      2. JSON registro tabla
//      3. OTROS
// Ejemplo Frontend:
//      let oResultadoAPI: cResultadoAPI = new cResultadoAPI();
//      this._administrados.getAdministrados(0, oFiltro).subscribe(
//        data => {
//          oResultadoAPI.getCapturaResultadoAPI(data);
//          if (oResultadoAPI.cod_resultado == eResultado.OK) {
//            this.aDatos = oResultadoAPI.resultado;
//          } else {
//            this._messageService.add({ key: 'msgPagina', severity: 'error', summary: oResultadoAPI.msg_resultado, life: 5000 });
//          }
//        },
//        err => {
//          oResultadoAPI.getCapturaResultadoError(err);
//          this._messageService.add({ key: 'msgPagina', severity: 'error', summary: oResultadoAPI.msg_resultado, life: 5000 });
//        }
//      );
// Autor: MP
export class cResultadoAPI extends cResultado {

  public hayDatos: boolean;
  public oPaginacionAPI: cResultadoPaginacionAPI;
  public oErrorHTTPAPI: cResultadoErrorHTTPAPI

  contructor() {

    this.inicializar();

  }

  private inicializar(): void {

    // Clase base

    this.cod_resultado = eResultado.OK;
    this.msg_resultado = '';
    this.resultado = null;
    this.hayDatos = false;

    // Paginación

    this.oPaginacionAPI = new cResultadoPaginacionAPI();
    this.oPaginacionAPI.next = '';
    this.oPaginacionAPI.page_number = 0;
    this.oPaginacionAPI.num_pages = 0;
    this.oPaginacionAPI.page_size = 0;
    this.oPaginacionAPI.previous = '';
    this.oPaginacionAPI.total = 0;
    this.oPaginacionAPI.total_per_page = 0;
    this.oPaginacionAPI.url = '';
    this.oPaginacionAPI.url_sin_paginacion = '';

    // Error API

    this.oErrorHTTPAPI = new cResultadoErrorHTTPAPI();
    this.oErrorHTTPAPI.status = 0;
    this.oErrorHTTPAPI.statusText = '';
    this.oErrorHTTPAPI.message = 'Error genérico API';
    this.oErrorHTTPAPI.url = '';

  }

  // Captura el resultado devuelto de la llamada a un API
  // Autor: MP
  public getCapturaResultadoAPI(aDataAPI: any): void {

    let aDatos: any[] = null;

    // Inicializamos los valores

    this.inicializar();

    if (!val.isNullUndefined(aDataAPI)) {

      if (!val.isNullUndefined(aDataAPI['cod_resultado'])) {
        this.cod_resultado = aDataAPI['cod_resultado'];
        this.msg_resultado = aDataAPI['msg_resultado'];
        aDatos = aDataAPI['resultado'];
      } else {
        aDatos = aDataAPI;
      }

      if (!val.isNullUndefined(aDatos)) {
        this.hayDatos = true;
        if (val.isNullUndefined(aDatos['items'])) {
          this.resultado = aDatos;
          if (!val.isNullUndefined(this.resultado?.length)) {
            this.hayDatos = (this.resultado?.length > 0);
          }
        } else {
          this.resultado = aDatos['items'];
          if (!val.isNullUndefined(aDataAPI['url'])) {
            this.oPaginacionAPI.url = aDatos['url'];
          }
          if (!val.isNullUndefined(aDataAPI['next'])) {
            this.oPaginacionAPI.next = aDatos['next'];
          }
          if (!val.isNullUndefined(aDataAPI['page_number'])) {
            this.oPaginacionAPI.page_number = aDatos['page_number'];
          }
          if (!val.isNullUndefined(aDataAPI['num_pages'])) {
            this.oPaginacionAPI.num_pages = aDatos['num_pages'];
          }
          if (!val.isNullUndefined(aDataAPI['page_size'])) {
            this.oPaginacionAPI.page_size = aDatos['page_size'];
          }
          if (!val.isNullUndefined(aDataAPI['previous'])) {
            this.oPaginacionAPI.previous = aDatos['previous'];
          }
          if (!val.isNullUndefined(aDataAPI['total'])) {
            this.oPaginacionAPI.total = aDatos['total'];
          }
          if (!val.isNullUndefined(aDataAPI['total_per_page'])) {
            this.oPaginacionAPI.total_per_page = aDatos['total_per_page'];
          }

          // Obtenemos la url sin paginación y límite de registros por página

          if (!val.isNullUndefinedVacio(this.oPaginacionAPI.url))
            this.oPaginacionAPI.url_sin_paginacion = this.quitarPaginacionUrl(this.oPaginacionAPI.url);

          this.hayDatos = (this.oPaginacionAPI.total > 0);
        }
      }

    }
  }

  // Quita los parámetros de límite de registros por página y la paginación a la url recibida
  private quitarPaginacionUrl(urlCompleta: string): string {

    let sUrl: string = urlCompleta;
    let sValor: string = '';

    if (!val.isNullUndefined(sUrl)) {

      const urlParams = new URLSearchParams(sUrl);

      // Comprobamos si la url viene con límite de registros por página.

      if (sUrl.includes('limit=')) {
        sValor = this.getParametroURL(sUrl, 'limit')
        if (!val.isNullUndefinedVacio(sValor))
          sUrl = sUrl.replace('limit=' + sValor, '')
      }

      // Comprobamos si la url viene paginada

      if (sUrl.includes('page=')) {
        sValor = this.getParametroURL(sUrl, 'page')
        if (!val.isNullUndefinedVacio(sValor))
          sUrl = sUrl.replace('page=' + sValor, '')
      }

      // Comprobamos si después de las sustituciones se ha quedado mal la url

      if (sUrl.includes('/?&'))
        sUrl = sUrl.replace('/?&', '/?');
      if (sUrl.includes('/?&'))
        sUrl = sUrl.replace('/?&', '/?');
      if (sUrl.includes('&&'))
        sUrl = sUrl.replace('&&', '&');
      if (sUrl.endsWith('/?'))
        sUrl = sUrl.replace('/?', '/');
    }

    return sUrl;
  }

  // Obtiene un parámetro de la URL
  private getParametroURL(url: string, parametro: string): string {

    parametro = parametro.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + parametro + "=([^&#]*)"),
      results = regex.exec(url);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }


  // Captura el error devuelto de la llamada a un API
  // Autor: MP
  public getCapturaResultadoError(oError: any): void {

    // Inicializamos los valores

    this.inicializar();

    this.cod_resultado = eResultado.ERROR_GENERICO;

    if (!val.isNullUndefined(oError)) {

      if (!val.isNullUndefined(oError['status'])) {
        this.oErrorHTTPAPI.status = oError['status'];
      }
      if (!val.isNullUndefined(oError['statusText'])) {
        this.oErrorHTTPAPI.statusText = oError['statusText'];
      }
      if (!val.isNullUndefined(oError['message'])) {
        this.oErrorHTTPAPI.message = oError['message'];
      }
      if (!val.isNullUndefined(oError['url'])) {
        this.oErrorHTTPAPI.url = oError['url'];
      }
      this.msg_resultado = 'Error: ' + this.oErrorHTTPAPI.status + ' (' + this.oErrorHTTPAPI.statusText + '), ' + this.oErrorHTTPAPI.message;

      // Si estamos en modo desarrollo mostramos el error por consola

      if (isDevMode()) {
        console.error(this);
      }

    }
  }
}


