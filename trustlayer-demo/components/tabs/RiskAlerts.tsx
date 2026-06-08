import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RiskAlert } from '@/utils/blockchain';

interface RiskAlertsProps {
  alerts: RiskAlert[];
}

const SEVERITY_CONFIG = {
  HIGH: { color: '#FF0066', bg: 'rgba(255,0,102,0.08)', icon: '⛔', glow: '#FF0066' },
  MED:  { color: '#FFE600', bg: 'rgba(255,230,0,0.08)', icon: '⚠️', glow: '#FFE600' },
  LOW:  { color: '#00F5FF', bg: 'rgba(0,245,255,0.05)', icon: '🔵', glow: '#00F5FF' },
};

const RiskAlerts: React.FC<RiskAlertsProps> = ({ alerts }) => {
  if (alerts.length === 0) {
    return (
      <View style={styles.cleanWrapper}>
        <View style={styles.cleanHeader}>
          <View style={[styles.headerDot, { backgroundColor: '#00FF88', shadowColor: '#00FF88' }]} />
          <Text style={[styles.cleanTitle]}>RISK_ANALYSIS · CLEAN</Text>
        </View>
        <Text style={styles.cleanDesc}>
          {'> '}<Text style={styles.cleanGreen}>PASS</Text>
          {' · No known risky address interactions detected.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View style={[styles.headerDot, { backgroundColor: '#FF0066', shadowColor: '#FF0066' }]} />
        <Text style={styles.title}>RISK_ALERTS</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{alerts.length} ALERT</Text>
        </View>
      </View>

      {alerts.map((alert) => {
        const cfg = SEVERITY_CONFIG[alert.severity];
        return (
          <View key={alert.id} style={[styles.alertRow, { backgroundColor: cfg.bg, borderLeftColor: cfg.color }]}>
            <View style={styles.alertLeft}>
              <View style={[styles.severityBadge, { borderColor: cfg.color }]}>
                <Text style={[styles.severityText, { color: cfg.color }]}>{alert.severity}</Text>
              </View>
              <View style={styles.alertContent}>
                <Text style={[styles.alertCategory, { color: cfg.color }]}>{alert.category}</Text>
                <Text style={styles.alertDesc}>{alert.description}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: '#070D1A',
    borderWidth: 1,
    borderColor: '#1A2A4A',
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
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 4,
  },
  title: {
    fontSize: 10, fontWeight: '800', color: '#FF0066',
    fontFamily: 'monospace', letterSpacing: 1.5, flex: 1,
  },
  countBadge: {
    backgroundColor: 'rgba(255,0,102,0.12)',
    borderWidth: 1, borderColor: '#FF0066',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 2,
  },
  countText: { fontSize: 9, color: '#FF0066', fontFamily: 'monospace', fontWeight: '800', letterSpacing: 0.5 },
  alertRow: {
    borderLeftWidth: 3,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#0D1A2A',
  },
  alertLeft: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  severityBadge: {
    borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 2, alignSelf: 'flex-start',
  },
  severityText: { fontSize: 9, fontFamily: 'monospace', fontWeight: '900', letterSpacing: 1 },
  alertContent: { flex: 1, gap: 3 },
  alertCategory: { fontSize: 11, fontFamily: 'monospace', fontWeight: '800', letterSpacing: 0.5 },
  alertDesc: { fontSize: 12, color: '#4A6A8A', fontFamily: 'monospace', lineHeight: 18 },
  // Temiz durum
  cleanWrapper: {
    width: '100%',
    backgroundColor: '#051A10',
    borderWidth: 1,
    borderColor: '#1A3A2A',
    borderLeftWidth: 2,
    borderLeftColor: '#00FF88',
    borderRadius: 4,
    padding: 14,
    marginBottom: 12,
  },
  cleanHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  cleanTitle: {
    fontSize: 10, fontWeight: '800', color: '#00FF88',
    fontFamily: 'monospace', letterSpacing: 1.5,
  },
  cleanDesc: { fontSize: 12, color: '#2A5A3A', fontFamily: 'monospace', lineHeight: 18 },
  cleanGreen: { color: '#00FF88', fontWeight: '800' },
});

export default RiskAlerts;
