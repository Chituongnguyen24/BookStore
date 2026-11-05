# BookStore App

Ứng dụng mua bán sách di động xây dựng bằng React Native (Expo), tích hợp MockAPI với 2 vai trò: Khách hàng và Nhân viên.

## Cấu hình API trong file .env

Mở file `.env` tại thư mục gốc và dán endpoint của bạn vào:
```env
EXPO_PUBLIC_MOCKAPI_URL=https://<project-id>.mockapi.io/api/v1
EXPO_PUBLIC_STAFF_PIN=1234
```

### 2 Resource cần có trên MockAPI:
1. **`books`**: `id`, `title`, `author`, `category`, `price`, `originalPrice`, `stock`, `rating`, `reviewsCount`, `coverImage`, `description`.
2. **`orders`**: `id`, `customerName`, `phone`, `address`, `note`, `paymentMethod`, `items`, `totalAmount`, `status`, `createdAt`.

## Chạy ứng dụng

```bash
# Kiểm tra lỗi TypeScript
npx tsc --noEmit

# Khởi chạy dự án
npx expo start
```
- Nhấn `w` để mở trên Web.
- Quét mã QR bằng ứng dụng Expo Go trên điện thoại.

*Mã PIN truy cập quyền nhân viên: `1234` (tại tab Tài khoản -> Chế độ quản lý).*
