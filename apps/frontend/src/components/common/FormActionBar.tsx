import React from 'react';
import { Button, ButtonProps } from 'antd';

interface FormActionButton extends ButtonProps {
  label: string;
}

interface FormActionBarProps {
  primaryAction: FormActionButton;
  secondaryAction?: FormActionButton;
  extras?: React.ReactNode;
  align?: 'left' | 'right' | 'center' | 'space-between';
  style?: React.CSSProperties;
}

export const FormActionBar: React.FC<FormActionBarProps> = ({
  primaryAction,
  secondaryAction,
  extras,
  align = 'right',
  style,
}) => {
  const { label: primaryLabel, style: primaryStyle, ...primaryButtonProps } = primaryAction;
  const secondaryProps = secondaryAction
    ? {
        label: secondaryAction.label,
        style: secondaryAction.style,
        rest: (({ label, style, ...rest }) => rest)(secondaryAction),
      }
    : null;

  return (
    <div
      className="form-action-bar"
      style={{
        display: 'flex',
        gap: 12,
        paddingTop: 24,
        borderTop: '1px solid #f3f4f6',
        justifyContent:
          align === 'left'
            ? 'flex-start'
            : align === 'right'
              ? 'flex-end'
              : align === 'center'
                ? 'center'
                : 'space-between',
        ...style,
      }}
    >
      {secondaryProps && (
        <Button
          {...secondaryProps.rest}
          style={{ minWidth: 140, borderRadius: 12, height: 44, ...secondaryProps.style }}
        >
          {secondaryProps.label}
        </Button>
      )}
      {extras}
      <Button
        type="primary"
        {...primaryButtonProps}
        style={{
          minWidth: 160,
          borderRadius: 12,
          height: 46,
          fontSize: 15,
          fontWeight: 600,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.45)',
          ...primaryStyle,
        }}
      >
        {primaryLabel}
      </Button>
    </div>
  );
};

export default FormActionBar;
