import React, { useState, useMemo } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
  TextInput, Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Profile } from '@/utils/types';

interface ProfileListProps {
  profiles: Profile[];
  onSelectProfile: (profile: Profile) => void;
}

const ACCENT_COLORS = ['#00F5FF', '#FF0066', '#00FF88', '#C084FC', '#FFE600'];


const getArchetypeColor = (name: string): string => {
  if (name.includes('Bot') || name.includes('Mixer')) return '#FF0066';
  if (name.includes('Balina') || name.includes('Kurucu')) return '#00F5FF';
  if (name.includes('DeFi') || name.includes('Trader')) return '#00FF88';
  if (name.includes('DAO') || name.includes('Staker')) return '#C084FC';
  if (name.includes('NFT')) return '#FF9500';
  return '#FFE600';
};

const PAGE_SIZE = 20;

const ProfileList: React.FC<ProfileListProps> = ({ profiles, onSelectProfile }) => {
  const [filter, setFilter] = useState('');
  const [showAll, setShowAll] = useState(false);


  const filtered = useMemo(() => {
    if (!filter.trim()) return profiles;
    const q = filter.toLowerCase();
    return profiles.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
    );
  }, [profiles, filter]);

  const displayed = showAll ? filtered : filtered.slice(0, PAGE_SIZE);
  const remaining = filtered.length - displayed.length;

  const handleCopy = async (address: string, name: string) => {
    await Clipboard.setStringAsync(address);
    Alert.alert(
      '◈ Address Copied',
      `${name}\n\n${address}\n\nYou can paste this address into the search box.`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <View style={styles.container}>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionDot} />
        <Text style={styles.sectionTitle}>NODE_DIRECTORY</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{filtered.length}/{profiles.length}</Text>
        </View>
      </View>


      <View style={styles.filterWrapper}>
        <Text style={styles.filterPrompt}>🔍</Text>
        <TextInput
          style={styles.filterInput}
          placeholder="search name or address..."
          placeholderTextColor="#1E3A5A"
          value={filter}
          onChangeText={(t) => { setFilter(t); setShowAll(false); }}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {filter.length > 0 && (
          <TouchableOpacity onPress={() => setFilter('')} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>


      {displayed.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>// NO_RESULTS_FOUND</Text>
          <Text style={styles.emptySubText}>No profiles match "{filter}"</Text>
        </View>
      ) : (
        displayed.map((item) => {
          const accentColor = getArchetypeColor(item.name);
          return (
            <View key={item.id?.toString() ?? item.address} style={[styles.profileCard, { borderLeftColor: accentColor }]}>

              <View style={styles.profileTop}>
                <Text style={styles.profileName} numberOfLines={1}>{item.name}</Text>
                <View style={[styles.idBadge, { borderColor: accentColor }]}>
                  <Text style={[styles.idBadgeText, { color: accentColor }]}>
                    #{String(item.id ?? 0).padStart(3, '0')}
                  </Text>
                </View>
              </View>


              <Text style={styles.profileAddress} numberOfLines={1} selectable={true}>{item.address}</Text>


              <View style={styles.actionRow}>

                <TouchableOpacity
                  style={styles.copyBtn}
                  onPress={() => handleCopy(item.address, item.name)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.copyBtnText}>⎘ Copy</Text>
                </TouchableOpacity>


                <TouchableOpacity
                  style={[styles.queryBtn, { borderColor: accentColor }]}
                  onPress={() => onSelectProfile(item)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.queryBtnText, { color: accentColor }]}>▶ Query</Text>
                </TouchableOpacity>
              </View>


              <View style={[styles.scanLine, { backgroundColor: accentColor }]} />
            </View>
          );
        })
      )}


      {remaining > 0 && (
        <TouchableOpacity style={styles.showMoreBtn} onPress={() => setShowAll(true)} activeOpacity={0.7}>
          <Text style={styles.showMoreText}>▼ show {remaining} more profiles</Text>
        </TouchableOpacity>
      )}
      {showAll && filtered.length > PAGE_SIZE && (
        <TouchableOpacity style={styles.showMoreBtn} onPress={() => setShowAll(false)} activeOpacity={0.7}>
          <Text style={styles.showMoreText}>▲ collapse</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 8 },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12,
  },
  sectionDot: {
    width: 6, height: 6, borderRadius: 1, backgroundColor: '#00F5FF',
    shadowColor: '#00F5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 10, fontWeight: '800', color: '#00F5FF',
    fontFamily: 'monospace', letterSpacing: 1.5, opacity: 0.8, flex: 1,
  },
  countBadge: {
    backgroundColor: '#0A1A2A', borderWidth: 1, borderColor: '#1A3A5A',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 2,
  },
  countText: { fontSize: 10, color: '#4A7A9A', fontFamily: 'monospace', fontWeight: '700' },


  filterWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#070D1A', borderWidth: 1, borderColor: '#1A2A4A',
    borderRadius: 4, paddingHorizontal: 12, height: 42, marginBottom: 12,
    gap: 8,
  },
  filterPrompt: { fontSize: 13 },
  filterInput: {
    flex: 1, fontSize: 12, color: '#A0D4FF', fontFamily: 'monospace',
  },
  clearBtn: { padding: 4 },
  clearBtnText: { color: '#2A4A6A', fontSize: 14, fontWeight: '700' },


  emptyState: { alignItems: 'center', paddingVertical: 32 },
  emptyText: { color: '#FF0066', fontFamily: 'monospace', fontSize: 12, fontWeight: '700' },
  emptySubText: { color: '#2A4A6A', fontFamily: 'monospace', fontSize: 11, marginTop: 6 },


  profileCard: {
    backgroundColor: '#070D1A', padding: 14, borderRadius: 4,
    marginBottom: 10, borderWidth: 1, borderColor: '#1A2A4A',
    borderLeftWidth: 3, position: 'relative', overflow: 'hidden',
  },
  profileTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  profileName: {
    fontSize: 13, fontWeight: '700', color: '#C0D8F0',
    fontFamily: 'monospace', letterSpacing: 0.5, flex: 1,
  },
  idBadge: { borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2, marginLeft: 8 },
  idBadgeText: { fontSize: 10, fontFamily: 'monospace', fontWeight: '700', letterSpacing: 1 },
  profileAddress: { fontSize: 10, color: '#2A4A6A', fontFamily: 'monospace', letterSpacing: 0.3, marginBottom: 10 },


  actionRow: { flexDirection: 'row', gap: 8 },
  copyBtn: {
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: '#0A1525', borderWidth: 1, borderColor: '#1A3A5A', borderRadius: 2,
  },
  copyBtnText: { color: '#4A7A9A', fontSize: 11, fontFamily: 'monospace', fontWeight: '700' },
  queryBtn: {
    flex: 1, paddingVertical: 6, alignItems: 'center',
    backgroundColor: 'transparent', borderWidth: 1, borderRadius: 2,
  },
  queryBtnText: { fontSize: 11, fontFamily: 'monospace', fontWeight: '800', letterSpacing: 0.5 },

  scanLine: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, opacity: 0.15 },


  showMoreBtn: {
    marginBottom: 12, paddingVertical: 12, alignItems: 'center',
    borderWidth: 1, borderColor: '#1A2A4A', borderRadius: 4,
    backgroundColor: '#070D1A',
  },
  showMoreText: { color: '#4A7A9A', fontFamily: 'monospace', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
});

export default ProfileList;
