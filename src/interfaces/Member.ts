interface Member {
  idIntegrante: number | null;
  nombres: string;
  apellidos: string;
  edad: number | null;
  telefono: string;
  idEstablecimiento: number;
  establecimientoNombre: string | null;
  idCarrera: number;
  carreraNombre: string | null;
  idGrado: number;
  gradoNombre: string | null;
  seccion: string;
  idEscuadra: number;
  idPuesto: number;
  esNuevo: number;
  usuario: string | null;
  estadoIntegrante: number;
  nombreEncargado: string;
  telefonoEncargado: string;
  complicacionMedica: number;
  descripcionComplicacionMedica: string | null;
  perteneceALinea: number;
  tipoLinea?: number | null;
  encargadoLinea?: number | null;
  categoria: number;
}

export default Member;
