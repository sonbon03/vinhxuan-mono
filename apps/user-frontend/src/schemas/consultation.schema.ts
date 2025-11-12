/**
 * Consultation Validation Schema
 * Zod schema for consultation booking form validation
 */

import { z } from 'zod';

export const consultationSchema = z.object({
  // Step 1: Contact Information
  fullName: z
    .string()
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ và tên không được quá 100 ký tự')
    .trim(),

  email: z
    .string()
    .email('Email không hợp lệ')
    .max(255, 'Email quá dài'),

  phone: z
    .string()
    .regex(
      /^(0|\+84)[0-9]{9,10}$/,
      'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam hợp lệ (10-11 chữ số)'
    )
    .trim(),

  // Step 2: Consultation Type
  consultationType: z
    .string()
    .min(1, 'Vui lòng chọn gói tư vấn'),

  legalArea: z
    .string()
    .min(1, 'Vui lòng chọn lĩnh vực pháp lý'),

  // Step 3: Schedule
  preferredDate: z
    .string()
    .min(1, 'Vui lòng chọn ngày')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Ngày đã chọn phải từ hôm nay trở đi'),

  preferredTime: z
    .string()
    .min(1, 'Vui lòng chọn giờ')
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Giờ không hợp lệ'),

  meetingType: z
    .string()
    .min(1, 'Vui lòng chọn hình thức gặp mặt'),

  // Step 4: Details
  description: z
    .string()
    .min(20, 'Mô tả phải có ít nhất 20 ký tự')
    .max(1000, 'Mô tả không được quá 1000 ký tự')
    .trim(),

  documents: z
    .array(z.instanceof(File))
    .optional()
    .default([]),
});

export type ConsultationFormData = z.infer<typeof consultationSchema>;

// Step-wise validation schemas for progressive validation
export const step1Schema = consultationSchema.pick({
  fullName: true,
  email: true,
  phone: true,
});

export const step2Schema = consultationSchema.pick({
  consultationType: true,
  legalArea: true,
});

export const step3Schema = consultationSchema.pick({
  preferredDate: true,
  preferredTime: true,
  meetingType: true,
});

export const step4Schema = consultationSchema.pick({
  description: true,
  documents: true,
});
