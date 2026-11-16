import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../services/mockapi';
import { MAX_CONTENT_WIDTH, useResponsive } from '../utils/responsive';

export const CategoryChips: React.FC = () => {
  const { selectedCategory, setSelectedCategory, books } = useApp();
  const { horizontalPadding } = useResponsive();

  const getCategoryCount = (cat: string) => {
    if (cat === 'Tất cả') return books.length;
    return books.filter((b) => b.category.toLowerCase() === cat.toLowerCase())
      .length;
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.innerWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.container,
            { paddingHorizontal: horizontalPadding },
          ]}
        >
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            const count = getCategoryCount(category);

            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.chip,
                  isSelected ? styles.chipSelected : styles.chipUnselected,
                ]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected
                      ? styles.chipTextSelected
                      : styles.chipTextUnselected,
                  ]}
                >
                  {category}
                </Text>
                <View
                  style={[
                    styles.countBadge,
                    isSelected
                      ? styles.countBadgeSelected
                      : styles.countBadgeUnselected,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      isSelected
                        ? styles.countTextSelected
                        : styles.countTextUnselected,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  innerWrapper: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  chipSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  chipUnselected: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  chipTextUnselected: {
    color: '#475569',
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 10,
  },
  countBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countBadgeUnselected: {
    backgroundColor: '#E2E8F0',
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
  },
  countTextSelected: {
    color: '#FFFFFF',
  },
  countTextUnselected: {
    color: '#64748B',
  },
});
