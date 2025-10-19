interface MemberDTO {
    intIdIntegrante: number;
    intNombres: string;
    intApellidos: string;
    intEdad: number;
    intTelefono: string;
    intestIdEstablecimiento: number;
    estNombreEstablecimiento: string;
    intEstablecimientoNombre: string;
    intcarIdCarrera: number;
    carNombreCarrera: string;
    intCarreraNombre: string;
    intgraIdGrado: number;
    graNombreGrado: string;
    intGradoNombre: string;
    intSeccion: string;
    intescIdEscuadra: number;
    escNombre: string
    intEsNuevo: number;
    intNombreEncargado: string;
    intTelefonoEncargado: string;
    intEstadoIntegrante: number;
    intpuIdPuesto: number;
    puNombre: string;
    intUsuario?: string;
}

export default MemberDTO;