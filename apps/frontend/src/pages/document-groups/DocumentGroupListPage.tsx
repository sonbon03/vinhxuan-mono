import React, { useRef } from 'react';
import { Button, Tag, Popconfirm, message, Badge } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DocumentGroup, documentGroupService } from '../../services/document-group.service';
import { usePermissions } from '../../hooks/usePermissions';
import { Can } from '../../components/Can';
import dayjs from 'dayjs';

const DocumentGroupListPage: React.FC = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const queryClient = useQueryClient();
  const { can } = usePermissions();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: documentGroupService.deleteDocumentGroup,
    onSuccess: () => {
      message.success('Xóa nhóm giấy tờ thành công');
      actionRef.current?.reload();
      queryClient.invalidateQueries({ queryKey: ['document-groups'] });
    },
    onError: () => {
      message.error('Xóa nhóm giấy tờ thất bại');
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      documentGroupService.updateDocumentGroupStatus(id, status),
    onSuccess: () => {
      message.success('Cập nhật trạng thái thành công');
      actionRef.current?.reload();
      queryClient.invalidateQueries({ queryKey: ['document-groups'] });
    },
    onError: () => {
      message.error('Cập nhật trạng thái thất bại');
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    updateStatusMutation.mutate({ id, status: !currentStatus });
  };

  const columns: ProColumns<DocumentGroup>[] = [
    {
      title: 'Tên nhóm giấy tờ',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: 250,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      ellipsis: true,
      width: 200,
      search: false,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      search: false,
    },
    {
      title: 'Số trường form',
      dataIndex: 'formFields',
      key: 'formFieldsCount',
      width: 130,
      search: false,
      render: (_, record) => {
        const fieldCount = record.formFields?.fields?.length || 0;
        return (
          <Badge count={fieldCount} showZero color={fieldCount > 0 ? 'blue' : 'gray'} />
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      valueType: 'select',
      valueEnum: {
        true: { text: 'Hoạt động', status: 'Success' },
        false: { text: 'Tạm ngưng', status: 'Default' },
      },
      render: (_, record) => (
        <Tag color={record.status ? 'success' : 'default'}>
          {record.status ? 'Hoạt động' : 'Tạm ngưng'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      search: false,
      sorter: true,
      render: (_, record) => dayjs(record.createdAt).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      key: 'action',
      width: 250,
      search: false,
      fixed: 'right',
      render: (_, record) => [
        <Can key="edit" module="documentGroups" action="update">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/document-groups/edit/${record.id}`)}
          >
            Sửa
          </Button>
        </Can>,
        <Can key="toggle" module="documentGroups" action="update">
          <Button
            type="link"
            size="small"
            icon={record.status ? <StopOutlined /> : <CheckCircleOutlined />}
            onClick={() => handleToggleStatus(record.id, record.status)}
          >
            {record.status ? 'Tạm ngưng' : 'Kích hoạt'}
          </Button>
        </Can>,
        <Can key="delete" module="documentGroups" action="delete">
          <Popconfirm
            title="Xóa nhóm giấy tờ"
            description="Bạn có chắc chắn muốn xóa nhóm giấy tờ này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Can>,
      ],
    },
  ];

  return (
    <div style={{ padding: '24px', background: 'transparent' }}>
      <ProTable<DocumentGroup>
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

            const response = await documentGroupService.getDocumentGroups({
              page: params.current || 1,
              limit: params.pageSize ?? 20,
              search: params.name || undefined,
              status: params.status !== undefined ? params.status === 'true' : undefined,
              sortBy,
              sortOrder,
            });

            return {
              data: response.items,
              success: true,
              total: response.total,
            };
          } catch (error) {
            message.error('Lỗi khi tải danh sách nhóm giấy tờ');
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} nhóm giấy tờ`,
          pageSizeOptions: [10, 20, 50, 100],
          showLessItems: false,
        }}
        dateFormatter="string"
        scroll={{ x: 'max-content' }}
        headerTitle={
          <span style={{ fontSize: '24px', fontWeight: 600, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Danh sách nhóm giấy tờ công chứng
          </span>
        }
        toolBarRender={() => [
          <Can key="create" module="documentGroups" action="create">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/document-groups/create')}
            >
              Thêm mới
            </Button>
          </Can>,
        ]}
      />
    </div>
  );
};

export default DocumentGroupListPage;
