# BookStore App

Ứng dụng mua bán sách di động xây dựng bằng React Native (Expo), tích hợp MockAPI với 2 vai trò: Khách hàng và Nhân viên.

## Cấu hình API

Cấu hình tại file `src/config/api.ts`:
```typescript
export const MOCKAPI_BASE_URL = 'https://6aeca94cfc3b911e6fd57cac.mockapi.io';
export const STAFF_ACCESS_PIN = '1234';
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
