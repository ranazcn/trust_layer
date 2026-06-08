import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProtocolTag } from '@/utils/blockchain';

interface ProtocolBadgesProps {
  protocols: ProtocolTag[];
}

const ProtocolBadges: React.FC<ProtocolBadgesProps> = ({ protocols }) => (
  <View style={styles.wrapper}>
    <View style={styles.header}>
      <View style={styles.headerDot} />
      <Text style={styles.title}>PROTOCOL_INTERACTIONS</Text>
    </View>
    <View style={styles.badges}>
      {protocols.map((p, i) => (
        <View key={i} style={[styles.badge, { borderColor: p.color, backgroundColor: p.color + '15' }]}>
          <Text style={styles.badgeIcon}>{p.icon}</Text>
          <Text style={[styles.badgeName, { color: p.color }]}>{p.name}</Text>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: '#070D1A',
    borderWidth: 1,
    borderColor: '#1A2A4A',
    borderRadius: 4,
    padding: 14,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  headerDot: {
    width: 6, height: 6, borderRadius: 1,
    backgroundColor: '#00F5FF',
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 4,
  },
  title: {
    fontSize: 10, fontWeight: '800', color: '#00F5FF',
    fontFamily: 'monospace', letterSpacing: 1.5, opacity: 0.8,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 2,
  },
  badgeIcon: { fontSize: 12 },
  badgeName: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default ProtocolBadges;
