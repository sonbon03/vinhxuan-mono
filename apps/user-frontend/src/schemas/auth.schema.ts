/**
 * Authentication Form Validation Schemas
 * Zod schemas for login and registration forms
 */

import { z } from 'zod';

/**
 * Login Form Schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email là bắt buộc')
    .email('Email không hợp lệ')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Mật khẩu là bắt buộc')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Registration Form Schema
 */
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Họ và tên là bắt buộc')
      .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
      .max(100, 'Họ và tên không được quá 100 ký tự')
      .trim()
      .refine(
        (val) => {
          // Check if name has at least 2 words
          const words = val.trim().split(/\s+/);
          return words.length >= 2;
        },
        {
          message: 'Vui lòng nhập họ và tên đầy đủ',
        }
      ),
    email: z
      .string()
      .min(1, 'Email là bắt buộc')
      .email('Email không hợp lệ')
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(1, 'Mật khẩu là bắt buộc')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ cái viết hoa')
      .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ cái viết thường')
      .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 chữ số'),
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
    phone: z
      .string()
      .min(1, 'Số điện thoại là bắt buộc')
      .trim()
      .regex(
        /^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/,
        'Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)'
      ),
    dateOfBirth: z
      .date({
        required_error: 'Ngày sinh là bắt buộc',
        invalid_type_error: 'Ngày sinh không hợp lệ',
      })
      .refine(
        (date) => {
          // User must be at least 18 years old
          const today = new Date();
          const eighteenYearsAgo = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
          );
          return date <= eighteenYearsAgo;
        },
        {
          message: 'Bạn phải từ 18 tuổi trở lên',
        }
      )
      .refine(
        (date) => {
          // User must not be more than 120 years old
          const today = new Date();
          const oneHundredTwentyYearsAgo = new Date(
            today.getFullYear() - 120,
            today.getMonth(),
            today.getDate()
          );
          return date >= oneHundredTwentyYearsAgo;
        },
        {
          message: 'Ngày sinh không hợp lệ',
        }
      ),
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, {
        message: 'Bạn phải đồng ý với Điều khoản dịch vụ và Chính sách bảo mật',
      }),
    agreeToMarketing: z.boolean().optional().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Password Strength Calculator
 * Returns a score from 0 to 4
 */
export const calculatePasswordStrength = (password: string): number => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  return Math.min(strength, 4);
};

/**
 * Get password strength label
 */
export const getPasswordStrengthLabel = (strength: number): string => {
  const labels = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
  return labels[strength] || labels[0];
};

/**
 * Get password strength color
 */
export const getPasswordStrengthColor = (strength: number): string => {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
  ];
  return colors[strength] || colors[0];
};
