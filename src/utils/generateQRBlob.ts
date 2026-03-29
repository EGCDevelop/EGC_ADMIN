import QRCodeStyling from "qr-code-styling";

const generateQRBlob = async (data: string, logoBase64: string): Promise<Blob | null> => {
  const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    data: data,
    dotsOptions: { color: "#000", type: "dots" },
    backgroundOptions: { color: "#ffffff" },
    image: logoBase64, // Pasamos el logo ya procesado
    imageOptions: { 
        crossOrigin: "anonymous", 
        margin: 5,
        imageSize: 0.4 
    },
    cornersSquareOptions: { 
        color: "#276fc2ff", 
        type: "classy-rounded" 
    },
    cornersDotOptions: { 
        color: "#000", 
        type: "classy-rounded" 
    },
  });

  return await qrCode.getRawData("png");
};

export default generateQRBlob;