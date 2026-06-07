import type { ReactNode } from 'react';

interface AuthFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  icon: ReactNode;
  children?: ReactNode;
}

const AuthField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  minLength,
  icon,
  children,
}: AuthFieldProps) => (
  <div className="auth-field">
    <label htmlFor={id}>{label}</label>
    <div className="auth-field-box">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
      />
      <span className="auth-field-corner-icon" aria-hidden="true">
        {icon}
      </span>
      {children}
    </div>
  </div>
);

export default AuthField;
