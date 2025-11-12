/**
 * Listing Validation Schema
 * Zod schemas for listing form validation
 */

import { z } from 'zod';

/**
 * Schema for creating a new listing
 */
export const createListingSchema = z.object({
  title: z
    .string()
    .min(5, 'Tiêu đề phải có ít nhất 5 ký tự')
    .max(255, 'Tiêu đề không được quá 255 ký tự')
    .nonempty('Tiêu đề là bắt buộc'),

  content: z
    .string()
    .min(20, 'Nội dung phải có ít nhất 20 ký tự')
    .max(5000, 'Nội dung không được quá 5000 ký tự')
    .nonempty('Nội dung là bắt buộc'),

  categoryId: z
    .string()
    .optional()
    .or(z.literal('')),

  price: z
    .union([
      z.number().positive('Giá phải là số dương'),
      z.string().transform((val) => {
        if (val === '' || val === null || val === undefined) return undefined;
        const parsed = parseFloat(val.replace(/[^0-9.-]/g, ''));
        return isNaN(parsed) ? undefined : parsed;
      }),
    ])
    .optional(),

  location: z
    .string()
    .max(255, 'Địa điểm không được quá 255 ký tự')
    .optional()
    .or(z.literal('')),

  contactInfo: z
    .string()
    .min(1, 'Vui lòng nhập thông tin liên hệ')
    .max(255, 'Thông tin liên hệ không được quá 255 ký tự')
    .nonempty('Thông tin liên hệ là bắt buộc'),

  images: z.array(z.string().url('URL hình ảnh không hợp lệ')).optional(),
});

/**
 * Schema for updating an existing listing
 */
export const updateListingSchema = createListingSchema.partial();

/**
 * Infer TypeScript types from schemas
 */
export type CreateListingFormData = z.infer<typeof createListingSchema>;
export type UpdateListingFormData = z.infer<typeof updateListingSchema>;
