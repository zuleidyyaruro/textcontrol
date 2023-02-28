//Resumen: Librería relacionada con la gestión de los queryset
//         y los filtros de los parámetros GET
//Autor: MP

import { isNullUndefinedVacio } from "../validaciones/validaciones";

// Clase que gestiona el tratamiento de los parámetros que se envían
// a las api con el método GET.
export class cParamApiQuery {

  filtroQ: string; // Q objects Django
  ordena: Array<cParamApiQueryOrdenacion>; // columnas ordenación
  limite: number; // límite de filas
  pagina: number;

  constructor() {
    this.filtroQ = "";
    this.ordena = new Array();
    this.limite = 0; // Nº registros x página (si limite > 0 se activa la paginación)
    this.pagina = 0; // Nº de página a recuperar ()
  }

  /* ------------- Ejemplo

    Buscar las últimas 10 noticias publicadas ordenadas descendentemente

    Código:

        import * as PAQ from '../../servicios/paramApiQuery'

        let oFiltro: PAQ.cParamApiQuery = new PAQ.cParamApiQuery();
        oFiltro.filtroQ = PAQ.convertQ.contenido("detalle",sValor);
        oFiltro.ordena.push(new PAQ.cParamApiQueryOrdenacion("fecha",false));
        oFiltro.limite = 10;

    Resultado:

    url/?param=
        {
          "filtroQ":"{"filtroQ":"Q(detalle__icontains='abcd')},",
          "ordena":[{"co":"fecha","asc":false}],
          "limite":10
        }

  ------------------------*/

  // VMF
  private _ordenar ( campos: string[], orden: boolean ): void {
    campos.forEach ( campo => {
      this.ordena.push ( new cParamApiQueryOrdenacion ( campo, orden))
    })
  }

  ordenarAscendente ( campos: string[] ): void {
    this._ordenar (campos, true );
  }

  ordenarDescendente ( campos: string[] ): void {
    this._ordenar (campos, false);
  }


  private _filtrarIgual ( operador: string, campo: string, valor: any, not?: boolean) {
    if (this.filtroQ.length > 0) {
      this.filtroQ += operador;
    }
    this.filtroQ += convertQ.igual (campo, valor, not);
  }

  andIgual (campo: string, valor: any, not?: boolean): void {
    this._filtrarIgual (' and ', campo, valor, not);
  }

  orIgual (campo: string, valor: any, not?: boolean): void {
    this._filtrarIgual (' or ', campo, valor, not);
  }

  /*

      PARA ORDENAR
      ------------
      EJEMPLOS:   ordenarAscendente ( [ 'ejercicio', 'cod_organica' ] )   -> ordena de menor a mayor según la clasificación orgánica
                  ordenarDescendente ( ['neto'] )                         -> ordena de mayor a menor según el importe neto



      PARA FILTRAR
      ------------
      EJEMPLO :   andIgual ( 'ejercicio', this.ejercicioActual )      (...donde this.EjercicioActual = '2022')
                  andIgual ( 'cod_organica', this.codigoOrganica )    (...donde this.codigoOrganica = '123')

      RESULTADO: "Q(ejercicio='2022') and Q(cod_organica='123')"

  */

}

// Clase que define las columnas de ordenación
export class cParamApiQueryOrdenacion {

  co: string;     // nombre columna bd
  asc: boolean;   // ordenación ascendente

  constructor(col: string = "", asc: boolean = true) {
    this.co = col;
    this.asc = asc;
  }
}

// Conversiones a formato Q objects de Django
// Operadores lógicos: and = &, or = |, not = ~Q(...)
export class convertQ {

  public static igual(sColumna: string, valor: any, bNot: boolean = false, operador: string = null): string {
    return convertQ.aplicarOperador(operador) + (bNot ? "not" : "") + "Q(" + sColumna.trim() + this.unaccent(valor) + "=" + this.formateaValor(valor) + ")";
  }
  public static mayor(sColumna: string, valor: any, bNot: boolean = false, operador: string = null): string {
    return convertQ.aplicarOperador(operador) + (bNot ? "not" : "") + "Q(" + sColumna.trim() + this.unaccent(valor) + "__gt=" + this.formateaValor(valor) + ")";
  }
  public static mayor_igual(sColumna: string, valor: any, bNot: boolean = false, operador: string = null): string {
    return convertQ.aplicarOperador(operador) + (bNot ? "not" : "") + "Q(" + sColumna.trim() + this.unaccent(valor) + "__gte=" + this.formateaValor(valor) + ")";
  }
  public static menor(sColumna: string, valor: any, bNot: boolean = false, operador: string = null): string {
    return convertQ.aplicarOperador(operador) + (bNot ? "not" : "") + "Q(" + sColumna.trim() + this.unaccent(valor) + "__lt=" + this.formateaValor(valor) + ")";
  }
  public static menor_igual(sColumna: string, valor: any, bNot: boolean = false, operador: string = null): string {
    return convertQ.aplicarOperador(operador) + (bNot ? "not" : "") + "Q(" + sColumna.trim() + this.unaccent(valor) + "__lte=" + this.formateaValor(valor) + ")";
  }
  public static distinto(sColumna: string, valor: any, operador: string = null): string {
    return convertQ.aplicarOperador(operador) + "notQ(" + sColumna.trim() + this.unaccent(valor) + "=" + this.formateaValor(valor) + ")";
  }

  // Valores = [1,2,3] o ['A','B','C'] - recibe una colección de valores en lugar de una cadena con los valores
  public static inc(sColumna: string, valores: any[], bNot: boolean = false, operador: string = null): string {
    return convertQ.aplicarOperador(operador) + (bNot ? "not" : "") + "Q(" + sColumna.trim() + "__in=" + getFormatInQuery(valores) + ")";
  }

  // Valores = [1,2,3] o ['A','B','C']
  public static in(sColumna: string, valores: string, bNot: boolean = false): string {
    return (bNot ? "not" : "") + "Q(" + sColumna.trim() + "__in=" + valores + ")";
  }

  public static entre(sColumna: string, valor1: any, valor2: any, bNot: boolean = false, operador: string = null): string {

    return convertQ.aplicarOperador(operador) + (bNot ? "not" : "") + "Q(" + sColumna.trim() + "__range=(" +
      this.formateaValor(valor1) + "," + this.formateaValor(valor2) + "))";
  }

  public static contenido(sColumna: string, valor: any, bNot: boolean = false, operador: string = null): string {
    return convertQ.aplicarOperador(operador) + (bNot ? "not" : "") + "Q(" + sColumna.trim() + this.unaccent(valor) + "__icontains=" + this.formateaValor(valor) + ")";
  }

  public static nulo(sColumna: string, bNot: boolean = false, operador: string = null): string {
    return convertQ.aplicarOperador(operador) + (bNot ? "not" : "") + "Q(" + sColumna.trim() + "__isnull=True)";
  }

  public static no_nulo(sColumna: string, bNot: boolean = false, operador: string = null): string {
    return convertQ.aplicarOperador(operador) + (bNot ? "not" : "") + "Q(" + sColumna.trim() + "__isnull=False)";
  }

  public static aplicarOperador(sOperador: string): string {

    if (isNullUndefinedVacio(sOperador))
      return '';
    else
      return ' '   + sOperador + ' ';
  }

  // Función que se utiliza en postgreSql para que no distinguir entre vocales acentuadas y sin acentuar
  // Autor: MP
  private static unaccent(valor: any): string {

    if (typeof (valor) === "string") {

      // Comprobamos que el valor recibido no es una fecha
      if (valor.length === 10 && this.esValorFecha(valor)) {
        return "";
      } else {
        return "__unaccent";
      }
    } else {
      return "";
    }
  }

  // Comprueba si el valor recibido es una fecha
  private static esValorFecha(sValor: string) {
    let okey: boolean = true;

    try {
      // Se coge la fecha y se descompone con /
      const [y, m, d] = sValor.split('-');

      // Sino encuentra las - fallará
      if (!y || !m || !d) {
        throw new Error();
      }

      // Sino cumple la longitud fallará
      if (d.length < 2 || m.length < 2 || y.length < 4) {
        throw new Error();
      }
      okey = true;
    } catch (error) {
      okey = false;
    }
    return okey;
  }

  private static formateaValor(valor: any): any {

    let sTipo = typeof (valor);

    if (sTipo === 'string') {
      return "'" + valor.toString() + "'";
    } if (sTipo === 'boolean') {
      if (valor) {
        return "True";
      } else {
        return "False";
      }
    } else {
      return valor
    }
  }

}

// Beni
function getFormatInQuery(aValues: any): string {
  let sFormat: string = '['
  aValues.forEach((oValue: any, iValue: number) => {
    sFormat += `'${oValue.toString()}'${((aValues.length-1) == iValue ? '' : ',')}`
  });
  return sFormat + ']';

}

// //Resumen: Librería relacionada con la gestión de los queryset
// //         y los filtros de los parámetros GET
// //Autor: MP

// import { isNullUndefined } from 'src/app/modulos-app/shared/librerias/validaciones/validaciones';

// // Clase que gestiona el tratamiento de los parámetros que se envían
// // a las api con el método GET.
// export class cParamApiQuery {

//   public filtroQ: string; // Q objects Django
//   public ordena: Array<cParamApiQueryOrdenacion>; // columnas ordenación
//   public limite: number; // nº de registros x página (/?limit=xxx)
//   public pagina: number;

//   constructor() {
//     this.filtroQ = "";
//     this.ordena = new Array();
//     this.limite = 0; // Nº registros x página (si limite > 0 se activa la paginación)
//     this.pagina = 0; // Nº de página a recuperar ()
//   }

//   /* ------------- Ejemplo

//     Obtener las noticias de 10 en 10 registros de la página 3

//     Código:

//         import * as PAQ from '../../servicios/paramApiQuery'

//         let oFiltro: PAQ.cParamApiQuery = new PAQ.cParamApiQuery();
//         oFiltro.filtroQ = PAQ.convertQ.contenido("detalle",sValor);
//         oFiltro.ordena.push(new PAQ.cParamApiQueryOrdenacion("fecha",false));
//         oFiltro.limite = 10;
//         oFiltro.pagina = 3;

//     Resultado:

//     url/?param={"filtroQ":"{"filtroQ":"Q(detalle__icontains='abcd')}","ordena":[{"co":"fecha","asc":false}]}&limit=10&page=3

//   ------------------------*/

// }

// // Clase que define las columnas de ordenación
// export class cParamApiQueryOrdenacion {

//   co: string;     // nombre columna bd
//   asc: boolean;   // ordenación ascendente

//   constructor(col: string = "", asc: boolean = true) {
//     this.co = col;
//     this.asc = asc;
//   }
// }

// // Conversiones a formato Q objects de Django
// // Operadores lógicos: and = &, or = |, not = ~Q(...)
// export class convertQ {

//   public static igual(sColumna: string, valor: any, bNot: boolean = false): string {
//     return (bNot ? "not" : "") + "Q(" + sColumna.trim() + this.unaccent(valor) + "=" + this.formateaValor(valor) + ")";
//   }
//   public static mayor(sColumna: string, valor: any, bNot: boolean = false): string {
//     return (bNot ? "not" : "") + "Q(" + sColumna.trim() + this.unaccent(valor) + "__gt=" + this.formateaValor(valor) + ")";
//   }
//   public static mayor_igual(sColumna: string, valor: any, bNot: boolean = false): string {
//     return (bNot ? "not" : "") + "Q(" + sColumna.trim() + this.unaccent(valor) + "__gte=" + this.formateaValor(valor) + ")";
//   }
//   public static menor(sColumna: string, valor: any, bNot: boolean = false): string {
//     return (bNot ? "not" : "") + "Q(" + sColumna.trim() + this.unaccent(valor) + "__lt=" + this.formateaValor(valor) + ")";
//   }
//   public static menor_igual(sColumna: string, valor: any, bNot: boolean = false): string {
//     return (bNot ? "not" : "") + "Q(" + sColumna.trim() + this.unaccent(valor) + "__lte=" + this.formateaValor(valor) + ")";
//   }
//   public static distinto(sColumna: string, valor: any): string {
//     return "notQ(" + sColumna.trim() + this.unaccent(valor) + "=" + this.formateaValor(valor) + ")";
//   }

//   // Valores = [1,2,3] o ['A','B','C']
//   public static in(sColumna: string, valores: string, bNot: boolean = false): string {
//     return (bNot ? "not" : "") + "Q(" + sColumna.trim() + "__in=" + valores + ")";
//   }

//   public static entre(sColumna: string, valor1: any, valor2: any, bNot: boolean = false): string {

//     return (bNot ? "not" : "") + "Q(" + sColumna.trim() + "__range=(" +
//       this.formateaValor(valor1) + "," + this.formateaValor(valor2) + "))";
//   }

//   public static contenido(sColumna: string, valor: any, bNot: boolean = false): string {
//     return (bNot ? "not" : "") + "Q(" + sColumna.trim() + this.unaccent(valor) + "__icontains=" + this.formateaValor(valor) + ")";
//   }

//   public static nulo(sColumna: string, bNot: boolean = false): string {
//     return (bNot ? "not" : "") + "Q(" + sColumna.trim() + "__isnull=True)";
//   }

//   public static no_nulo(sColumna: string, bNot: boolean = false): string {
//     return (bNot ? "not" : "") + "Q(" + sColumna.trim() + "__isnull=False)";
//   }

//   // Función que se utiliza en postgreSql para que no distinguir entre vocales acentuadas y sin acentuar
//   // Autor: MP
//   private static unaccent(valor: any): string {

//     if (typeof (valor) === "string") {

//       // Comprobamos que el valor recibido no es una fecha
//       if (valor.length === 10 && this.esValorFecha(valor)) {
//         return "";
//       } else {
//         return "__unaccent";
//       }
//     } else {
//       return "";
//     }
//   }

//   // Comprueba si el valor recibido es una fecha
//   private static esValorFecha(sValor: string) {
//     let okey: boolean = true;

//     try {
//       // Se coge la fecha y se descompone con /
//       const [y, m, d] = sValor.split('-');

//       // Sino encuentra las - fallará
//       if (!y || !m || !d) {
//         throw new Error();
//       }

//       // Sino cumple la longitud fallará
//       if (d.length < 2 || m.length < 2 || y.length < 4) {
//         throw new Error();
//       }
//       okey = true;
//     } catch (error) {
//       okey = false;
//     }
//     return okey;
//   }

//   private static formateaValor(valor: any): any {

//     let sTipo = typeof (valor);

//     if (sTipo === 'string') {
//       return "'" + valor.toString() + "'";
//     } if (sTipo === 'boolean') {
//       if (valor) {
//         return "True";
//       } else {
//         return "False";
//       }
//     } else {
//       return valor
//     }
//   }

// }

