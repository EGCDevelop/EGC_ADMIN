import { FaExclamation } from "react-icons/fa";
import { CustomTextarea } from "../../components/CustomTextarea";
import { useForm } from "../../../hooks/useForm";
import { FormEvent, useState } from "react";
import "../styles/cancel-member-modal.css";

interface FormCancelData {
  comment: string;
}

interface Props {
  onClose: () => void;
}

export const CancelMemberModal = ({ onClose }: Props) => {
  const { formData, onTextAreaChange } = useForm<FormCancelData>({
    comment: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleMemberCancel = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!formData.comment.trim()) {
      newErrors.comment = "Ingresa una justificación para la baja";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    console.log(formData);
  };

  return (
    <>
      <div className="container-main-cancel-member-modal">
        <div className="content-cancel-member-modal">
          <div className="header-cancel-modal">
            <FaExclamation className="icon" />
            <strong>Confirmar Acción</strong>
            <p>
              ¿Estás seguro de que deseas dar de baja a Carlos Eduardo García?
            </p>
          </div>

          <form
            className="form-cancel-member-modal"
            onSubmit={handleMemberCancel}
          >
            <div className="content-comment-cancel-modal">
              <CustomTextarea
                name="comment"
                label="Comentario"
                placeholder="Agrega un comentario"
                request
                value={formData.comment}
                onChange={onTextAreaChange}
                errorMessage={errors.comment}
              />
            </div>
            <div className="container-buttons-cancel-member-modal">
              <button type="button" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit">Dar de baja</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
