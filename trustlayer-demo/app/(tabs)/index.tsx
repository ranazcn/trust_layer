import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Keyboard } from 'react-native';

import { Profile, TrustResult } from '@/utils/types';
import { ChainId } from '@/utils/blockchain';
import { DUMMY_PROFILES, SEARCH_CONFIG } from '@/utils/constants';
import {
  calculateTrustScore,
  generateRandomMetrics,
  generateTxHash,
  isValidAddress,
} from '@/utils/trustlayer';
import LoadingSpinner from '@/components/tabs/LoadingSpinner';
import SearchInput from '@/components/tabs/SearchInput';
import ProfileList from '@/components/tabs/ProfileList';
import NetworkStatusBar from '@/components/tabs/NetworkStatusBar';
import ChainSelector from '@/components/tabs/ChainSelector';
import { useRouter } from 'expo-router';

export default function App() {
  const router = useRouter();
  const [selectedChain, setSelectedChain] = useState<ChainId>('ETH');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>('');

  const handleSelectProfile = (profile: Profile) => {
    Keyboard.dismiss();
    setSearchQuery('');
    setSearchError('');
    router.push({ pathname: '/profile/[address]', params: { address: profile.address, chainId: selectedChain } });
  };

  const handleChangeText = (text: string) => {
    setSearchQuery(text);
    if (searchError) setSearchError('');
  };

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery.length < SEARCH_CONFIG.MIN_ADDRESS_LENGTH) {
      setSearchError(`// ERR: minimum ${SEARCH_CONFIG.MIN_ADDRESS_LENGTH} characters required`);
      return;
    }

    if (!isValidAddress(trimmedQuery)) {
      setSearchError('// ERR: invalid wallet address');
      return;
    }

    setSearchError('');
    Keyboard.dismiss();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push({ pathname: '/profile/[address]', params: { address: trimmedQuery, chainId: selectedChain } });
    }, SEARCH_CONFIG.LOADING_DELAY);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >

      <View style={styles.statusBarWrapper}>
        <NetworkStatusBar chainId={selectedChain} />
      </View>


      <View style={styles.gridOverlay} pointerEvents="none">
        {Array.from({ length: 10 }).map((_, i) => (
          <View key={i} style={[styles.gridLine, { top: i * 120 }]} />
        ))}
      </View>


      <View style={styles.header}>
        <Text style={styles.headerTag}>{'// trustlayer_protocol · v1.0.0'}</Text>
        <Text style={styles.title}>TRUST<Text style={styles.titleAccent}>LAYER</Text></Text>
        <Text style={styles.subtitle}>_decentralized_trust_protocol</Text>
        <View style={styles.titleUnderline} />
      </View>


      <ChainSelector selected={selectedChain} onSelect={setSelectedChain} />


      <View style={styles.searchSection}>
        <Text style={styles.sectionLabel}>&gt; QUERY_WALLET_ADDRESS</Text>
        <SearchInput
          value={searchQuery}
          onChangeText={handleChangeText}
          onSearch={handleSearch}
        />
        {searchError ? (
          <Text style={styles.errorText}>{searchError}</Text>
        ) : null}
      </View>

      {isLoading && <LoadingSpinner />}

      {!isLoading && (
        <ProfileList profiles={DUMMY_PROFILES} onSelectProfile={handleSelectProfile} />
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050810',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  statusBarWrapper: {
    marginHorizontal: -20,
    marginBottom: 0,
  },
  gridOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 0,
  },
  gridLine: {
    position: 'absolute', left: 0, right: 0, height: 1,
    backgroundColor: 'rgba(0, 245, 255, 0.04)',
  },
  header: {
    marginTop: 24,
    marginBottom: 24,
    zIndex: 1,
  },
  headerTag: {
    fontSize: 11, fontFamily: 'monospace',
    color: '#2A4A6A', letterSpacing: 0.5, marginBottom: 10,
  },
  title: {
    fontSize: 42, fontWeight: '900', color: '#D0E8FF', letterSpacing: 4,
  },
  titleAccent: {
    color: '#00F5FF',
    textShadowColor: 'rgba(0, 245, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subtitle: {
    fontSize: 12, color: '#2A4A6A', fontFamily: 'monospace', letterSpacing: 1, marginTop: 6,
  },
  titleUnderline: {
    marginTop: 14, height: 1, backgroundColor: '#00F5FF', width: 60,
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 6,
  },
  searchSection: {
    marginBottom: 28, zIndex: 1,
  },
  sectionLabel: {
    fontSize: 11, fontFamily: 'monospace', color: '#00F5FF',
    letterSpacing: 1.5, marginBottom: 10, opacity: 0.8,
  },
  errorText: {
    marginTop: 8, fontSize: 12, color: '#FF0066',
    fontFamily: 'monospace', fontWeight: '600', letterSpacing: 0.5,
  },
});