import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Profile, TrustResult } from '@/utils/types';
import {
  generateTxHistory,
  generateTokenPortfolio,
  generateRiskAlerts,
  generateProtocolTags,
  Transaction,
  Token,
  RiskAlert,
  ProtocolTag,
  ChainId,
  SecurityClearance,
  generateSecurityClearance,
} from '@/utils/blockchain';
import TrustScoreDisplay from './TrustScoreDisplay';
import BreakdownDisplay from './BreakdownDisplay';
import RawDataDisplay from './RawDataDisplay';
import WalletDNA from './WalletDNA';
import SecurityClearanceDisplay from './SecurityClearance';
import TxHistory from './TxHistory';
import TokenPortfolio from './TokenPortfolio';
import RiskAlerts from './RiskAlerts';
import ProtocolBadges from './ProtocolBadges';

interface ResultCardProps {
  profile: Profile;
  result: TrustResult;
  txHash: string;
  chainId: ChainId;
}

const ResultCard: React.FC<ResultCardProps> = ({ profile, result, txHash, chainId }) => {
  const [showRawData, setShowRawData] = useState(false);


  const txHistory = useMemo<Transaction[]>(() =>
    generateTxHistory(profile.metrics.riskyInteractions, chainId)
  , [profile, chainId]);
  
  const tokens = useMemo<Token[]>(() => 
    generateTokenPortfolio(chainId)
  , [profile, chainId]);
  
  const riskAlerts = useMemo<RiskAlert[]>(() =>
    generateRiskAlerts(profile.metrics.riskyInteractions)
  , [profile, chainId]);
  
  const protocols = useMemo<ProtocolTag[]>(() =>
    generateProtocolTags(profile.metrics.txCount, chainId)
  , [profile, chainId]);

  const security = useMemo<SecurityClearance>(() =>
    generateSecurityClearance(profile.address, profile.metrics.ageInMonths)
  , [profile]);

  return (
    <View style={styles.container}>

      <View style={styles.accentTopLeft} />
      <View style={styles.accentBottomRight} />


      <View style={styles.profileHeader}>
        <View style={styles.profileHeaderLeft}>
          <Text style={styles.profileLabel}>// HEDEF_NODE</Text>
          <Text style={styles.profileName}>{profile.name}</Text>
        </View>
        <View style={styles.onlineBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineBadgeText}>ACTIVE</Text>
        </View>
      </View>
      <Text style={styles.profileAddress} numberOfLines={1} selectable={true}>{profile.address}</Text>

      <View style={styles.divider} />


      <WalletDNA address={profile.address} />
      

      <SecurityClearanceDisplay data={security} />

      <TrustScoreDisplay result={result} />


      <View style={styles.txContainer}>
        <Text style={styles.txLabel}>◈ ON-CHAIN_DOĞRULAMA_KAYDI</Text>
        <Text style={styles.txHash} numberOfLines={1} selectable={true}>{txHash}</Text>
      </View>


      <RiskAlerts alerts={riskAlerts} />


      <ProtocolBadges protocols={protocols} />


      <TokenPortfolio tokens={tokens} />


      <TxHistory transactions={txHistory} />


      <BreakdownDisplay breakdown={result.breakdown} />


      <TouchableOpacity
        style={[styles.rawDataButton, showRawData && styles.rawDataButtonActive]}
        onPress={() => setShowRawData(!showRawData)}
        activeOpacity={0.7}
      >
        <View style={styles.rawDataButtonInner}>
          <View style={styles.rawDataButtonLeft}>
            <View style={styles.codeIcon}>
              <Text style={styles.codeIconText}>{'</>'}</Text>
            </View>
            <Text style={styles.rawDataButtonText}>AKILLI_KONTRAT_VERİSİ</Text>
          </View>
          <Text style={[styles.chevron, showRawData && styles.chevronOpen]}>›</Text>
        </View>
      </TouchableOpacity>

      {showRawData && <RawDataDisplay profile={profile} chainId={chainId} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    padding: 20,
    backgroundColor: '#070D1A',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1A2A4A',
    marginBottom: 28,
    position: 'relative',
    overflow: 'hidden',
  },
  accentTopLeft: {
    position: 'absolute', top: 0, left: 0, width: 40, height: 2,
    backgroundColor: '#00F5FF',
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 4,
  },
  accentBottomRight: {
    position: 'absolute', bottom: 0, right: 0, width: 40, height: 2,
    backgroundColor: '#FF0066',
    shadowColor: '#FF0066',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  profileHeaderLeft: { flex: 1 },
  profileLabel: { fontSize: 10, color: '#2A4A6A', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 4 },
  profileName: { fontSize: 18, fontWeight: '800', color: '#D0E8FF', fontFamily: 'monospace', letterSpacing: 1 },
  onlineBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#051A10', borderWidth: 1, borderColor: '#00FF88',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 2,
  },
  onlineDot: {
    width: 5, height: 5, borderRadius: 2.5,
    backgroundColor: '#00FF88',
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 3,
  },
  onlineBadgeText: { fontSize: 9, fontWeight: '800', color: '#00FF88', fontFamily: 'monospace', letterSpacing: 1 },
  profileAddress: { fontSize: 11, color: '#2A5A7A', fontFamily: 'monospace', marginTop: 6, letterSpacing: 0.5 },
  divider: { height: 1, backgroundColor: '#1A2A4A', marginVertical: 16 },
  txContainer: {
    backgroundColor: '#050D18', padding: 12, borderRadius: 2,
    borderWidth: 1, borderColor: '#1A2A4A',
    borderLeftWidth: 2, borderLeftColor: '#00F5FF', marginBottom: 12,
  },
  txLabel: { fontSize: 9, fontWeight: '800', color: '#00F5FF', fontFamily: 'monospace', letterSpacing: 1.5, marginBottom: 5, opacity: 0.8 },
  txHash: { fontSize: 11, color: '#4A8AAA', fontFamily: 'monospace', letterSpacing: 0.3 },
  rawDataButton: {
    marginTop: 4, width: '100%', paddingVertical: 12, paddingHorizontal: 14,
    backgroundColor: '#050D18', borderRadius: 2,
    borderWidth: 1, borderColor: '#1A2A4A',
  },
  rawDataButtonActive: { borderColor: '#C084FC', backgroundColor: '#0A0518' },
  rawDataButtonInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rawDataButtonLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  codeIcon: {
    backgroundColor: '#1A0A30', borderRadius: 2,
    paddingHorizontal: 7, paddingVertical: 3,
    borderWidth: 1, borderColor: '#C084FC',
  },
  codeIconText: {
    color: '#C084FC', fontSize: 11, fontFamily: 'monospace', fontWeight: '700',
    textShadowColor: 'rgba(192, 132, 252, 0.6)',
    textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 4,
  },
  rawDataButtonText: { color: '#8090A0', fontSize: 12, fontWeight: '700', fontFamily: 'monospace', letterSpacing: 1 },
  chevron: { color: '#2A4A6A', fontSize: 22, transform: [{ rotate: '90deg' }] },
  chevronOpen: { color: '#C084FC', transform: [{ rotate: '270deg' }] },
});

export default ResultCard;
