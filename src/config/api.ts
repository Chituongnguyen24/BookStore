/**
 * CẤU HÌNH API BACKEND SQLITE
 */
import { Platform } from 'react-native';

// Khi chạy Web thì dùng localhost, trên điện thoại thật thì dùng IP máy tính của bạn
export const API_BASE_URL =
  Platform.OS === 'web'
    ? 'http://localhost:5000/api'
    : 'http://10.0.2.2:5000/api'; // 10.0.2.2 cho Android Emulator hoặc IP LAN (VD: http://192.168.1.x:5000/api)

export const STAFF_ACCESS_PIN = '1234';
