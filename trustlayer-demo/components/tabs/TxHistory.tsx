import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Transaction, formatAge } from '@/utils/blockchain';

interface TxHistoryProps {
  transactions: Transaction[];
}

const DIR_CONFIG = {
  IN:       { icon: '↓', color: '#00FF88', label: 'IN  ' },
  OUT:      { icon: '↑', color: '#FF0066', label: 'OUT ' },
  CONTRACT: { icon: '⚙', color: '#C084FC', label: 'CALL' },
};

const TxHistory: React.FC<TxHistoryProps> = ({ transactions }) => (
  <View style={styles.wrapper}>
    <View style={styles.header}>
      <View style={styles.headerDot} />
      <View style={styles.headerTextGroup}>
        <Text style={styles.title}>RECENT_TRANSACTIONS</Text>
        <Text style={styles.simLabel}>⚗ simulation data</Text>
      </View>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{transactions.length}</Text>
      </View>
    </View>


    <View style={styles.tableHead}>
      <Text style={[styles.col, styles.colDir]}>DIR</Text>
      <Text style={[styles.col, styles.colHash]}>HASH</Text>
      <Text style={[styles.col, styles.colVal]}>VALUE</Text>
      <Text style={[styles.col, styles.colAge]}>AGE</Text>
    </View>

    {transactions.map((tx, i) => {
      const cfg = DIR_CONFIG[tx.direction];
      const isPending = tx.status === 'pending';
      return (
        <View key={i} style={[styles.row, isPending && styles.rowPending]}>

          <View style={[styles.colView, styles.colDir, styles.dirCell]}>
            <Text style={[styles.dirIcon, { color: cfg.color }]}>{cfg.icon}</Text>
            <Text style={[styles.dirLabel, { color: cfg.color }]}>{cfg.label}</Text>
          </View>


          <View style={[styles.colView, styles.colHash]}>
            <Text style={styles.hashText}>{tx.hash}</Text>
            {tx.method && (
              <Text style={styles.methodText}>{tx.method}</Text>
            )}
          </View>


          <Text style={[styles.colView, styles.colVal, styles.valueText, { color: cfg.color }]}>
            {tx.direction === 'CONTRACT'
              ? '—'
              : `${tx.value} ${tx.currency}`}
          </Text>


          <View style={[styles.colView, styles.colAge]}>
            {isPending ? (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>PENDING</Text>
              </View>
            ) : (
              <Text style={styles.ageText}>{formatAge(tx.ageSeconds)}</Text>
            )}
          </View>
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: '#070D1A',
    borderWidth: 1,
    borderColor: '#1A2A4A',
    borderLeftWidth: 2,
    borderLeftColor: '#00FF88',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1A2A4A',
  },
  headerDot: {
    width: 6, height: 6, borderRadius: 1,
    backgroundColor: '#00FF88',
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 4,
  },
  title: {
    fontSize: 10, fontWeight: '800', color: '#00FF88',
    fontFamily: 'monospace', letterSpacing: 1.5, opacity: 0.8,
  },
  headerTextGroup: {
    flex: 1,
    gap: 2,
  },
  simLabel: {
    fontSize: 9, color: '#FFA500', fontFamily: 'monospace',
    fontWeight: '600', letterSpacing: 0.5, opacity: 0.8,
  },
  countBadge: {
    backgroundColor: '#051A10',
    borderWidth: 1, borderColor: '#00FF88',
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 2,
  },
  countText: { fontSize: 10, color: '#00FF88', fontFamily: 'monospace', fontWeight: '700' },

  tableHead: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#050D18',
    borderBottomWidth: 1,
    borderBottomColor: '#1A2A4A',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#0D1A2A',
  },
  rowPending: {
    backgroundColor: 'rgba(255, 230, 0, 0.04)',
  },
  col: { fontFamily: 'monospace' as const },
  colView: { overflow: 'hidden' as const },
  colDir:  { width: 52 },
  colHash: { flex: 1 },
  colVal:  { width: 80, textAlign: 'right' as const },
  colAge:  { width: 64, alignItems: 'flex-end' as const },
  dirCell: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dirIcon: { fontSize: 12, fontWeight: '900' },
  dirLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  hashText: { fontSize: 11, color: '#4A7A9A', letterSpacing: 0.3 },
  methodText: { fontSize: 10, color: '#C084FC', marginTop: 2, letterSpacing: 0.3 },
  valueText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  ageText: { fontSize: 10, color: '#2A4A6A', letterSpacing: 0.3 },
  pendingBadge: {
    backgroundColor: 'rgba(255,230,0,0.12)',
    borderWidth: 1, borderColor: '#FFE600',
    paddingHorizontal: 5, paddingVertical: 2, borderRadius: 2,
  },
  pendingText: { fontSize: 8, color: '#FFE600', fontWeight: '800', letterSpacing: 0.5 },
});

export default TxHistory;
