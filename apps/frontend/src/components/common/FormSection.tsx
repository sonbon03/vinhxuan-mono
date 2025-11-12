import React from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  icon,
  actions,
  children,
  style,
}) => {
  return (
    <section className="form-section" style={style}>
      <header className="form-section-header">
        <div className="form-section-heading">
          {icon && <span className="form-section-icon">{icon}</span>}
          <div>
            <h3>{title}</h3>
            {description && <p>{description}</p>}
          </div>
        </div>
        {actions && <div className="form-section-actions">{actions}</div>}
      </header>
      {children}
    </section>
  );
};

export default FormSection;
