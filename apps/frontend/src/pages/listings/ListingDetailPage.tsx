import React, { useState } from 'react';
import { Button, Space, Tag, Descriptions, Spin, message, Divider, Image, List, Input, Popconfirm, Empty, Card } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined, HeartOutlined, HeartFilled, EyeInvisibleOutlined, EyeOutlined, SendOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listingService, ListingStatus } from '../../services/listing.service';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../hooks/useAuth';
import dayjs from 'dayjs';
import { PageContainer } from '@/components/common/PageContainer';

const { TextArea } = Input;

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin, isAdminOrStaff } = usePermissions();
  const { user, isAuthenticated } = useAuth();
  const [commentText, setCommentText] = useState('');

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingService.getListingById(id!),
    enabled: !!id,
  });

  const { data: comments } = useQuery({
    queryKey: ['listing-comments', id],
    queryFn: () => listingService.getComments(id!),
    enabled: !!id && listing?.status === ListingStatus.APPROVED,
  });

  const { data: likeStatus } = useQuery({
    queryKey: ['listing-liked', id],
    queryFn: () => listingService.checkUserLiked(id!),
    enabled: !!id && isAuthenticated,
  });

  const approveMutation = useMutation({
    mutationFn: () => listingService.approveListing(id!, {}),
    onSuccess: () => {
      message.success('Phê duyệt tin rao thành công!');
      queryClient.invalidateQueries({ queryKey: ['listing', id] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Phê duyệt tin rao thất bại');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => listingService.rejectListing(id!, {}),
    onSuccess: () => {
      message.success('Từ chối tin rao thành công!');
      queryClient.invalidateQueries({ queryKey: ['listing', id] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Từ chối tin rao thất bại');
    },
  });

  const toggleHiddenMutation = useMutation({
    mutationFn: listingService.toggleHidden,
    onSuccess: () => {
      message.success('Cập nhật trạng thái hiển thị thành công!');
      queryClient.invalidateQueries({ queryKey: ['listing', id] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Cập nhật trạng thái thất bại');
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: () => listingService.toggleLike(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listing', id] });
      queryClient.invalidateQueries({ queryKey: ['listing-liked', id] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Thao tác thất bại');
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: (comment: string) => listingService.addComment(id!, { commentText: comment }),
    onSuccess: () => {
      message.success('Thêm bình luận thành công!');
      setCommentText('');
      queryClient.invalidateQueries({ queryKey: ['listing-comments', id] });
      queryClient.invalidateQueries({ queryKey: ['listing', id] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Thêm bình luận thất bại');
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => listingService.deleteComment(commentId),
    onSuccess: () => {
      message.success('Xóa bình luận thành công!');
      queryClient.invalidateQueries({ queryKey: ['listing-comments', id] });
      queryClient.invalidateQueries({ queryKey: ['listing', id] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Xóa bình luận thất bại');
    },
  });

  const handleAddComment = () => {
    if (!commentText.trim()) {
      message.warning('Vui lòng nhập nội dung bình luận!');
      return;
    }
    addCommentMutation.mutate(commentText);
  };

  const getStatusColor = (status: ListingStatus): string => {
    const colorMap: Record<ListingStatus, string> = {
      [ListingStatus.PENDING]: 'default',
      [ListingStatus.APPROVED]: 'success',
      [ListingStatus.REJECTED]: 'error',
    };
    return colorMap[status];
  };

  const getStatusText = (status: ListingStatus): string => {
    const textMap: Record<ListingStatus, string> = {
      [ListingStatus.PENDING]: 'Chờ duyệt',
      [ListingStatus.APPROVED]: 'Đã duyệt',
      [ListingStatus.REJECTED]: 'Đã từ chối',
    };
    return textMap[status];
  };

  const formatPrice = (price: number | null): string => {
    if (!price) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (isLoading) {
    return (
      <PageContainer title="Đang tải dữ liệu" backUrl="/listings">
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  if (!listing) {
    return (
      <PageContainer title="Không tìm thấy tin rao" backUrl="/listings">
        <Card>Không tìm thấy tin rao.</Card>
      </PageContainer>
    );
  }

  const isAuthor = user?.id === listing.authorId;
  const canEdit = isAuthor || isAdmin();

  return (
    <PageContainer
      title={listing.title}
      subtitle="Chi tiết tin rao"
      backUrl="/listings"
      extra={
        <Space>
          {canEdit && (
            <Button type="link" icon={<EditOutlined />} onClick={() => navigate(`/listings/edit/${listing.id}`)}>
              Sửa
            </Button>
          )}
          {isAdminOrStaff() && listing.status === ListingStatus.PENDING && (
            <>
              <Button type="primary" icon={<CheckOutlined />} onClick={() => approveMutation.mutate()} loading={approveMutation.isPending}>
                Duyệt
              </Button>
              <Button danger icon={<CloseOutlined />} onClick={() => rejectMutation.mutate()} loading={rejectMutation.isPending}>
                Từ chối
              </Button>
            </>
          )}
          {isAdmin() && (
            <Button icon={listing.isHidden ? <EyeOutlined /> : <EyeInvisibleOutlined />} onClick={() => toggleHiddenMutation.mutate(listing.id)} loading={toggleHiddenMutation.isPending}>
              {listing.isHidden ? 'Hiện' : 'Ẩn'}
            </Button>
          )}
        </Space>
      }
    >
      <Descriptions bordered column={2} labelStyle={{ width: 200 }}>
        <Descriptions.Item label="Tiêu đề" span={2}>
          <strong style={{ fontSize: 16 }}>{listing.title}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Giá" span={2}>
          <strong style={{ fontSize: 18, color: '#ff4d4f' }}>{formatPrice(listing.price)}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={getStatusColor(listing.status)}>{getStatusText(listing.status)}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Hiển thị">
          <Tag color={listing.isHidden ? 'red' : 'green'}>{listing.isHidden ? 'Đã ẩn' : 'Hiển thị'}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Người đăng">{listing.author?.fullName || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Thể loại">{listing.category?.name || 'Chưa phân loại'}</Descriptions.Item>
        <Descriptions.Item label="Ngày đăng">{dayjs(listing.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">{dayjs(listing.updatedAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
        {listing.approver && (
          <>
            <Descriptions.Item label="Người duyệt">{listing.approver.fullName}</Descriptions.Item>
            <Descriptions.Item label="Ghi chú duyệt">{listing.reviewNotes || 'Không có ghi chú'}</Descriptions.Item>
          </>
        )}
      </Descriptions>

      {listing.images && listing.images.length > 0 && (
        <>
          <Divider>Hình ảnh</Divider>
          <Image.PreviewGroup>
            <Space wrap>
              {listing.images.map((img, index) => (
                <Image key={index} width={200} src={img} alt={`Image ${index + 1}`} style={{ objectFit: 'cover', borderRadius: 8 }} />
              ))}
            </Space>
          </Image.PreviewGroup>
        </>
      )}

      <Divider>Nội dung</Divider>
      <div style={{ padding: 24, background: '#fafafa', borderRadius: 8, whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{listing.content}</div>

      {listing.status === ListingStatus.APPROVED && (
        <>
          <Divider>
            <Space>
              <Button
                type={likeStatus?.liked ? 'primary' : 'default'}
                icon={likeStatus?.liked ? <HeartFilled /> : <HeartOutlined />}
                onClick={() => toggleLikeMutation.mutate()}
                loading={toggleLikeMutation.isPending}
                disabled={!isAuthenticated}
              >
                {listing.likeCount} Lượt thích
              </Button>
            </Space>
          </Divider>

          <div style={{ marginTop: 24 }}>
            <h3>Bình luận ({listing.commentCount})</h3>
            {isAuthenticated && (
              <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
                <TextArea rows={2} placeholder="Nhập bình luận của bạn..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                <Button type="primary" icon={<SendOutlined />} onClick={handleAddComment} loading={addCommentMutation.isPending}>
                  Gửi
                </Button>
              </Space.Compact>
            )}
            {!isAuthenticated && <p style={{ color: '#999', marginBottom: 16 }}>Vui lòng đăng nhập để bình luận.</p>}
            {comments && comments.length > 0 ? (
              <List
                dataSource={comments}
                renderItem={(comment) => {
                  const isCommentAuthor = user?.id === comment.userId;
                  return (
                    <List.Item
                      actions={
                        isCommentAuthor || isAdmin()
                          ? [
                              <Popconfirm
                                key="delete"
                                title="Xác nhận xóa"
                                description="Bạn có chắc chắn muốn xóa bình luận này?"
                                onConfirm={() => deleteCommentMutation.mutate(comment.id)}
                                okText="Xóa"
                                cancelText="Hủy"
                                okButtonProps={{ danger: true }}
                              >
                                <Button type="link" danger size="small">
                                  Xóa
                                </Button>
                              </Popconfirm>,
                            ]
                          : []
                      }
                    >
                      <List.Item.Meta
                        title={
                          <Space>
                            <strong>{comment.user?.fullName || 'Anonymous'}</strong>
                            <span style={{ color: '#999', fontSize: 12 }}>{dayjs(comment.createdAt).format('DD/MM/YYYY HH:mm')}</span>
                          </Space>
                        }
                        description={comment.commentText}
                      />
                    </List.Item>
                  );
                }}
              />
            ) : (
              <Empty description="Chưa có bình luận nào" />
            )}
          </div>
        </>
      )}
    </PageContainer>
  );
};

export default ListingDetailPage;
