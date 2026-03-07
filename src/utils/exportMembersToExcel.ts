import * as XLSX from 'xlsx';
import MemberDTO from "../interfaces/MemberDTO";

export const exportMembersToExcel = (data: MemberDTO[]) => {
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString('es-GT').replace(/\//g, '-'); // Formato DD-MM-YYYY
    const hora = ahora.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');
    const fileName = `reporte_integrantes_${fecha}_${hora}.xlsx`;

    const worksheetData = data.map((member, index) => ({
        "#": index += 1,
        "Nombres": member.intNombres,
        "Apellidos": member.intApellidos,
        "Edad": member.intEdad,
        "Teléfono": member.intTelefono,
        "Establecimiento": member.estNombreEstablecimiento || member.intEstablecimientoNombre,
        "Carrera": member.carNombreCarrera || member.intCarreraNombre,
        "Grado": member.graNombreGrado || member.intGradoNombre,
        "Sección": member.intSeccion,
        "Escuadra": member.escNombre,
        "Encargado": member.intNombreEncargado,
        "Tel. Encargado": member.intTelefonoEncargado,
        "Puesto": member.puNombre,
        "Complicación Médica": member.complicacionMedica === 1 ? 'Sí' : 'No',
        "Descripción Médica": member.descripcionComplicacionMedica || 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Integrantes");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const dataBlob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`);

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}