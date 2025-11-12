import React from 'react';
import { Card, Typography, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './PageContainer.css';

const { Title } = Typography;

interface PageContainerProps {
  title: string;
  subtitle?: string;
  backUrl?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: number;
  icon?: React.ReactNode;
  background?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  backUrl,
  extra,
  children,
  maxWidth = 1200,
  icon,
  background,
  actions,
  className,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`page-container ${className || ''}`.trim()}
      style={{ maxWidth, margin: '0 auto', background: background || undefined }}
    >
      <div className="page-header">
        <div className="page-header-content">
          {backUrl && (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(backUrl)}
              className="back-button"
            />
          )}
          <div className="page-title-section">
            {icon && <div className="page-header-icon">{icon}</div>}
            <Title level={2} className="page-title">
              {title}
            </Title>
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
        </div>
        {(extra || actions) && (
          <div className="page-header-extra">
            {actions}
            {extra}
          </div>
        )}
      </div>
      <Card className="page-card" bordered={false}>
        {children}
      </Card>
    </div>
  );
};
