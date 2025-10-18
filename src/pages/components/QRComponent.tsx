import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef } from "react";
import { FaImage } from "react-icons/fa";
import "../../styles/qr-component.css";

interface QRComponentProps {
  data: string;
}

export const QRComponent = ({ data }: QRComponentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const qr = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    const qrCode = new QRCodeStyling({
      width: 200,
      height: 200,
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

    qr.current = qrCode;

    if (ref.current) {
      qrCode.append(ref.current);
    }

    // cleanup si componente se desmonta
    return () => {
      if (ref.current) {
        ref.current.innerHTML = "";
      }
    };
  }, [data]);

  const handleDownload = async (format: "png" | "jpeg" | "svg" | "webp") => {
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
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div ref={ref} />
      <div style={{ marginTop: "12px" }}>
        <button
          type="button"
          onClick={() => handleDownload("png")}
          className="qr-dowload-button"
        >
          <FaImage /> Descargar
        </button>
      </div>
    </div>
  );
};
