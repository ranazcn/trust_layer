import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ChainId,
  CHAINS,
  Transaction,
  Token,
  RiskAlert,
  ProtocolTag,
  SecurityClearance,
  generateTxHistory,
  generateTokenPortfolio,
  generateRiskAlerts,
  generateProtocolTags,
  generateSecurityClearance,
} from '@/utils/blockchain';
import {
  calculateTrustScore,
  generateRandomMetrics,
  generateTxHash,
} from '@/utils/trustlayer';
import { Profile, TrustResult } from '@/utils/types';
import { DUMMY_PROFILES } from '@/utils/constants';

import TrustScoreDisplay from '@/components/tabs/TrustScoreDisplay';
import BreakdownDisplay from '@/components/tabs/BreakdownDisplay';
import RawDataDisplay from '@/components/tabs/RawDataDisplay';
import WalletDNA from '@/components/tabs/WalletDNA';
import SecurityClearanceDisplay from '@/components/tabs/SecurityClearance';
import TxHistory from '@/components/tabs/TxHistory';
import TokenPortfolio from '@/components/tabs/TokenPortfolio';
import RiskAlerts from '@/components/tabs/RiskAlerts';
import ProtocolBadges from '@/components/tabs/ProtocolBadges';
import LoadingSpinner from '@/components/tabs/LoadingSpinner';

type TabType = 'OVERVIEW' | 'PORTFOLIO' | 'ON-CHAIN';

export default function ProfileScreen() {
  const { address, chainId = 'ETH' } = useLocalSearchParams<{ address: string; chainId: string }>();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>('OVERVIEW');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [result, setResult] = useState<TrustResult | null>(null);
  const [txHash, setTxHash] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Sayfa yüklendiğinde profili bul veya rastgele üret
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      let foundProfile: Profile | undefined = DUMMY_PROFILES.find(p => p.address.toLowerCase() === address.toLowerCase());
      if (!foundProfile) {
        foundProfile = {
          id: Math.floor(Math.random() * 1000) + 100,
          address: address,
          name: 'UNKNOWN_NODE',
          metrics: generateRandomMetrics(),
        };
      }
      setProfile(foundProfile);
      setResult(calculateTrustScore(foundProfile.metrics));
      setTxHash(generateTxHash());
      setIsLoading(false);
    }, 800); // Küçük bir yükleme animasyonu efekti
  }, [address]);

  // Blockchain verileri
  const txHistory = useMemo<Transaction[]>(() =>
    profile ? generateTxHistory(profile.metrics.riskyInteractions, chainId as ChainId) : []
  , [profile, chainId]);

  const tokens = useMemo<Token[]>(() =>
    profile ? generateTokenPortfolio(chainId as ChainId) : []
  , [profile, chainId]);

  const riskAlerts = useMemo<RiskAlert[]>(() =>
    profile ? generateRiskAlerts(profile.metrics.riskyInteractions) : []
  , [profile, chainId]);

  const protocols = useMemo<ProtocolTag[]>(() =>
    profile ? generateProtocolTags(profile.metrics.txCount, chainId as ChainId) : []
  , [profile, chainId]);

  const security = useMemo<SecurityClearance | null>(() =>
    profile ? generateSecurityClearance(profile.address, profile.metrics.ageInMonths) : null
  , [profile]);

  if (isLoading || !profile || !result || !security) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <LoadingSpinner />
      </View>
    );
  }

  const chainColor = CHAINS[chainId as ChainId].color;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Grid arka plan */}
      <View style={styles.gridOverlay} pointerEvents="none">
        {Array.from({ length: 15 }).map((_, i) => (
          <View key={i} style={[styles.gridLine, { top: i * 80 }]} />
        ))}
      </View>

      {/* Geri Butonu & Başlık */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>◀_BACK</Text>
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>
          TRUST<Text style={[styles.appBarAccent, { color: chainColor }]}>LAYER</Text>_ANALYSIS
        </Text>
      </View>

      {/* Profil Özeti (Her zaman görünür) */}
      <View style={[styles.profileHeader, { borderLeftColor: chainColor }]}>
        <View style={styles.profileHeaderLeft}>
          <Text style={styles.profileLabel}>// TARGET_NODE</Text>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileAddress} numberOfLines={1} selectable>{profile.address}</Text>
        </View>
        <View style={styles.onlineBadge}>
          <View style={[styles.onlineDot, { backgroundColor: chainColor }]} />
          <Text style={[styles.onlineBadgeText, { color: chainColor }]}>{CHAINS[chainId as ChainId].label}</Text>
        </View>
      </View>

      {/* Segmented Tabs Menüsü */}
      <View style={styles.tabBar}>
        {(['OVERVIEW', 'PORTFOLIO', 'ON-CHAIN'] as TabType[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, isActive && { borderBottomColor: chainColor, borderBottomWidth: 2 }]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && { color: chainColor, opacity: 1 }]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Dinamik İçerik */}
      <ScrollView contentContainerStyle={styles.content} indicatorStyle="white">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <View style={styles.tabContent}>
            <WalletDNA address={profile.address} />
            <SecurityClearanceDisplay data={security} />
            <TrustScoreDisplay result={result} />
            <BreakdownDisplay breakdown={result.breakdown} />
            {riskAlerts.length > 0 && <RiskAlerts alerts={riskAlerts} />}
          </View>
        )}

        {/* TAB 2: PORTFOLIO */}
        {activeTab === 'PORTFOLIO' && (
          <View style={styles.tabContent}>
            <TokenPortfolio tokens={tokens} />
            <ProtocolBadges protocols={protocols} />
          </View>
        )}

        {/* TAB 3: ON-CHAIN */}
        {activeTab === 'ON-CHAIN' && (
          <View style={styles.tabContent}>
            <View style={styles.txContainer}>
              <Text style={styles.txLabel}>◈ ON-CHAIN_ATTESTATION_RECORD</Text>
              <Text style={styles.txHash} numberOfLines={1} selectable>{txHash}</Text>
            </View>
            <TxHistory transactions={txHistory} />
            <RawDataDisplay profile={profile} chainId={chainId as ChainId} />
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050810' },
  loadingContainer: { flex: 1, backgroundColor: '#050810', justifyContent: 'center' },
  gridOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 },
  gridLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(0, 245, 255, 0.04)' },
  
  appBar: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 15,
    borderBottomWidth: 1, borderBottomColor: '#1A2A4A', zIndex: 1, backgroundColor: '#050810',
  },
  backBtn: { marginRight: 16, padding: 8, backgroundColor: 'rgba(0, 245, 255, 0.05)', borderRadius: 4, borderWidth: 1, borderColor: '#1A2A4A' },
  backBtnText: { color: '#00F5FF', fontFamily: 'monospace', fontSize: 11, fontWeight: '700' },
  appBarTitle: { fontSize: 16, fontWeight: '900', color: '#D0E8FF', letterSpacing: 2, fontFamily: 'monospace' },
  appBarAccent: { color: '#00F5FF' },

  profileHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 20, paddingVertical: 20, zIndex: 1, borderLeftWidth: 3, borderBottomWidth: 1, borderBottomColor: '#0A1525',
    backgroundColor: '#070D1A',
  },
  profileHeaderLeft: { flex: 1, marginRight: 10 },
  profileLabel: { fontSize: 10, color: '#4A7A9A', fontFamily: 'monospace', letterSpacing: 1.5, marginBottom: 4 },
  profileName: { fontSize: 20, fontWeight: '900', color: '#C0D8F0', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 6 },
  profileAddress: { fontSize: 11, color: '#2A4A6A', fontFamily: 'monospace' },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#051A10', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 2, borderWidth: 1, borderColor: '#0A2A1A' },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00FF88', marginRight: 6, shadowColor: '#00FF88', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4 },
  onlineBadgeText: { fontSize: 9, color: '#00FF88', fontWeight: '800', fontFamily: 'monospace', letterSpacing: 1 },

  tabBar: {
    flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#1A2A4A', zIndex: 1, backgroundColor: '#050810',
  },
  tabBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabText: { fontSize: 11, fontFamily: 'monospace', fontWeight: '700', color: '#4A7A9A', letterSpacing: 1, opacity: 0.7 },

  content: { padding: 20 },
  tabContent: { gap: 16 },

  txContainer: {
    backgroundColor: '#070D1A', padding: 12, borderRadius: 4, borderWidth: 1, borderColor: '#1A2A4A',
    borderLeftWidth: 2, borderLeftColor: '#4A7A9A', marginBottom: 4,
  },
  txLabel: { fontSize: 9, color: '#4A7A9A', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 6 },
  txHash: { fontSize: 11, color: '#00F5FF', fontFamily: 'monospace', letterSpacing: 0.5 },
});
