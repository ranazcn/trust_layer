import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { generateWalletDNA } from '@/utils/blockchain';

interface WalletDNAProps {
  address: string;
}

const GRID = 8;

const WalletDNA: React.FC<WalletDNAProps> = ({ address }) => {
  const palette = generateWalletDNA(address);


  const seed = address.toLowerCase().replace('0x', '').padEnd(64, '0');
  const cells: { color: string; lit: boolean }[] = Array.from({ length: GRID * GRID }, (_, i) => {
    const hex = parseInt(seed[i % seed.length], 16);
    const paletteIdx = hex % palette.length;
    const lit = hex > 5;
    return { color: palette[paletteIdx], lit };
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View style={styles.headerDot} />
        <Text style={styles.title}>WALLET_DNA_PARAMETER</Text>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.grid}>
          {cells.map((cell, i) => (
            <View
              key={i}
              style={[
                styles.cell,
                cell.lit
                  ? { backgroundColor: cell.color, shadowColor: cell.color }
                  : styles.cellDark,
              ]}
            />
          ))}
        </View>


        <View style={styles.info}>
          <Text style={styles.infoLabel}>IDENTIFIER</Text>
          <Text style={styles.infoAddress} numberOfLines={2} selectable={true}>
            {address.slice(0, 10)}{'\n'}{address.slice(10, 22)}...
          </Text>
          <View style={styles.paletteRow}>
            {palette.slice(0, 4).map((c, i) => (
              <View key={i} style={[styles.paletteChip, { backgroundColor: c }]} />
            ))}
          </View>
          <Text style={styles.infoSub}>Address specific ◈ unique</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  headerDot: {
    width: 6, height: 6, borderRadius: 1,
    backgroundColor: '#C084FC',
    shadowColor: '#C084FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 4,
  },
  title: {
    fontSize: 10, fontWeight: '800', color: '#C084FC',
    fontFamily: 'monospace', letterSpacing: 1.5, opacity: 0.8,
  },
  gridContainer: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: '#070D1A',
    borderWidth: 1,
    borderColor: '#1A2A4A',
    borderLeftWidth: 2,
    borderLeftColor: '#C084FC',
    borderRadius: 4,
    padding: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: GRID * 10,
  },
  cell: {
    width: 9,
    height: 9,
    margin: 0.5,
    borderRadius: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
  },
  cellDark: {
    backgroundColor: '#0D1525',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  infoLabel: {
    fontSize: 9, color: '#2A4A6A', fontFamily: 'monospace',
    fontWeight: '700', letterSpacing: 1,
  },
  infoAddress: {
    fontSize: 12, color: '#4A7A9A', fontFamily: 'monospace',
    letterSpacing: 0.3, lineHeight: 18,
  },
  paletteRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  paletteChip: {
    width: 14, height: 14, borderRadius: 2,
  },
  infoSub: {
    fontSize: 9, color: '#2A3A4A', fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
});

export default WalletDNA;
