// Cấu hình giá dịch vụ pháp lý
export const PRICING_CONFIG = {
  // Có thể thêm các dịch vụ khác trong tương lai
  // CONSULTATION: {
  //   price: 500000,
  //   currency: 'VNĐ',
  //   description: 'Tư vấn pháp lý chuyên sâu với luật sư'
  // },
  
  // CONTRACT_REVIEW: {
  //   price: 1000000,
  //   currency: 'VNĐ',
  //   description: 'Xem xét và soát lại hợp đồng'
  // }
} as const;

// Helper function để format giá tiền
export const formatPrice = (price: number, currency: string = 'VNĐ'): string => {
  return `${price.toLocaleString('vi-VN')}${currency}`;
};