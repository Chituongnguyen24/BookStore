import { Alert, Platform, useWindowDimensions } from 'react-native';

export const MAX_CONTENT_WIDTH = 1280;

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  const isWide = width >= 768; // Tablet + Desktop

  // Chiều rộng thực tế của vùng nội dung (giới hạn tối đa 1280px trên màn hình lớn)
  const contentWidth = Math.min(width, MAX_CONTENT_WIDTH);

  // Số cột cho danh sách sản phẩm (BookCard)
  let bookGridColumns = 2;
  if (contentWidth >= 1150) {
    bookGridColumns = 5;
  } else if (contentWidth >= 880) {
    bookGridColumns = 4;
  } else if (contentWidth >= 600) {
    bookGridColumns = 3;
  }

  const horizontalPadding = isDesktop ? 24 : 16;
  const gridGap = isDesktop ? 16 : 12;

  const bookCardWidth = Math.floor(
    (contentWidth - horizontalPadding * 2 - gridGap * (bookGridColumns - 1)) /
      bookGridColumns
  );

  return {
    width,
    height,
    contentWidth,
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    bookGridColumns,
    horizontalPadding,
    gridGap,
    bookCardWidth,
  };
};

/**
 * Hộp thoại xác nhận hoạt động ổn định trên cả Expo Web lẫn iOS/Android
 */
export const confirmDialog = (
  title: string,
  message: string,
  onConfirm: () => void,
  confirmText = 'Xác nhận',
  isDestructive = false
) => {
  if (Platform.OS === 'web') {
    const ok = window.confirm(`${title}\n\n${message}`);
    if (ok) {
      onConfirm();
    }
  } else {
    Alert.alert(title, message, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: confirmText,
        style: isDestructive ? 'destructive' : 'default',
        onPress: onConfirm,
      },
    ]);
  }
};

