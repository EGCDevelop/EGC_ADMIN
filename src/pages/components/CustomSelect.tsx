import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import ComboboxData from "../../interfaces/ComboboxData";
import { FaChevronDown } from "react-icons/fa6";
import "../../styles/custom-select.css";

interface Props {
  label?: string;
  request?: boolean;
  name: string;
  initValue?: boolean;
  disabled?: boolean;
  value?: string | number;
  dataList: ComboboxData[];
  errorMessage?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export const CustomSelect = ({
  label,
  request = false,
  name,
  initValue = false,
  disabled = false,
  value,
  dataList,
  errorMessage,
  onChange,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<string | number | undefined>(value);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [hasFocus, setHasFocus] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  // Cierra al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Emula un evento ChangeEvent<HTMLSelectElement> para compatibilidad con useForm
  const triggerChangeEvent = (newValue: string | number) => {
    if (onChange) {
      const syntheticEvent = {
        target: {
          name,
          value: newValue.toString(),
        },
      } as unknown as ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }
  };

  const handleSelect = (id: number | string, label: string) => {
    setSelected(id);
    setSearch(label);
    triggerChangeEvent(id);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // filtramos los resultados al escribir
  const filteredData = dataList.filter((data) =>
    data.value.toString().toLowerCase().includes(search.toLowerCase())
  );

  // Inserta "Seleccione" al inicio si corresponde
  const optionsToShow = initValue
    ? [{ id: 0, value: "Seleccione" }, ...filteredData]
    : filteredData;

  // Control del teclado
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < optionsToShow.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : optionsToShow.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selectedOption = optionsToShow[highlightIndex];
      if (selectedOption) {
        handleSelect(selectedOption.id, selectedOption.value.toString());
      }
    }
  };

  const selectedLabel =
    dataList.find((item) => item.id === selected)?.value ??
    (initValue ? "Seleccione" : "");

  return (
    <div className="container-custom-select">
      <label htmlFor={name}>
        {label} {request && "*"}
      </label>
      <div
        ref={ref}
        className={`custom-dropdown ${disabled ? "disabled" : ""} ${errorMessage ? "has-error" : ""
          }`}
      >
        <div
          // className="dropdown-toggle search-mode"
          className={`dropdown-toggle search-mode ${hasFocus ? "focused" : ""}`}
          onClick={() => {
            if (disabled) return;

            setIsOpen((prev) => {
              // Si el menú está CERRADO → ábrelo, pero NO limpies search todavía
              if (!prev) return true;

              // Si el menú YA estaba abierto → limpia el filtro al volver a abrir
              setSearch("");
              return true;
            });
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={isOpen ? search : selectedLabel}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => {
              setIsOpen(true);
              setHasFocus(true);
            }}
            onBlur={() => setHasFocus(false)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar..."
            disabled={disabled}
          />
          <FaChevronDown className={`icon ${isOpen ? "open" : ""}`} />
        </div>

        {isOpen && (
          <ul className="dropdown-menu">
            {optionsToShow.length > 0 ? (
              optionsToShow.map((item, index) => (
                <li
                  key={item.id}
                  className={`option 
                    ${selected === item.id ? "selected" : ""} 
                    ${index === highlightIndex ? "highlighted" : ""}`}
                  onClick={() => handleSelect(item.id, item.value.toString())}
                >
                  {item.value}
                </li>
              ))
            ) : (
              <li className="no-results">Sin resultados</li>
            )}
          </ul>
        )}
      </div>

      {errorMessage && (
        <span className="custom-select-error">{errorMessage}</span>
      )}
    </div>
  );
};