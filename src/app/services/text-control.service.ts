import { Injectable } from '@angular/core';
import { cDocumentoPlantilla } from '../modelos/documento-plantilla.modelo';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TextControlService {

  constructor(
    private _http: HttpClient,
  ) { }

  createDocumentoPlantilla(oRegistro: any) {
    let url: string = "http://127.0.0.1:9000/api/cemen/administracion/documentos-plantilla/";
    let headers = {
      headers: { 'Authorization': 'Token 99428d86e1870eb750267d38fdfe068813d8f010' }
    };
    return this._http.post<any>(url, oRegistro, headers);
  }

  updateDocumentoPlantilla(oRegistro: any): Observable<any> {
    let url: string = "http://127.0.0.1:9000/api/cemen/administracion/documentos-plantilla/" + oRegistro.id + "/"
    let headers = {
      headers: { 'Authorization': 'Token 99428d86e1870eb750267d38fdfe068813d8f010' }
    };
    return this._http.put<any>(url, oRegistro, headers);
  }

  getDocumentosPlantilla(id: number): Observable<any> {
    return this._http.get<any>("http://localhost:9000/api/cemen/administracion/documentos-plantilla/" + id + "/");
  }

}
