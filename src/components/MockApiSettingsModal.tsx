import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
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
    Alert.alert(
      'Nạp dữ liệu mẫu lên MockAPI',
      'Thao tác này sẽ gửi danh sách các cuốn sách mẫu lên MockAPI của bạn. Tiếp tục?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Bắt đầu nạp',
          onPress: async () => {
            setIsSeeding(true);
            const res = await seedDataToApi();
            setIsSeeding(false);
            Alert.alert('Kết quả', res.message);
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={isMockApiModalOpen}
      animationType="slide"
      transparent={false}
      onRequestClose={closeMockApiModal}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={closeMockApiModal}
            hitSlop={8}
          >
            <Ionicons name="close" size={24} color="#0F172A" />
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
              isOnline ? styles.statusBannerOnline : styles.statusBannerOffline,
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
              <Text style={styles.sectionTitle}>
                Nạp dữ liệu mẫu
              </Text>
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 24,
  },
  statusBanner: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
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
  statusBannerSub: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 10,
    lineHeight: 18,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
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
    borderRadius: 6,
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
    borderRadius: 6,
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
    borderRadius: 6,
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
    borderRadius: 8,
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
  guideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  stepNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    color: '#2563EB',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 20,
  },
  stepText: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
    lineHeight: 18,
  },
  bold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  footerBar: {
    padding: 16,
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
    borderRadius: 10,
    gap: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

