import "../../styles/custom-input.css";

interface Props {
  label?: string;
  request?: boolean;
  name: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  value: string;
  icon?: React.JSX.Element;
  errorMessage?: string;
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
          onChange={onChange}
        />
      </div>
      {errorMessage && <span className="custom-input-error">{errorMessage}</span>}
    </div>
  );
};
