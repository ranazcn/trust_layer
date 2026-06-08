import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Token } from '@/utils/blockchain';

interface TokenPortfolioProps {
  tokens: Token[];
}

const TokenPortfolio: React.FC<TokenPortfolioProps> = ({ tokens }) => {
  const totalUsd = tokens.reduce((sum, t) => sum + t.usdValue, 0);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View style={styles.headerDot} />
        <View style={styles.headerTextGroup}>
          <Text style={styles.title}>TOKEN_PORTFOLIO</Text>
          <Text style={styles.simLabel}>⚗ simulation data</Text>
        </View>
        <Text style={styles.totalValue}>${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
      </View>

      {tokens.map((token, i) => {
        const pct = totalUsd > 0 ? (token.usdValue / totalUsd) * 100 : 0;
        return (
          <View key={i} style={styles.tokenRow}>

            <View style={[styles.symbolBadge, { borderColor: token.color }]}>
              <Text style={[styles.symbolText, { color: token.color }]}>{token.symbol}</Text>
            </View>


            <View style={styles.tokenMid}>
              <View style={styles.tokenMidTop}>
                <Text style={styles.tokenName}>{token.name}</Text>
                <Text style={styles.tokenBalance}>{token.balance} {token.symbol}</Text>
              </View>

              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${pct}%` as any, backgroundColor: token.color, shadowColor: token.color }]} />
              </View>
            </View>


            <View style={styles.tokenRight}>
              <Text style={styles.tokenUsd}>${token.usdValue.toLocaleString()}</Text>
              <Text style={styles.tokenPct}>{pct.toFixed(1)}%</Text>
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
    borderLeftWidth: 2,
    borderLeftColor: '#FFE600',
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
    backgroundColor: '#FFE600',
    shadowColor: '#FFE600',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 4,
  },
  title: {
    fontSize: 10, fontWeight: '800', color: '#FFE600',
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
  totalValue: {
    fontSize: 14, fontWeight: '900', color: '#FFE600',
    fontFamily: 'monospace',
    textShadowColor: 'rgba(255,230,0,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#0D1A2A',
    gap: 12,
  },
  symbolBadge: {
    width: 44,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 2,
    alignItems: 'center',
    backgroundColor: '#050D18',
  },
  symbolText: {
    fontSize: 10, fontFamily: 'monospace', fontWeight: '800', letterSpacing: 0.5,
  },
  tokenMid: {
    flex: 1,
    gap: 5,
  },
  tokenMidTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tokenName: {
    fontSize: 12, color: '#6A9ABE', fontFamily: 'monospace',
  },
  tokenBalance: {
    fontSize: 11, color: '#2A4A6A', fontFamily: 'monospace',
  },
  barBg: {
    height: 3,
    backgroundColor: '#0D1A2A',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: 3,
    borderRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  tokenRight: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  tokenUsd: {
    fontSize: 12, color: '#A0C8E0', fontFamily: 'monospace', fontWeight: '700',
  },
  tokenPct: {
    fontSize: 9, color: '#2A4A6A', fontFamily: 'monospace',
  },
});

export default TokenPortfolio;
