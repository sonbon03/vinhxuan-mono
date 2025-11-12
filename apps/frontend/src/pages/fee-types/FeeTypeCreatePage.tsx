import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Switch,
  Radio,
  Row,
  Col,
  Checkbox,
  Card,
  message,
} from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  feeTypeService,
  CalculationMethod,
  TieredPricingTier,
  AdditionalFee,
} from '../../services/fee-type.service';
import { documentGroupService } from '../../services/document-group.service';
import { PageContainer } from '@/components/common/PageContainer';
import { FormSection } from '@/components/common/FormSection';
import { FormActionBar } from '@/components/common/FormActionBar';

const { TextArea } = Input;

type FeeTypeFormValues = {
  name: string;
  documentGroupId: string;
  baseFee?: number;
  percentage?: number;
  minFee?: number;
  maxFee?: number;
  status?: boolean;
  customFormula?: string;
  [key: string]: unknown;
};

const FeeTypeCreatePage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [calculationMethod, setCalculationMethod] = useState<CalculationMethod>(
    CalculationMethod.FIXED,
  );
  const [tiers, setTiers] = useState<TieredPricingTier[]>([]);
  const [additionalFees, setAdditionalFees] = useState<AdditionalFee[]>([]);

  const { data: documentGroupsData } = useQuery({
    queryKey: ['document-groups', 'active'],
    queryFn: () => documentGroupService.getDocumentGroups({ status: true, limit: 1000 }),
  });

  const createMutation = useMutation({
    mutationFn: feeTypeService.createFeeType,
    onSuccess: () => {
      message.success('Tạo loại phí thành công!');
      navigate('/fee-types');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || 'Tạo loại phí thất bại');
    },
  });

  const addTier = () => {
    setTiers([
      ...tiers,
      {
        from: 0,
        to: null,
        rate: 0,
        description: '',
      },
    ]);
  };

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const updateTier = (index: number, updates: Partial<TieredPricingTier>) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], ...updates };
    setTiers(newTiers);
  };

  const addAdditionalFee = () => {
    setAdditionalFees([
      ...additionalFees,
      {
        name: '',
        amount: 0,
        perUnit: false,
        description: '',
      },
    ]);
  };

  const removeAdditionalFee = (index: number) => {
    setAdditionalFees(additionalFees.filter((_, i) => i !== index));
  };

  const updateAdditionalFee = (index: number, updates: Partial<AdditionalFee>) => {
    const newFees = [...additionalFees];
    newFees[index] = { ...newFees[index], ...updates };
    setAdditionalFees(newFees);
  };

  const handleSubmit = async (values: FeeTypeFormValues) => {
    const formula: {
      method: CalculationMethod;
      tiers?: TieredPricingTier[];
      additionalFees?: AdditionalFee[];
      customFormula?: string;
    } = {
      method: calculationMethod,
    };

    if (
      calculationMethod === CalculationMethod.TIERED ||
      calculationMethod === CalculationMethod.VALUE_BASED
    ) {
      if (tiers.length === 0) {
        message.error('Vui lòng thêm ít nhất một bậc giá!');
        return;
      }
      formula.tiers = tiers;
    }

    if (additionalFees.length > 0) {
      formula.additionalFees = additionalFees;
    }

    if (calculationMethod === CalculationMethod.FORMULA && values.customFormula) {
      formula.customFormula = values.customFormula;
    }

    const data = {
      name: values.name,
      documentGroupId: values.documentGroupId,
      calculationMethod,
      formula,
      baseFee: values.baseFee ?? null,
      percentage: values.percentage ? values.percentage / 100 : null,
      minFee: values.minFee ?? null,
      maxFee: values.maxFee ?? null,
      status: values.status ?? true,
    };

    createMutation.mutate(data);
  };

  return (
    <PageContainer
      title="Tạo loại phí mới"
      subtitle="Thiết lập công thức và phí phụ thu"
      backUrl="/fee-types"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
        <FormSection title="Thông tin chung" icon={<span>📄</span>}>
          <Form.Item
            name="name"
            label="Tên loại phí"
            rules={[{ required: true, message: 'Vui lòng nhập tên loại phí!' }]}
          >
            <Input placeholder="VD: Phí công chứng hợp đồng mua bán" />
          </Form.Item>

          <Form.Item
            name="documentGroupId"
            label="Nhóm giấy tờ áp dụng"
            rules={[{ required: true, message: 'Vui lòng chọn nhóm giấy tờ!' }]}
          >
            <Select
              placeholder="Chọn nhóm giấy tờ"
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
        </FormSection>

        <FormSection title="Phương pháp tính phí" icon={<span>🧮</span>}>
          <Form.Item label="Chọn phương pháp">
            <Radio.Group
              value={calculationMethod}
              onChange={(e) => setCalculationMethod(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value={CalculationMethod.FIXED}>Phí cố định</Radio.Button>
              <Radio.Button value={CalculationMethod.PERCENT}>Phí theo %</Radio.Button>
              <Radio.Button value={CalculationMethod.TIERED}>Phí bậc thang</Radio.Button>
              <Radio.Button value={CalculationMethod.VALUE_BASED}>Theo giá trị</Radio.Button>
              <Radio.Button value={CalculationMethod.FORMULA}>Công thức tùy chỉnh</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {calculationMethod === CalculationMethod.FIXED && (
            <Card size="small" style={{ background: '#fafafa' }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="baseFee"
                    label="Phí cơ bản (VNĐ)"
                    rules={[{ required: true, message: 'Vui lòng nhập phí cơ bản!' }]}
                  >
                    <InputNumber placeholder="VD: 500000" style={{ width: '100%' }} min={0} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="minFee" label="Phí tối thiểu (VNĐ)">
                    <InputNumber placeholder="Tùy chọn" style={{ width: '100%' }} min={0} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="maxFee" label="Phí tối đa (VNĐ)">
                    <InputNumber placeholder="Tùy chọn" style={{ width: '100%' }} min={0} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          )}

          {calculationMethod === CalculationMethod.PERCENT && (
            <Card size="small" style={{ background: '#fafafa' }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="percentage"
                    label="Tỷ lệ % (VD: 1.5 cho 1.5%)"
                    rules={[{ required: true, message: 'Vui lòng nhập tỷ lệ!' }]}
                  >
                    <InputNumber
                      placeholder="VD: 1.5"
                      style={{ width: '100%' }}
                      min={0}
                      max={100}
                      step={0.01}
                      addonAfter="%"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="minFee" label="Phí tối thiểu (VNĐ)">
                    <InputNumber placeholder="Tùy chọn" style={{ width: '100%' }} min={0} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="maxFee" label="Phí tối đa (VNĐ)">
                    <InputNumber placeholder="Tùy chọn" style={{ width: '100%' }} min={0} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          )}

          {(calculationMethod === CalculationMethod.TIERED ||
            calculationMethod === CalculationMethod.VALUE_BASED) && (
            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <h4 style={{ margin: 0 }}>Cấu hình bậc giá</h4>
                <Button type="dashed" icon={<PlusOutlined />} onClick={addTier}>
                  Thêm bậc
                </Button>
              </div>

              {tiers.map((tier, index) => (
                <Card
                  key={index}
                  size="small"
                  style={{ marginBottom: 12, background: '#fafafa' }}
                  title={`Bậc ${index + 1}`}
                  extra={
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeTier(index)}
                    >
                      Xóa
                    </Button>
                  }
                >
                  <Row gutter={12}>
                    <Col span={6}>
                      <InputNumber
                        placeholder="Từ (VNĐ)"
                        value={tier.from}
                        onChange={(value) =>
                          updateTier(index, { from: typeof value === 'number' ? value : 0 })
                        }
                        style={{ width: '100%' }}
                        min={0}
                      />
                    </Col>
                    <Col span={6}>
                      <InputNumber
                        placeholder="Đến (VNĐ)"
                        value={tier.to ?? undefined}
                        onChange={(value) =>
                          updateTier(index, { to: typeof value === 'number' ? value : null })
                        }
                        style={{ width: '100%' }}
                        min={0}
                      />
                    </Col>
                    <Col span={6}>
                      <InputNumber
                        placeholder="Tỷ lệ (VD: 0.015)"
                        value={tier.rate}
                        onChange={(value) =>
                          updateTier(index, { rate: typeof value === 'number' ? value : 0 })
                        }
                        style={{ width: '100%' }}
                        min={0}
                        max={1}
                        step={0.001}
                      />
                    </Col>
                    <Col span={6}>
                      <Input
                        placeholder="Mô tả"
                        value={tier.description}
                        onChange={(e) => updateTier(index, { description: e.target.value })}
                      />
                    </Col>
                  </Row>
                </Card>
              ))}

              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <Form.Item name="minFee" label="Phí tối thiểu (VNĐ)">
                    <InputNumber placeholder="Tùy chọn" style={{ width: '100%' }} min={0} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="maxFee" label="Phí tối đa (VNĐ)">
                    <InputNumber placeholder="Tùy chọn" style={{ width: '100%' }} min={0} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}

          {calculationMethod === CalculationMethod.FORMULA && (
            <Card size="small" style={{ background: '#fafafa' }}>
              <Form.Item name="customFormula" label="Công thức tùy chỉnh">
                <TextArea
                  rows={4}
                  placeholder="Nhập công thức tính phí (JSON hoặc mô tả chi tiết)"
                />
              </Form.Item>
            </Card>
          )}
        </FormSection>

        <FormSection
          title="Phí phụ thu"
          description="Các khoản phí được cộng thêm vào tổng phí"
          icon={<span>➕</span>}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <p style={{ margin: 0, color: '#666' }}>
              Các khoản phí phụ sẽ được cộng thêm vào tổng phí
            </p>
            <Button type="dashed" icon={<PlusOutlined />} onClick={addAdditionalFee}>
              Thêm phí phụ
            </Button>
          </div>

          {additionalFees.map((fee, index) => (
            <Card
              key={index}
              size="small"
              style={{ marginBottom: 12, background: '#fafafa' }}
              title={`Phí phụ ${index + 1}`}
              extra={
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeAdditionalFee(index)}
                >
                  Xóa
                </Button>
              }
            >
              <Row gutter={12}>
                <Col span={8}>
                  <Input
                    placeholder="Tên phí (VD: copy_fee)"
                    value={fee.name}
                    onChange={(e) => updateAdditionalFee(index, { name: e.target.value })}
                  />
                </Col>
                <Col span={6}>
                  <InputNumber
                    placeholder="Số tiền (VNĐ)"
                    value={fee.amount}
                    onChange={(value) =>
                      updateAdditionalFee(index, { amount: typeof value === 'number' ? value : 0 })
                    }
                    style={{ width: '100%' }}
                    min={0}
                  />
                </Col>
                <Col span={4}>
                  <Checkbox
                    checked={fee.perUnit}
                    onChange={(e) => updateAdditionalFee(index, { perUnit: e.target.checked })}
                  >
                    Theo đơn vị
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Input
                    placeholder="Mô tả"
                    value={fee.description}
                    onChange={(e) => updateAdditionalFee(index, { description: e.target.value })}
                  />
                </Col>
              </Row>
            </Card>
          ))}
        </FormSection>

        <FormSection title="Thiết lập" icon={<span>⚙️</span>}>
          <Form.Item name="status" label="Trạng thái" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="Kích hoạt" unCheckedChildren="Tạm ngưng" />
          </Form.Item>
        </FormSection>

        <FormActionBar
          secondaryAction={{ label: 'Hủy', onClick: () => navigate('/fee-types'), size: 'large' }}
          primaryAction={{
            label: 'Tạo loại phí',
            htmlType: 'submit',
            icon: <SaveOutlined />,
            loading: createMutation.isPending,
            size: 'large',
          }}
        />
      </Form>
    </PageContainer>
  );
};

export default FeeTypeCreatePage;
