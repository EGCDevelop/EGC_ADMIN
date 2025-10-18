import React, { useState } from "react";

export const useForm = <T>(initState: T) => {
  const [formData, setFormData] = useState<T>(initState);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: Number(event.target.value),
    }));
  };

  const resetForm = () => {
    setFormData({ ...initState });
  };

  const isValidCellPhone = (phone: string): boolean => {
    const regex = /^\d{8}$/;

    return regex.test(phone);
  };

  function wholeNumbers(valor: string): boolean {
    const regex = /^-?\d+$/;
    return regex.test(valor);
  }

  return {
    // properties
    ...formData,
    formData,
    setFormData,
    // validate
    isValidCellPhone,
    wholeNumbers,
    // methods
    onChange,
    onTextAreaChange,
    onSelectChange,
    resetForm,
  };
};
