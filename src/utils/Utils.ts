import QRCodeStyling from "qr-code-styling";
import ComboboxData from "../interfaces/ComboboxData";

class Utils {

  public static normalize = (value: string | null): string | null =>
    value === "" || value === null ? null : value;

  public static validarPassword = (password: string) => {
    const passwordRe =
      /^(?=.{8,}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

    return passwordRe.test(password);
  };

  public static isEightDigits = (tel: string): boolean => {
    const re = /^\d{8}$/;
    return re.test(tel);
  }

  public static isValidPassword = (password: string): boolean => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-]).{8,}$/;
    return passwordRegex.test(password);
  };

  public static stateDataList = (): ComboboxData[] => {
    const stateData: ComboboxData[] = [
      {
        id: 3,
        value: "Nuevo",
      },
      {
        id: 1,
        value: "Antiguo",
      },
    ];

    return stateData;
  }

  public static getPassword = (squadId: number): string => {
    let password: string = "";
    switch (squadId) {
      case 1:
        password = "gas1234"
        break;
      case 2:
        password = "bato1234"
        break;
      case 3:
        password = "vien1234"
        break;
      case 4:
        password = "xilo1234"
        break;
      case 5:
        password = "lir1234"
        break;
      case 6:
        password = "marc1234"
        break;
      case 7:
        password = "tam1234"
        break;
      case 8:
        password = "redo1234"
        break;
      case 9:
        password = "bomb1234"
        break;
      case 10:
        password = "bom1234"
        break;
      case 12:
        password = "gas1234"
        break;
      case 13:
        password = "bato1234"
        break;

      default:
        break;
    }

    return password;
  }

  public static downloadQR = async (data: string, format: "png" | "jpeg" | "svg" | "webp") => {
    const qrExport = new QRCodeStyling({
      width: 500, // resolución grande
      height: 500,
      data,
      dotsOptions: {
        color: "#000",
        type: "dots",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      image: "/egc.jpeg",
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 5,
      },
      // 🔥 Personalización de las esquinas
      cornersSquareOptions: {
        color: "#276fc2ff", // azul oscuro por ejemplo
        type: "classy-rounded", // puedes probar: square | dot | extra-rounded
      },
      cornersDotOptions: {
        color: "#000", // amarillo para el punto central
        type: "classy-rounded", // dot o square
      },
    });

    await qrExport.download({ name: "qr-member", extension: format });
  }
}

export default Utils;
