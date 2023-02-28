//Resumen: librerías de valicación
//Autor: MP

// Comprueba si el objeto recibido es null o undefined
export function isNullUndefined(a: any): boolean {
  return (a == null || a == undefined || a === 'null' || a === 'undefined');
}

// Comprueba si la cadena recibida es null, undefined o vacia
export function isNullUndefinedVacio(a: string): boolean {
  return (a == null || a == undefined || a === '' || a === 'null' || a === 'undefined');
}

/**
 * Valida cualquier tipo de valor que reciba si esta vacío o no
 * @author Beni
 * @param oData Objeto a validar
 * @examples
 * @returns true (Vacío) | false (No vacío)
 */
export function isEmpty(oData: any): boolean {
  return oData == null
  || oData == undefined || oData === 'null' || oData === 'undefined'
  || (typeof oData === "string" && oData === '')
  || (Array.isArray(oData) && oData.length < 1)
  || typeof oData === 'object' && oData !== null && Object.keys(oData).length === 0
}

// ----------------- VALIDACIONES de NIF,NIE y CIF ---------------------
// Autor: MP / BENI

const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
const NIF_REGEX = /^(\d{8})([A-Z])$/;
const CIF_REGEX = /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/;
const NIE_REGEX = /^[XYZ]\d{7,8}[A-Z]$/;
const NUM_REGEX = /^\d+$/;

export function validarEmail(sEmail: string): boolean {
  return EMAIL_REGEX.test(sEmail);
}

export function validarUrlExterna(sUrl: string): boolean {
  return (/^http[s]?:\/\//.test(sUrl.toLowerCase()));
}

export const aValidacionesRegex = [
  {
    tipo: 'NIF',
    regex: NIF_REGEX,
  },
  {
    tipo: 'NIE',
    regex: NIE_REGEX,
  },
  {
    tipo: 'CIF',
    regex: CIF_REGEX,
  },
  {
    tipo: 'EMAIL',
    regex: EMAIL_REGEX,
  }
];

export function validarRegexExistente(sTipo: string, sDocumento: string): boolean {
  if (isNullUndefinedVacio(sTipo.toString()) || isNullUndefinedVacio(sDocumento.toString())) {
    return false;
  }
  let sRegex = this.aValidacionesRegex.find(x => x.tipo == sTipo);
  if (!sRegex.regex.test(sDocumento)) {
    return false;
  } else {
    return true;
  }
}

export interface IValidaIdentificador {
  tipo: string;
  identificador: string;
  letra: string;
  letra_ok: string;
  valido: boolean;
  aviso: string;
  keytranslate: string;
}

export function ValidaNIFCIFNIE(sTipoCodigo: string, sCodigo: string): IValidaIdentificador {

  var oValida: IValidaIdentificador = { tipo: '', identificador: '', letra: '', valido: false, aviso: '', keytranslate: '', letra_ok: '' };

  // Lo pasamos a mayúsculas y le quitamos los espacios en blanco

  oValida.identificador = sCodigo.toUpperCase().replace(/\s/, '');
  sTipoCodigo = sTipoCodigo.toUpperCase();

  if (sCodigo.match(NIF_REGEX)) {
    oValida.tipo = 'NIF';
  }
  if (sCodigo.match(CIF_REGEX)) {
    oValida.tipo = 'CIF';
  }
  if (sCodigo.match(NIE_REGEX)) {
    oValida.tipo = 'NIE';
  }

  // Validamos que el tipo recibido sea igual que el obtenido por la función

  if (oValida.tipo !== sTipoCodigo) {
    switch (oValida.tipo) {
      case 'NIF':
        oValida.aviso = 'El identificador no es de tipo NIF.';
        oValida.keytranslate = 'error-valida-form.administrado.notiponif';
        break;
      case 'NIE':
        oValida.aviso = 'El identificador no es de tipo NIE.';
        oValida.keytranslate = 'error-valida-form.administrado.notiponie';
        break;
      case 'CIF':
        oValida.aviso = 'El identificador no es de tipo CIF.';
        oValida.keytranslate = 'error-valida-form.administrado.notipocif';
        break;
    }
  } else {
    switch (oValida.tipo) {
      case 'NIF':
        oValida.valido = validaDNI(oValida);
        break;
      case 'NIE':
        oValida.valido = validaNIE(oValida);
        break;
      case 'CIF':
        oValida.valido = validaCIF(oValida);
        break;
    }
    if (!oValida.valido) {
      if (oValida.letra != oValida.letra_ok) {
        oValida.aviso += 'Identificador no válido, la letra correcta es ' + oValida.letra_ok;
        oValida.keytranslate = 'error-valida-form.administrado.identificador-letra-incorrecta';
      } else {
        oValida.aviso = 'Identificador no válido.';
        oValida.keytranslate = 'error-valida-form.administrado.identificador-no-valido';
      }
    }
  }
  return oValida;
}

function validaDNI(oValida: IValidaIdentificador): boolean {

  var dni_letters = "TRWAGMYFPDXBNJZSQVHLCKE";

  oValida.letra_ok = dni_letters.charAt(parseInt(oValida.identificador, 10) % 23);
  oValida.letra = oValida.identificador.charAt(8);

  return oValida.letra_ok == oValida.letra;
}

function validaNIE(oValida: IValidaIdentificador): boolean {

  // Change the initial letter for the corresponding number and validate as DNI
  var nie_prefix: any = oValida.identificador.charAt(0);

  switch (nie_prefix) {
    case 'X': nie_prefix = 0; break;
    case 'Y': nie_prefix = 1; break;
    case 'Z': nie_prefix = 2; break;
  }

  oValida.identificador = nie_prefix + oValida.identificador.substr(1);

  return validaDNI(oValida);
}

function validaCIF(oValida: IValidaIdentificador): boolean {
  var cif_ok: boolean = false;
  var sumaPares: number = 0;
  var sumaImpares: number = 0;
  var sumaParcial: number = 0;
  var total: number;
  var unidades: number;
  var digitoControl: number;

  var letras: string = "JABCDEFGHI";
  var ultimoCaracter: string = oValida.identificador.substr(oValida.identificador.trim.length - 1, 1);

  var subcad: string = oValida.identificador.substr(1, oValida.identificador.length - 2);
  subcad = subcad.padStart(7, '0');

  // comprobamos que la cadena subcad sean todos dígitos

  if (subcad.match(NUM_REGEX)) {
    for (var i = 1; i <= subcad.length; i++) {
      if (i % 2 === 0) {
        sumaPares = sumaPares + parseInt(subcad.substr(i - 1, 1));
      } else {
        sumaParcial = 2 * parseInt(subcad.substr(i - 1, 1));
        if (sumaParcial > 9) {
          sumaParcial = 1 + sumaParcial % 10;
        } else {
          sumaParcial = sumaParcial % 10;
        }
        sumaImpares = sumaImpares + sumaParcial;
      }
    }
    total = sumaPares + sumaImpares;
    unidades = total % 10;
    digitoControl = (10 - unidades) % 10;

    if (ultimoCaracter.match(NUM_REGEX)) {
      cif_ok = digitoControl === parseInt(ultimoCaracter);
    } else {
      cif_ok = (letras.substr(digitoControl % 10, 1) === ultimoCaracter);
    }

  } else {
    cif_ok = false;
  }

  return cif_ok;
}

export function isString(s: any) {
  return typeof (s) === 'string' || s instanceof String;
}
