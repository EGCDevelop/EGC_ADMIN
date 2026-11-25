import { FormEvent, useEffect, useState } from "react";
import { useForm } from "../../../hooks/useForm";
import ImplementsForm from "../../../interfaces/ImplementsForm";
import Utils from "../../../utils/Utils";
import { CustomInput } from "../../components/CustomInput";
import { CustomSelect } from "../../components/CustomSelect";
import "../styles/implements-model.css";
import { useUniformStore } from "../../../hooks/useUniformStore";

interface Props {
  onClose: () => void;
  data?: ImplementsForm | undefined | null;
}

export const ImplementsModel = ({ onClose, data }: Props) => {
  const { InsertUniform, UpdateUniform } = useUniformStore();
  const { formData, setFormData, onChange, onSelectChange } =
    useForm<ImplementsForm>({
      id: 0,
      name: "",
      price: 0,
      state: 1,
    });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const insertOrUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Ingrese el nombre de un implemento";
    }

    if (Number(formData.price) <= 0) {
      newErrors.price = "El monto no puede ser igual o menor a cero";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // INSERT
    if (formData.id === 0) {
      InsertUniform(formData);
    }
    // UPDATE
    else {
      UpdateUniform(formData);
    }
  };

  useEffect(() => {
    if (data && data.id !== 0) {
      setFormData({
        id: data.id,
        name: data.name,
        price: data.price,
        state: data.state,
      });
    }
  }, [data]);

  return (
    <form
      method="POST"
      onSubmit={insertOrUpdate}
      className="container-form-implements-model"
    >
      <CustomInput
        type="search"
        label="Nombre"
        name="name"
        placeholder="Nombre del implemento"
        request
        value={formData.name}
        onChange={onChange}
        errorMessage={errors.name}
      />
      <CustomInput
        type="number"
        name="price"
        label="Precio"
        request
        value={formData.price.toString()}
        onChange={onChange}
        errorMessage={errors.price}
      />
      <CustomSelect
        label="Estado"
        name="state"
        value={formData.state}
        request
        dataList={Utils.instructorStateDataList()}
        onChange={onSelectChange}
        disabled={formData.id === 0}
      />
      <div className="action-buttons-form-implements-model">
        <button onClick={onClose}>Cancelar</button>
        <button>Guardar</button>
      </div>
    </form>
  );
};
