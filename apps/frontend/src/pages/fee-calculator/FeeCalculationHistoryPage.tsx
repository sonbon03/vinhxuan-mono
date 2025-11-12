import React, { useRef } from 'react';
import { Button, Tag, Descriptions, Modal } from 'antd';
import { EyeOutlined, CalculatorOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { feeCalculationService, FeeCalculation } from '../../services/fee-calculation.service';
import dayjs from 'dayjs';
import { PageContainer } from '@/components/common/PageContainer';

const FeeCalculationHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);

  const showCalculationDetail = (record: FeeCalculation) => {
    Modal.info({
      title: 'Chi tiết tính phí',
      width: 800,
      content: (
        <div>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Loại giấy tờ">{record.documentGroup.name}</Descriptions.Item>
            <Descriptions.Item label="Phương thức tính">{record.feeType.name}</Descriptions.Item>

            {record.calculationResult.baseFee && (
              <Descriptions.Item label="Phí cơ bản">
                {formatCurrency(record.calculationResult.baseFee)}
              </Descriptions.Item>
            )}

            {record.calculationResult.percentageFee && (
              <Descriptions.Item label="Phí theo %">
                {formatCurrency(record.calculationResult.percentageFee)}
              </Descriptions.Item>
            )}

            {record.calculationResult.tieredFees && record.calculationResult.tieredFees.length > 0 && (
              <Descriptions.Item label="Phí bậc thang">
                {record.calculationResult.tieredFees.map((tier, index) => (
                  <div key={index} style={{ marginBottom: 8 }}>
                    <strong>Bậc {tier.tier}:</strong> {tier.description}
                    <br />
                    <span style={{ color: '#1890ff' }}>{formatCurrency(tier.amount)}</span>
                  </div>
                ))}
              </Descriptions.Item>
            )}

            {record.calculationResult.additionalFees && record.calculationResult.additionalFees.length > 0 && (
              <Descriptions.Item label="Phí phụ">
                {record.calculationResult.additionalFees.map((fee, index) => (
                  <div key={index} style={{ marginBottom: 8 }}>
                    <strong>{fee.description}:</strong>{' '}
                    {fee.quantity && fee.quantity > 1 ? `${fee.quantity} × ${formatCurrency(fee.amount)} = ` : ''}
                    <span style={{ color: '#1890ff' }}>{formatCurrency(fee.total)}</span>
                  </div>
                ))}
              </Descriptions.Item>
            )}

            <Descriptions.Item label="Tạm tính">
              <strong>{formatCurrency(record.calculationResult.subtotal)}</strong>
            </Descriptions.Item>

            <Descriptions.Item label={<strong>Tổng phí</strong>}>
              <strong style={{ fontSize: 18, color: '#52c41a' }}>
                {formatCurrency(record.totalFee)}
              </strong>
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: 16 }}>
            <strong>Dữ liệu nhập vào:</strong>
            <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4, marginTop: 8 }}>
              {JSON.stringify(record.inputData, null, 2)}
            </pre>
          </div>
        </div>
      ),
    });
  };

  const columns: ProColumns<FeeCalculation>[] = [
    {
      title: 'Loại giấy tờ',
      dataIndex: ['documentGroup', 'name'],
      key: 'documentGroupName',
      ellipsis: true,
      width: 250,
    },
    {
      title: 'Phương thức tính',
      dataIndex: ['feeType', 'name'],
      key: 'feeTypeName',
      ellipsis: true,
      width: 200,
    },
    {
      title: 'Phương pháp',
      dataIndex: ['feeType', 'calculationMethod'],
      key: 'calculationMethod',
      width: 130,
      render: (_, record) => {
        const method = record.feeType.calculationMethod;
        const colorMap: Record<string, string> = {
          FIXED: 'default',
          PERCENT: 'blue',
          TIERED: 'green',
          VALUE_BASED: 'orange',
          FORMULA: 'purple',
        };
        return <Tag color={colorMap[method] || 'default'}>{method}</Tag>;
      },
    },
    {
      title: 'Tổng phí',
      dataIndex: 'totalFee',
      key: 'totalFee',
      width: 150,
      sorter: true,
      render: (_, record) => <strong style={{ color: '#52c41a' }}>{formatCurrency(record.totalFee)}</strong>,
    },
    {
      title: 'Ngày tính',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      sorter: true,
      render: (_, record) => dayjs(record.createdAt).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => showCalculationDetail(record)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <PageContainer title="Lịch sử tính phí của tôi" backUrl="/fee-calculator">
      <ProTable<FeeCalculation>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort) => {
          const sortBy = Object.keys(sort || {})[0] || 'createdAt';
          const sortOrder = sort?.[sortBy] === 'ascend' ? 'ASC' : 'DESC';

          const response = await feeCalculationService.getMyCalculations({
            page: params.current || 1,
            limit: params.pageSize ?? 20,
            sortBy,
            sortOrder,
          });

          return {
            data: response.items,
            success: true,
            total: response.total,
          };
        }}
        rowKey="id"
        search={false}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`,
          pageSizeOptions: [10, 20, 50, 100],
          showLessItems: false,
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <Button key="calculate" type="primary" icon={<CalculatorOutlined />} onClick={() => navigate('/fee-calculator')}>
            Tính phí mới
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default FeeCalculationHistoryPage;
