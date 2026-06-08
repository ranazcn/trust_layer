import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BreakdownDisplayProps {
  breakdown: string[];
}

const BreakdownDisplay: React.FC<BreakdownDisplayProps> = ({ breakdown }) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <View style={styles.headerDot} />
      <Text style={styles.title}>ALGORITHMIC_RISK_ANALYSIS</Text>
    </View>
    {breakdown.map((item, index) => {
      const isPositive = item.includes('+');
      return (
        <View key={index} style={styles.row}>
          <Text style={[styles.bullet, { color: isPositive ? '#00FF88' : '#FF0066' }]}>
            {isPositive ? '▲' : '▼'}
          </Text>
          <Text style={[styles.item, { color: isPositive ? '#A0FFD0' : '#FFA0C0' }]}>
            {item}
          </Text>
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#070D1A',
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1A2A4A',
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  headerDot: {
    width: 6,
    height: 6,
    backgroundColor: '#00F5FF',
    borderRadius: 1,
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00F5FF',
    fontFamily: 'monospace',
    letterSpacing: 1.5,
    opacity: 0.8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  bullet: {
    fontSize: 10,
    fontWeight: '900',
  },
  item: {
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});

export default BreakdownDisplay;
