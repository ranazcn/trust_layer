import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View } from 'react-native';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  onSearch,
  placeholder = '0x...',
}) => (
  <View style={styles.wrapper}>
    <View style={styles.searchRow}>
      <Text style={styles.prompt}>$</Text>
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor="#1E3A5A"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        onSubmitEditing={onSearch}
      />
      <TouchableOpacity style={styles.searchButton} onPress={onSearch} activeOpacity={0.7}>
        <Text style={styles.searchButtonText}>SCAN_</Text>
      </TouchableOpacity>
    </View>
    {/* Alt neon çizgi */}
    <View style={styles.bottomGlow} />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: '#1A3A5A',
    borderRadius: 4,
    backgroundColor: '#070D1A',
    overflow: 'hidden',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 52,
  },
  prompt: {
    color: '#00F5FF',
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
    opacity: 0.8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#A0D4FF',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  searchButton: {
    marginLeft: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00F5FF',
    borderRadius: 2,
  },
  searchButtonText: {
    color: '#00F5FF',
    fontWeight: '800',
    fontSize: 12,
    fontFamily: 'monospace',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 245, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  bottomGlow: {
    height: 1,
    backgroundColor: '#00F5FF',
    opacity: 0.4,
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
});

export default SearchInput;
