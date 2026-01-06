interface Auth {
  id: number;
  nombre: string;
  apellido: string;
  telefono?: string;
  correo?: string;
  idPuesto: number;
  token: string;
  username: string;
  area: string;
  rol: number;
  squadIdList: number[];
}

export default Auth;
