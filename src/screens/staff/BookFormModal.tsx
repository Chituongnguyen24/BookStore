import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../services/mockapi';

export const BookFormModal: React.FC = () => {
  const {
    isBookFormOpen,
    editingBook,
    closeBookForm,
    addBook,
    updateBook,
    isLoading,
  } = useApp();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Văn học');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('20');
  const [coverImage, setCoverImage] = useState('');
  const [description, setDescription] = useState('');

  const availableCategories = CATEGORIES.filter((c) => c !== 'Tất cả');

  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title);
      setAuthor(editingBook.author);
      setCategory(editingBook.category);
      setPrice(editingBook.price.toString());
      setOriginalPrice(editingBook.originalPrice ? editingBook.originalPrice.toString() : '');
      setStock(editingBook.stock.toString());
      setCoverImage(editingBook.coverImage || '');
      setDescription(editingBook.description || '');
    } else {
      // Defaults for new book
      setTitle('');
      setAuthor('');
      setCategory('Văn học');
      setPrice('85000');
      setOriginalPrice('105000');
      setStock('25');
      setCoverImage('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60');
      setDescription('');
    }
  }, [editingBook, isBookFormOpen]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập tên sách.');
      return;
    }
    if (!author.trim()) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập tên tác giả.');
      return;
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập giá sách hợp lệ (số > 0).');
      return;
    }
    const numStock = Number(stock);
    if (isNaN(numStock) || numStock < 0) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập số lượng tồn kho hợp lệ (≥ 0).');
      return;
    }

    const payload = {
      title: title.trim(),
      author: author.trim(),
      category,
      price: numPrice,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: numStock,
      coverImage: coverImage.trim() || undefined,
      description: description.trim() || undefined,
    };

    if (editingBook) {
      await updateBook(editingBook.id, payload);
    } else {
      await addBook(payload);
    }
  };

  return (
    <Modal
      visible={isBookFormOpen}
      animationType="slide"
      transparent={false}
      onRequestClose={closeBookForm}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={closeBookForm}
            hitSlop={8}
          >
            <Ionicons name="close" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {editingBook ? 'Chỉnh sửa thông tin sách' : 'Thêm sách mới vào kho'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Cover Preview & URL */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ảnh bìa sách</Text>
            <View style={styles.imagePreviewRow}>
              <Image
                source={
                  coverImage.trim()
                    ? { uri: coverImage.trim() }
                    : require('../../../assets/BookCover.jpg')
                }
                style={styles.previewImage}
                resizeMode="cover"
              />
              <View style={styles.imageInputBox}>
                <Text style={styles.inputLabel}>URL ảnh bìa:</Text>
                <TextInput
                  style={styles.input}
                  value={coverImage}
                  onChangeText={setCoverImage}
                  placeholder="https://..."
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>

          {/* Book Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Tên sách *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Ví dụ: Đắc Nhân Tâm"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Tác giả *</Text>
              <TextInput
                style={styles.input}
                value={author}
                onChangeText={setAuthor}
                placeholder="Ví dụ: Dale Carnegie"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Category selection */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Thể loại sách *</Text>
              <View style={styles.categoryChips}>
                {availableCategories.map((cat) => {
                  const isSel = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catChip,
                        isSel && styles.catChipActive,
                      ]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.catChipText,
                          isSel && styles.catChipTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Pricing & Stock */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Giá bán & Tồn kho</Text>

            <View style={styles.twoColRow}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Giá bán (VNĐ) *</Text>
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="85000"
                  keyboardType="numeric"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Giá gốc (VNĐ)</Text>
                <TextInput
                  style={styles.input}
                  value={originalPrice}
                  onChangeText={setOriginalPrice}
                  placeholder="105000"
                  keyboardType="numeric"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Số lượng trong kho (cuốn) *</Text>
              <TextInput
                style={styles.input}
                value={stock}
                onChangeText={setStock}
                placeholder="25"
                keyboardType="numeric"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả tóm tắt nội dung</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Giới thiệu đôi nét về nội dung, giá trị của cuốn sách..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
            />
          </View>
        </ScrollView>

        {/* Footer Submit Button */}
        <View style={styles.footerBar}>
          <TouchableOpacity
            style={[styles.saveBtn, isLoading && styles.saveBtnDisabled]}
            disabled={isLoading}
            onPress={handleSubmit}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Feather name="check-circle" size={18} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>
                  {editingBook ? 'Lưu thay đổi' : 'Thêm sách vào kho'}
                </Text>
              </>
            )}
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
    paddingBottom: 24,
    gap: 16,
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
    marginBottom: 12,
  },
  imagePreviewRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  previewImage: {
    width: 75,
    height: 105,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  imageInputBox: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  hintText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 16,
  },
  formGroup: {
    marginBottom: 12,
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  catChipText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  catChipTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
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
  saveBtnDisabled: {
    backgroundColor: '#93C5FD',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

