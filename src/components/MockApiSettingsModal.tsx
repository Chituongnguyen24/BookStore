import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { DEFAULT_MOCKAPI_URL, MockApiService } from '../services/mockapi';
import { confirmDialog, useResponsive } from '../utils/responsive';

export const MockApiSettingsModal: React.FC = () => {
  const {
    mockApiUrl,
    setMockApiUrl,
    isMockApiModalOpen,
    closeMockApiModal,
    refreshData,
    seedDataToApi,
    isOnline,
    isLoading,
    showToast,
  } = useApp();

  const { isWide } = useResponsive();

  const [inputUrl, setInputUrl] = useState(mockApiUrl);
  const [testingStatus, setTestingStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestingStatus('Đang kiểm tra kết nối...');
    const res = await MockApiService.testConnection(inputUrl.trim());
    setIsTesting(false);
    setTestingStatus(res.message);
  };

  const handleSaveUrl = async () => {
    const trimmed = inputUrl.trim();
    setMockApiUrl(trimmed);
    showToast('Đã lưu cấu hình MockAPI');
    await refreshData();
    closeMockApiModal();
  };

  const handleResetDefault = () => {
    setInputUrl(DEFAULT_MOCKAPI_URL);
    setMockApiUrl(DEFAULT_MOCKAPI_URL);
    showToast('Đã đặt lại URL MockAPI mặc định');
  };

  const handleSeedData = async () => {
    confirmDialog(
      'Nạp dữ liệu mẫu lên MockAPI',
      'Thao tác này sẽ gửi danh sách các cuốn sách mẫu lên MockAPI của bạn. Tiếp tục?',
      async () => {
        setIsSeeding(true);
        const res = await seedDataToApi();
        setIsSeeding(false);
        if (Platform.OS === 'web') {
          window.alert(res.message);
        } else {
          Alert.alert('Kết quả', res.message);
        }
      },
      'Bắt đầu nạp'
    );
  };

  return (
    <Modal
      visible={isMockApiModalOpen}
      animationType={isWide ? 'fade' : 'slide'}
      transparent={isWide}
      onRequestClose={closeMockApiModal}
    >
      <View style={[styles.backdrop, isWide && styles.backdropWide]}>
        {isWide && (
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeMockApiModal}
          />
        )}

        <SafeAreaView style={[styles.safeArea, isWide && styles.dialogCard]}>
          {/* Header */}
          <View style={styles.headerBar}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={closeMockApiModal}
              hitSlop={8}
            >
              <Ionicons name="close" size={22} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Cấu hình MockAPI</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Status Banner */}
            <View
              style={[
                styles.statusBanner,
                isOnline
                  ? styles.statusBannerOnline
                  : styles.statusBannerOffline,
              ]}
            >
              <Feather
                name={isOnline ? 'check-circle' : 'alert-circle'}
                size={20}
                color={isOnline ? '#059669' : '#D97706'}
              />
              <View style={styles.statusBannerContent}>
                <Text
                  style={[
                    styles.statusBannerTitle,
                    { color: isOnline ? '#065F46' : '#92400E' },
                  ]}
                >
                  {isOnline ? 'MockAPI Online' : 'MockAPI Offline'}
                </Text>
              </View>
            </View>

            {/* URL Input Form */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Base URL</Text>

              <TextInput
                style={styles.input}
                value={inputUrl}
                onChangeText={setInputUrl}
                placeholder="https://<project-id>.mockapi.io/api/v1"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                autoCorrect={false}
              />

              {/* Test Connection Button */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.testBtn}
                  onPress={handleTestConnection}
                  disabled={isTesting}
                >
                  {isTesting ? (
                    <ActivityIndicator size="small" color="#2563EB" />
                  ) : (
                    <>
                      <Feather name="activity" size={15} color="#2563EB" />
                      <Text style={styles.testBtnText}>Kiểm tra kết nối</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resetBtn}
                  onPress={handleResetDefault}
                >
                  <Text style={styles.resetBtnText}>Mặc định</Text>
                </TouchableOpacity>
              </View>

              {testingStatus && (
                <View style={styles.testResultBox}>
                  <Text style={styles.testResultText}>{testingStatus}</Text>
                </View>
              )}
            </View>

            {/* Seed Data Button */}
            <View style={styles.section}>
              <View style={styles.seedHeader}>
                <MaterialCommunityIcons
                  name="database-sync"
                  size={22}
                  color="#7C3AED"
                />
                <Text style={styles.sectionTitle}>Nạp dữ liệu mẫu</Text>
              </View>

              <TouchableOpacity
                style={[styles.seedBtn, isSeeding && styles.seedBtnDisabled]}
                onPress={handleSeedData}
                disabled={isSeeding}
              >
                {isSeeding ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Feather name="upload-cloud" size={16} color="#FFFFFF" />
                    <Text style={styles.seedBtnText}>
                      Nạp dữ liệu mẫu lên MockAPI
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footerBar}>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSaveUrl}
              disabled={isLoading}
            >
              <Feather name="check" size={18} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Lưu cấu hình</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backdropWide: {
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  dialogCard: {
    flex: 0,
    maxWidth: 560,
    maxHeight: '88%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  scroll: {
    flexGrow: 0,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 24,
  },
  statusBanner: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    alignItems: 'center',
  },
  statusBannerOnline: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  statusBannerOffline: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  statusBannerContent: {
    flex: 1,
  },
  statusBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  testBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 6,
  },
  testBtnText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '600',
  },
  resetBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  testResultBox: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  testResultText: {
    fontSize: 12,
    color: '#334155',
  },
  seedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  seedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    height: 44,
    borderRadius: 10,
    gap: 8,
    marginTop: 6,
  },
  seedBtnDisabled: {
    backgroundColor: '#C4B5FD',
  },
  seedBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  footerBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    height: 48,
    borderRadius: 12,
    gap: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
