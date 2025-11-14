import { useRef, useState } from 'react';
import { Button, Tag, message, Space, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { ProTable, ActionType, ProColumns } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { employeeService, Employee, EmployeeStatus } from '@/services/employee.service';
import Can from '@/components/Can';
import dayjs from 'dayjs';

const statusColors: Record<EmployeeStatus, string> = {
  [EmployeeStatus.WORKING]: 'green',
  [EmployeeStatus.ON_LEAVE]: 'orange',
  [EmployeeStatus.RESIGNED]: 'default',
};

const statusLabels: Record<EmployeeStatus, string> = {
  [EmployeeStatus.WORKING]: 'Đang làm việc',
  [EmployeeStatus.ON_LEAVE]: 'Tạm nghỉ',
  [EmployeeStatus.RESIGNED]: 'Nghỉ việc',
};

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ProColumns<Employee>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 60,
      fixed: 'left',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left',
      sorter: true,
    },
    {
      title: 'Chức vụ',
      dataIndex: 'position',
      key: 'position',
      width: 200,
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 250,
      copyable: true,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      search: false,
    },
    {
      title: 'Kinh nghiệm',
      dataIndex: 'yearsOfExperience',
      key: 'yearsOfExperience',
      width: 120,
      render: (_, record) => `${record.yearsOfExperience} năm`,
      search: false,
      sorter: true,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      width: 150,
      valueType: 'date',
      render: (_, record) =>
        record.dateOfBirth ? dayjs(record.dateOfBirth).format('DD/MM/YYYY') : '-',
      search: false,
      sorter: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      filters: true,
      valueEnum: {
        [EmployeeStatus.WORKING]: { text: statusLabels[EmployeeStatus.WORKING], status: 'Success' },
        [EmployeeStatus.ON_LEAVE]: {
          text: statusLabels[EmployeeStatus.ON_LEAVE],
          status: 'Warning',
        },
        [EmployeeStatus.RESIGNED]: {
          text: statusLabels[EmployeeStatus.RESIGNED],
          status: 'Default',
        },
      },
      render: (_, record) => (
        <Tag color={statusColors[record.status]}>{statusLabels[record.status]}</Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      valueType: 'dateTime',
      render: (_, record) => dayjs(record.createdAt).format('DD/MM/YYYY HH:mm'),
      search: false,
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => [
        <Tooltip key="view" title="Xem chi tiết">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/employees/${record.id}`)}
          />
        </Tooltip>,
        <Can key="edit" module="employees" action="update">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/employees/${record.id}/edit`)}
          >
            Sửa
          </Button>
        </Can>,
      ],
    },
  ];

  return (
    <div style={{ padding: '24px', background: 'transparent' }}>
      <ProTable<Employee>
        columns={columns}
        actionRef={actionRef}
        cardBordered={false}
        options={{
          reload: true,
          density: true,
          fullScreen: true,
          setting: {
            listsHeight: 400,
          },
        }}
        request={async (params, sort) => {
          try {
            const sortBy = Object.keys(sort || {})[0] || 'createdAt';
            const sortOrder = sort?.[sortBy] === 'ascend' ? 'ASC' : 'DESC';

            const response = await employeeService.getEmployees({
              page: params.current || 1,
              limit: params.pageSize ?? 20,
              search: params.name || params.email || params.position || undefined,
              status: params.status as EmployeeStatus,
              sortBy,
              sortOrder,
            });

            return {
              data: response.items,
              success: true,
              total: response.total,
            };
          } catch (error) {
            message.error('Lấy danh sách nhân viên thất bại!');
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columnsState={{
          persistenceKey: 'employee-list-table',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false,
        }}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} nhân viên`,
          pageSizeOptions: [10, 20, 50, 100],
          showLessItems: false,
        }}
        dateFormatter="string"
        headerTitle={
          <span
            style={{
              fontSize: '24px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Danh sách nhân viên
          </span>
        }
        toolBarRender={() => [
          <Can key="create" module="employees" action="create">
            <Button
              key="button"
              icon={<PlusOutlined />}
              onClick={() => navigate('/employees/create')}
              type="primary"
            >
              Thêm mới
            </Button>
          </Can>,
        ]}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        tableAlertRender={({ selectedRowKeys }) => (
          <Space size={16}>
            <span>
              Đã chọn <strong>{selectedRowKeys.length}</strong> nhân viên
            </span>
          </Space>
        )}
        tableAlertOptionRender={() => (
          <Space size={16}>
            <Button size="small" onClick={() => setSelectedRowKeys([])}>
              Bỏ chọn
            </Button>
          </Space>
        )}
      />
    </div>
  );
}
