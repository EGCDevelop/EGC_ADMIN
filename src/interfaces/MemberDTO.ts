interface MemberDTO {
    intIdIntegrante: number;
    intNombres: string;
    intApellidos: string;
    intTelefono: string;
    intESTIdEstablecimiento: number;
    estNombreEstablecimiento: string;
    intEstablecimientoNombre: string;
    intCARIdCarrera: number;
    carNombreCarrera: string;
    intCarreraNombre: string;
    intGRAIdGrado: number;
    graNombreGrado: string;
    intGradoNombre: string;
    intSeccion: string;
    intESCIdEscuadra: number;
    escNombre: string
    intEsNuevo: number;
    intNombreEncargado: string;
    intTelefonoEncargado: string;
    intEstadoIntegrante: number;
    intPUIdPuesto: number;
    puNombre: string;
}

export default MemberDTO;