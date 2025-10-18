import "../../styles/custom-textarea.css";

interface Props {
  label?: string;
  request?: boolean;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  value: string;
  errorMessage?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const CustomTextarea = ({
  label,
  request = false,
  name,
  placeholder,
  disabled = false,
  value,
  errorMessage,
  onChange,
}: Props) => {
  return (
    <div className="custom-textarea">
      <label htmlFor={name}>
        {label} {request ? "*" : ""}
      </label>
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        // className={`${errorMessage ? "has-error" : ""}`}
        className={errorMessage ? "error" : ""}
      ></textarea>
      {errorMessage && (
        <span className="custom-input-error">{errorMessage}</span>
      )}
    </div>
  );
};
