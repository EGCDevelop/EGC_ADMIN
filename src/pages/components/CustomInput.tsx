import "../../styles/custom-input.css";

interface Props {
  label?: string;
  request?: boolean;
  name: string;
  type?:
    | "text"
    | "number"
    | "color"
    | "email"
    | "search"
    | "url"
    | "tel"
    | "file"
    | "hidden"
    | "image"
    | "password";
  placeholder?: string;
  disabled?: boolean;
  value: string;
  icon?: React.JSX.Element;
  errorMessage?: string;
  min?: number;
  max?: number;
  step?: number;
  minLength?: number;
  maxLength?: number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomInput = ({
  label,
  request = false,
  name,
  type = "text",
  placeholder,
  disabled = false,
  value,
  icon,
  errorMessage,
  min,
  max,
  step,
  minLength,
  maxLength,
  onChange,
}: Props) => {
  return (
    <div className="container-custom-input">
      <label htmlFor={name}>
        {label} {request ? "*" : ""}
      </label>
      <div className={`custom-input ${errorMessage ? "has-error" : ""}`}>
        <div className="member-page-svg_icon">{icon}</div>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          style={{ paddingLeft: `${icon ? "42px" : "12px"}` }}
          disabled={disabled}
          value={value}
          min={type === "number" ? min : undefined}
          max={type === "number" ? max : undefined}
          step={type === "number" ? step : undefined}
          minLength={minLength}
          maxLength={maxLength}
          onChange={onChange}
        />
      </div>
      {errorMessage && (
        <span className="custom-input-error">{errorMessage}</span>
      )}
    </div>
  );
};
