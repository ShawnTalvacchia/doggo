type InputFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  secondaryLabel?: string;
  helper?: string;
  error?: string;
};

export function InputField({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  required,
  secondaryLabel,
  helper,
  error,
}: InputFieldProps) {
  return (
    <div className="input-block">
      <label className="label" htmlFor={id}>
        <span className="label-primary-group">
          <span>{label}</span>
          {required && (
            <span className={`required${value.trim() ? " required-filled" : ""}`}>*</span>
          )}
        </span>
        {secondaryLabel && <span className="label-secondary">{secondaryLabel}</span>}
      </label>
      <input
        id={id}
        className={`input${error ? " input-invalid" : ""}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        type={type}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
      />
      {error && (
        <div id={`${id}-error`} className="input-error-msg" role="alert">
          {error}
        </div>
      )}
      {!error && helper && (
        <div id={`${id}-helper`} className="helper">
          {helper}
        </div>
      )}
    </div>
  );
}
