type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  secondaryLabel?: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
  ariaLabel?: string;
};

export function Select({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  secondaryLabel,
  helper,
  error,
  disabled,
  ariaLabel,
}: SelectProps) {
  return (
    <div className="input-block">
      {label && (
        <label className="label" htmlFor={id}>
          <span className="label-primary-group">
            <span>{label}</span>
            {required && (
              <span className={`required${value.trim() ? " required-filled" : ""}`}>*</span>
            )}
          </span>
          {secondaryLabel && <span className="label-secondary">{secondaryLabel}</span>}
        </label>
      )}
      <select
        id={id}
        className={`select${error ? " input-invalid" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
        aria-label={!label ? ariaLabel : undefined}
        disabled={disabled}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
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
