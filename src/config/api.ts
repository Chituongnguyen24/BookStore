/**
 * CẤU HÌNH API
 * Tự động đọc từ file .env qua biến EXPO_PUBLIC_*
 */
export const MOCKAPI_BASE_URL: string =
  process.env.EXPO_PUBLIC_MOCKAPI_URL ||
  'https://6aeca94cfc3b911e6fd57cac.mockapi.io';

export const STAFF_ACCESS_PIN: string =
  process.env.EXPO_PUBLIC_STAFF_PIN || '1234';
