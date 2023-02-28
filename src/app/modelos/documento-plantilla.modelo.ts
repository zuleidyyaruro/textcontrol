export class cDocumentoPlantilla {
  id: number;
  id_fk_usuario: number;
  denominacion: string;
  plantilla: string;
  editable: boolean;
  observaciones: string;
  grupo_documento_plantilla: any;
  tipo_documento_plantilla: any;
  siglas_app: string;
  borrado: boolean;
  username: string;

  constructor() {
    this.id = 0;
    this.id_fk_usuario = 0;
    this.denominacion = "";
    this.plantilla = "";
    this.editable = true;
    this.observaciones = "";
    this.grupo_documento_plantilla = null;
    this.tipo_documento_plantilla = null;
    this.siglas_app = "";
    this.borrado = false;
    this.username = "";
  }
}
