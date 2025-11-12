/**
 * Consultation Utilities
 * Helper functions for consultation data transformation
 */

import { parse } from 'date-fns';
import type { ConsultationFormData } from '@/schemas/consultation.schema';
import type { CreateConsultationRequest } from '@/services/consultations.service';

// Map consultation type to service name (if you have services data)
const CONSULTATION_TYPE_TO_SERVICE_NAME: Record<string, string> = {
  'free-consultation': 'Tư vấn miễn phí',
  'standard-consultation': 'Tư vấn chuẩn',
  'premium-consultation': 'Tư vấn chuyên sâu',
  'legal-review': 'Xem xét tài liệu pháp lý',
};

// Map legal area to Vietnamese display text
const LEGAL_AREA_MAP: Record<string, string> = {
  corporate: 'Luật Doanh nghiệp',
  family: 'Luật Gia đình',
  'real-estate': 'Bất động sản',
  criminal: 'Luật Hình sự',
  labor: 'Luật Lao động',
  immigration: 'Xuất nhập cảnh',
  intellectual: 'Sở hữu trí tuệ',
  other: 'Khác',
};

// Map meeting type to Vietnamese display text
const MEETING_TYPE_MAP: Record<string, string> = {
  office: 'Tại văn phòng',
  video: 'Video call',
  phone: 'Điện thoại',
};

/**
 * Transform consultation form data to API request format
 * Combines date and time into ISO 8601 format
 * Builds comprehensive content string
 */
export const transformConsultationData = (
  formData: ConsultationFormData
): CreateConsultationRequest => {
  // Combine date and time into ISO 8601 format
  const dateTime = parse(
    `${formData.preferredDate} ${formData.preferredTime}`,
    'yyyy-MM-dd HH:mm',
    new Date()
  );

  const requestedDatetime = dateTime.toISOString();

  // Get display names
  const consultationTypeName =
    CONSULTATION_TYPE_TO_SERVICE_NAME[formData.consultationType] || formData.consultationType;
  const legalAreaName = LEGAL_AREA_MAP[formData.legalArea] || formData.legalArea;
  const meetingTypeName = MEETING_TYPE_MAP[formData.meetingType] || formData.meetingType;

  // Build comprehensive content including all form details
  const content = `
=== THÔNG TIN KHÁCH HÀNG ===
Họ tên: ${formData.fullName}
Email: ${formData.email}
Số điện thoại: ${formData.phone}

=== CHI TIẾT TƯ VẤN ===
Gói tư vấn: ${consultationTypeName}
Lĩnh vực pháp lý: ${legalAreaName}
Hình thức tư vấn: ${meetingTypeName}
Thời gian đề xuất: ${formData.preferredDate} lúc ${formData.preferredTime}

=== MÔ TẢ VẤN ĐỀ ===
${formData.description}
${formData.documents && formData.documents.length > 0 ? `\n=== TÀI LIỆU ĐÍNH KÈM ===\nSố lượng tài liệu: ${formData.documents.length} file\nLưu ý: Tài liệu sẽ được gửi riêng qua email sau khi đặt lịch.` : ''}
  `.trim();

  return {
    requestedDatetime,
    content,
    // serviceId can be mapped from consultationType if you have service data
    // For now, we'll leave it undefined and handle service mapping on backend
    serviceId: undefined,
  };
};

/**
 * Format consultation data for display confirmation
 */
export const formatConsultationForDisplay = (formData: ConsultationFormData) => {
  const consultationTypeName =
    CONSULTATION_TYPE_TO_SERVICE_NAME[formData.consultationType] || formData.consultationType;
  const legalAreaName = LEGAL_AREA_MAP[formData.legalArea] || formData.legalArea;
  const meetingTypeName = MEETING_TYPE_MAP[formData.meetingType] || formData.meetingType;

  return {
    consultationType: consultationTypeName,
    legalArea: legalAreaName,
    meetingType: meetingTypeName,
  };
};

/**
 * Validate if selected datetime is in the future
 */
export const isDateTimeInFuture = (date: string, time: string): boolean => {
  try {
    const dateTime = parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm', new Date());
    return dateTime > new Date();
  } catch {
    return false;
  }
};

/**
 * Format date for display in Vietnamese locale
 */
export const formatDateDisplay = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};
