/**
 * Utility functions for articles
 */

/**
 * Calculate read time based on content length
 * Average reading speed: 200 words per minute
 */
export const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;

  // Strip HTML tags
  const textContent = content.replace(/<[^>]*>/g, '');

  // Split by whitespace and filter empty strings
  const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;

  // Calculate minutes
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return `${minutes} phút đọc`;
};

/**
 * Extract first image from HTML content
 */
export const extractFirstImage = (htmlContent: string): string | null => {
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = htmlContent.match(imgRegex);
  return match ? match[1] : null;
};

/**
 * Generate excerpt from HTML content
 */
export const generateExcerpt = (htmlContent: string, maxLength: number = 150): string => {
  // Strip HTML tags
  const textContent = htmlContent.replace(/<[^>]*>/g, '');

  // Remove extra whitespace
  const cleanText = textContent.replace(/\s+/g, ' ').trim();

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  // Truncate at word boundary
  const truncated = cleanText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return truncated.substring(0, lastSpace) + '...';
};

/**
 * Get placeholder image based on category
 */
export const getPlaceholderImage = (categoryName?: string): string => {
  const placeholders: Record<string, string> = {
    'Công chứng BĐS': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
    'Công chứng DN': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    'Thừa kế': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop',
    'Chứng thực': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop',
    'Hợp đồng': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop',
    'Pháp luật': 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=800&h=600&fit=crop',
  };

  return categoryName && placeholders[categoryName]
    ? placeholders[categoryName]
    : 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800&h=600&fit=crop';
};

/**
 * Format time ago (e.g., "2 giờ trước")
 */
export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Vừa xong';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  }

  // For older dates, return formatted date
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Basic HTML sanitizer (removes potentially dangerous tags)
 * For production, consider using a library like DOMPurify
 */
export const sanitizeHtml = (html: string): string => {
  // Remove script and style tags
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  return sanitized;
};
