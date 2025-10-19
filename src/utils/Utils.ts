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
}

export default Utils;
