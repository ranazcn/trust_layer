import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { ChainId, CHAINS } from '@/utils/blockchain';

interface ChainSelectorProps {
  selected: ChainId;
  onSelect: (chain: ChainId) => void;
}

const CHAIN_ORDER: ChainId[] = ['ETH', 'POLYGON', 'ARB', 'BASE'];

const ChainSelector: React.FC<ChainSelectorProps> = ({ selected, onSelect }) => (
  <View style={styles.wrapper}>
    <Text style={styles.label}>// SELECT_NETWORK</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {CHAIN_ORDER.map((id) => {
        const chain = CHAINS[id];
        const isSelected = id === selected;
        return (
          <TouchableOpacity
            key={id}
            style={[
              styles.chip,
              isSelected && { borderColor: chain.color, backgroundColor: chain.color + '18' },
            ]}
            onPress={() => onSelect(id)}
            activeOpacity={0.7}
          >
            {isSelected && (
              <View style={[styles.activeDot, { backgroundColor: chain.color, shadowColor: chain.color }]} />
            )}
            <Text style={[styles.chipId, isSelected && { color: chain.color }]}>{id}</Text>
            {isSelected && (
              <Text style={[styles.chipLabel, { color: chain.color + 'AA' }]}>
                {chain.label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#2A4A6A',
    letterSpacing: 1,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#1A2A4A',
    borderRadius: 2,
    backgroundColor: '#070D1A',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  chipId: {
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: '800',
    color: '#2A4A6A',
    letterSpacing: 1,
  },
  chipLabel: {
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
});

export default ChainSelector;
