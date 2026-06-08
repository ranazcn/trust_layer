import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TrustResult } from '@/utils/types';

interface TrustScoreDisplayProps {
  result: TrustResult;
}

const getNeonColor = (status: string) => {
  if (status === 'TRUSTED') return { primary: '#00FF88', glow: 'rgba(0, 255, 136, 0.4)' };
  if (status === 'MEDIUM')  return { primary: '#FFE600', glow: 'rgba(255, 230, 0, 0.4)' };
  return                         { primary: '#FF0066', glow: 'rgba(255, 0, 102, 0.4)' };
};

const TrustScoreDisplay: React.FC<TrustScoreDisplayProps> = ({ result }) => {
  const neon = getNeonColor(result.status);

  return (
    <View style={styles.wrapper}>

      <View style={[styles.corner, styles.cornerTL, { borderColor: neon.primary }]} />
      <View style={[styles.corner, styles.cornerTR, { borderColor: neon.primary }]} />
      <View style={[styles.corner, styles.cornerBL, { borderColor: neon.primary }]} />
      <View style={[styles.corner, styles.cornerBR, { borderColor: neon.primary }]} />

      <View style={[styles.innerCircle, { borderColor: neon.primary, shadowColor: neon.primary }]}>
        <Text style={[styles.scoreText, { color: neon.primary, textShadowColor: neon.primary }]}>
          {result.score}
        </Text>
        <Text style={styles.scoreLabel}>/100</Text>
      </View>


      <View style={[styles.statusBadge, { borderColor: neon.primary, backgroundColor: neon.glow }]}>
        <Text style={[styles.statusText, { color: neon.primary }]}>
          ◈ {result.status.toUpperCase()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: 24,
    position: 'relative',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  corner: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderWidth: 2,
  },
  cornerTL: { top: 0, left: 10, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 10, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 16, left: 10, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 16, right: 10, borderLeftWidth: 0, borderTopWidth: 0 },
  innerCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050810',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 8,
  },
  scoreText: {
    fontSize: 54,
    fontWeight: '900',
    letterSpacing: -2,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  scoreLabel: {
    fontSize: 13,
    color: '#2A4A6A',
    fontFamily: 'monospace',
    marginTop: -4,
    fontWeight: '600',
  },
  statusBadge: {
    marginTop: 14,
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
});

export default TrustScoreDisplay;
