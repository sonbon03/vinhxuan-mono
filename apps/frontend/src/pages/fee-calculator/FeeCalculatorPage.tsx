import React, { useState } from 'react';
import {
  Card,
  Form,
  Select,
  InputNumber,
  Input,
  Button,
  message,
  Descriptions,
  Divider,
  Alert,
  Spin,
} from 'antd';
import { CalculatorOutlined, HistoryOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { documentGroupService, DocumentGroup } from '../../services/document-group.service';
import { feeTypeService, FeeType } from '../../services/fee-type.service';
import { feeCalculationService, FeeCalculation } from '../../services/fee-calculation.service';
import { useAuthStore } from '@/store/auth.store';
import { PageContainer } from '@/components/common/PageContainer';
import { FormSection } from '@/components/common/FormSection';
import { FormActionBar } from '@/components/common/FormActionBar';

const FeeCalculatorPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [selectedDocumentGroup, setSelectedDocumentGroup] = useState<DocumentGroup | null>(null);
  const [selectedFeeType, setSelectedFeeType] = useState<FeeType | null>(null);
  const [calculationResult, setCalculationResult] = useState<FeeCalculation | null>(null);
  const [calculating, setCalculating] = useState(false);

  const { data: documentGroupsData, isLoading: loadingGroups } = useQuery({
    queryKey: ['document-groups', 'active'],
    queryFn: () => documentGroupService.getDocumentGroups({ status: true, limit: 1000 }),
  });

  const { data: feeTypes, isLoading: loadingFeeTypes } = useQuery({
    queryKey: ['fee-types', selectedDocumentGroup?.id],
    queryFn: () => feeTypeService.getFeeTypesByDocumentGroup(selectedDocumentGroup!.id),
    enabled: !!selectedDocumentGroup,
  });

  const calculateMutation = useMutation({
    mutationFn: feeCalculationService.calculateFee,
    onSuccess: (data) => {
      setCalculationResult(data);
      message.success('Tính phí thành công!');
      setCalculating(false);
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Tính phí thất bại');
      setCalculating(false);
    },
  });

  const handleDocumentGroupChange = (value: string) => {
    const group = documentGroupsData?.items.find((g) => g.id === value);
    setSelectedDocumentGroup(group || null);
    setSelectedFeeType(null);
    setCalculationResult(null);
    form.resetFields(['feeTypeId']);
  };

  const handleFeeTypeChange = (value: string) => {
    const feeType = feeTypes?.find((ft) => ft.id === value);
    setSelectedFeeType(feeType || null);
    setCalculationResult(null);
  };

  const handleCalculate = async (values: any) => {
    if (!selectedDocumentGroup || !selectedFeeType) {
      message.error('Vui lòng chọn đầy đủ thông tin');
      return;
    }

    setCalculating(true);

    const inputData: Record<string, any> = {};
    selectedDocumentGroup.formFields?.fields.forEach((field) => {
      if (values[field.name] !== undefined) {
        inputData[field.name] = values[field.name];
      }
    });

    calculateMutation.mutate({
      documentGroupId: selectedDocumentGroup.id,
      feeTypeId: selectedFeeType.id,
      inputData,
    });
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);

  return (
    <PageContainer
      title="Tính phí công chứng"
      subtitle="Chọn loại giấy tờ và nhập thông tin để tính phí tham khảo"
      icon={<CalculatorOutlined />}
      actions={
        isAuthenticated ? (
          <Button icon={<HistoryOutlined />} onClick={() => navigate('/fee-calculator/history')}>
            Lịch sử tính phí
          </Button>
        ) : undefined
      }
    >
      <Alert
        message="Công cụ tính phí tự động"
        description="Chọn loại giấy tờ và nhập thông tin để tính phí công chứng chính xác. Kết quả chỉ mang tính chất tham khảo."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Form form={form} layout="vertical" onFinish={handleCalculate} size="large">
        <FormSection title="Thông tin giấy tờ" icon={<span>📄</span>}>
          <Form.Item
            name="documentGroupId"
            label="Loại giấy tờ công chứng"
            rules={[{ required: true, message: 'Vui lòng chọn loại giấy tờ!' }]}
          >
            <Select
              placeholder="Chọn loại giấy tờ"
              loading={loadingGroups}
              onChange={handleDocumentGroupChange}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={documentGroupsData?.items.map((group) => ({
                label: group.name,
                value: group.id,
              }))}
            />
          </Form.Item>

          {selectedDocumentGroup && (
            <Form.Item
              name="feeTypeId"
              label="Phương thức tính phí"
              rules={[{ required: true, message: 'Vui lòng chọn phương thức tính phí!' }]}
            >
              <Select
                placeholder="Chọn phương thức tính phí"
                loading={loadingFeeTypes}
                onChange={handleFeeTypeChange}
                options={feeTypes?.map((ft) => ({
                  label: `${ft.name} (${ft.calculationMethod})`,
                  value: ft.id,
                }))}
              />
            </Form.Item>
          )}
        </FormSection>

        {selectedDocumentGroup?.formFields?.fields.length ? (
          <FormSection
            title="Thông tin tính phí"
            description="Nhập dữ liệu theo yêu cầu"
            icon={<span>🧾</span>}
          >
            {selectedDocumentGroup.formFields.fields.map((field) => (
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                rules={[
                  {
                    required: field.required,
                    message: `Vui lòng nhập ${field.label.toLowerCase()}!`,
                  },
                ]}
              >
                {field.type === 'number' ? (
                  <InputNumber
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                    style={{ width: '100%' }}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    // parser={(value) => (value ? value.replace(/\$\s?|,(?=\d)/g, '') : 0)}
                  />
                ) : field.type === 'select' ? (
                  <Select
                    placeholder={field.placeholder || `Chọn ${field.label.toLowerCase()}`}
                    options={field.options?.map((opt) => ({ label: opt, value: opt }))}
                  />
                ) : field.type === 'checkbox' ? (
                  <Select
                    placeholder={field.placeholder}
                    options={[
                      { label: 'Có', value: true },
                      { label: 'Không', value: false },
                    ]}
                  />
                ) : (
                  <Input placeholder={field.placeholder} />
                )}
              </Form.Item>
            ))}
          </FormSection>
        ) : null}

        {selectedFeeType && (
          <FormActionBar
            align="center"
            primaryAction={{
              label: 'Tính phí',
              htmlType: 'submit',
              icon: <CalculatorOutlined />,
              loading: calculating,
              size: 'large',
            }}
          />
        )}
      </Form>

      {calculating && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" tip="Đang tính toán..." />
        </div>
      )}

      {calculationResult && !calculating && (
        <>
          <Divider>Kết quả tính phí</Divider>
          <Card style={{ background: '#f0f5ff', marginTop: 24 }}>
            <Descriptions column={1} bordered size="middle">
              {calculationResult.calculationResult.baseFee && (
                <Descriptions.Item label="Phí cơ bản">
                  {formatCurrency(calculationResult.calculationResult.baseFee)}
                </Descriptions.Item>
              )}

              {calculationResult.calculationResult.percentageFee && (
                <Descriptions.Item label="Phí theo tỷ lệ %">
                  {formatCurrency(calculationResult.calculationResult.percentageFee)}
                </Descriptions.Item>
              )}

              {calculationResult.calculationResult.tieredFees &&
                calculationResult.calculationResult.tieredFees.length > 0 && (
                  <Descriptions.Item label="Chi tiết phí bậc thang">
                    {calculationResult.calculationResult.tieredFees.map((tier, index) => (
                      <div key={index} style={{ marginBottom: 8 }}>
                        <strong>Bậc {tier.tier}:</strong> {tier.description}
                        <br />
                        <span style={{ color: '#1890ff' }}>{formatCurrency(tier.amount)}</span>
                      </div>
                    ))}
                  </Descriptions.Item>
                )}

              {calculationResult.calculationResult.additionalFees &&
                calculationResult.calculationResult.additionalFees.length > 0 && (
                  <Descriptions.Item label="Phí phụ thu">
                    {calculationResult.calculationResult.additionalFees.map((fee, index) => (
                      <div key={index} style={{ marginBottom: 8 }}>
                        <strong>{fee.description}:</strong>{' '}
                        {fee.quantity && fee.quantity > 1
                          ? `${fee.quantity} × ${formatCurrency(fee.amount)} = `
                          : ''}
                        <span style={{ color: '#1890ff' }}>{formatCurrency(fee.total)}</span>
                      </div>
                    ))}
                  </Descriptions.Item>
                )}

              <Descriptions.Item label="Tạm tính">
                <strong style={{ fontSize: 16 }}>
                  {formatCurrency(calculationResult.calculationResult.subtotal)}
                </strong>
              </Descriptions.Item>

              <Descriptions.Item label={<strong>Tổng phí</strong>}>
                <strong style={{ fontSize: 20, color: '#52c41a' }}>
                  {formatCurrency(calculationResult.totalFee)}
                </strong>
              </Descriptions.Item>
            </Descriptions>

            <Alert
              message="Lưu ý"
              description="Phí công chứng trên chỉ mang tính chất tham khảo. Phí chính thức sẽ được xác nhận khi bạn nộp hồ sơ tại văn phòng công chứng."
              type="warning"
              showIcon
              style={{ marginTop: 16 }}
            />
          </Card>
        </>
      )}
    </PageContainer>
  );
};

export default FeeCalculatorPage;
