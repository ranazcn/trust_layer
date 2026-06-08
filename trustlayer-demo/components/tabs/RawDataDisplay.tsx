import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Profile } from '@/utils/types';
import { generateBlockNumber, generateTxHash } from '@/utils/trustlayer';
import { ChainId, CHAINS } from '@/utils/blockchain';

interface RawDataDisplayProps {
  profile: Profile;
  chainId: ChainId;
}


const C = {
  keyword: '#C084FC',
  type:    '#67E8F9',
  field:   '#93C5FD',
  string:  '#86EFAC',
  number:  '#FCA5A5',
  comment: '#6B7280',
  punct:   '#94A3B8',
  label:   '#F59E0B',
};

type CodeToken = { text: string; color: string };
type CodeLine = { lineNum: number; tokens: CodeToken[] };

const RawDataDisplay: React.FC<RawDataDisplayProps> = ({ profile, chainId }) => {
  const blockNumber = generateBlockNumber();
  const contractHash = generateTxHash();
  const gasUsed = (21000 + Math.floor(Math.random() * 8000)).toLocaleString();
  const timestamp = new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    Alert.alert('Copied', 'Contract data copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const codeLines: CodeLine[] = [
    { lineNum: 1,  tokens: [{ text: '// SPDX-License-Identifier: MIT', color: C.comment }] },
    { lineNum: 2,  tokens: [{ text: 'pragma ', color: C.keyword }, { text: 'solidity ', color: C.type }, { text: '^0.8.20;', color: C.punct }] },
    { lineNum: 3,  tokens: [] },
    { lineNum: 4,  tokens: [{ text: 'struct ', color: C.keyword }, { text: 'UserProfile ', color: C.type }, { text: '{', color: C.punct }] },
    { lineNum: 5,  tokens: [{ text: '  address ', color: C.keyword }, { text: 'user', color: C.field }, { text: ': ', color: C.punct }, { text: `"${profile.address.slice(0, 10)}...${profile.address.slice(-6)}"`, color: C.string }, { text: ';', color: C.punct }] },
    { lineNum: 6,  tokens: [{ text: '  uint256 ', color: C.keyword }, { text: 'ageInMonths', color: C.field }, { text: ': ', color: C.punct }, { text: `${profile.metrics.ageInMonths}`, color: C.number }, { text: ';', color: C.punct }] },
    { lineNum: 7,  tokens: [{ text: '  uint256 ', color: C.keyword }, { text: 'activeDays', color: C.field }, { text: ': ', color: C.punct }, { text: `${profile.metrics.activeDays}`, color: C.number }, { text: ';', color: C.punct }] },
    { lineNum: 8,  tokens: [{ text: '  uint256 ', color: C.keyword }, { text: 'txCount', color: C.field }, { text: ': ', color: C.punct }, { text: `${profile.metrics.txCount}`, color: C.number }, { text: ';', color: C.punct }] },
    { lineNum: 9,  tokens: [{ text: '  uint256 ', color: C.keyword }, { text: 'riskyInteractions', color: C.field }, { text: ': ', color: C.punct }, { text: `${profile.metrics.riskyInteractions}`, color: C.number }, { text: ';', color: C.punct }] },
    { lineNum: 10, tokens: [{ text: '  uint256 ', color: C.keyword }, { text: 'trustVotes', color: C.field }, { text: ': ', color: C.punct }, { text: `${profile.metrics.trustVotes}`, color: C.number }, { text: ';', color: C.punct }] },
    { lineNum: 11, tokens: [{ text: '  bool ', color: C.keyword }, { text: 'isVerified', color: C.field }, { text: ': ', color: C.punct }, { text: profile.metrics.riskyInteractions === 0 ? 'true' : 'false', color: profile.metrics.riskyInteractions === 0 ? '#4ADE80' : '#F87171' }, { text: ';', color: C.punct }] },
    { lineNum: 12, tokens: [{ text: '}', color: C.punct }] },
    { lineNum: 13, tokens: [] },
    { lineNum: 14, tokens: [{ text: `// Block: `, color: C.comment }, { text: `#${blockNumber}`, color: C.label }] },
    { lineNum: 15, tokens: [{ text: `// Gas: `, color: C.comment }, { text: `${gasUsed}`, color: C.label }] },
    { lineNum: 16, tokens: [{ text: `// Time: `, color: C.comment }, { text: timestamp, color: C.label }] },
  ];

  return (
    <View style={styles.wrapper}>

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Verified</Text>
          </View>
          <Text style={styles.headerTitle}>UserProfile.sol</Text>
        </View>
        <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
          <Text style={styles.copyBtnText}>{copied ? '✓ Copied' : '⎘ Copy'}</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>NETWORK</Text>
          <View style={styles.networkBadge}>
            <View style={[styles.networkDot, { backgroundColor: CHAINS[chainId].color }]} />
            <Text style={[styles.networkText, { color: CHAINS[chainId].color }]}>{CHAINS[chainId].label}</Text>
          </View>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>CONTRACT</Text>
          <Text style={styles.metaValue}>{contractHash.slice(0, 10)}…</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>BLOCK</Text>
          <Text style={styles.metaValue}>#{blockNumber.toLocaleString()}</Text>
        </View>
      </View>


      <View style={styles.editor}>
        {codeLines.map((line) => (
          <View key={line.lineNum} style={styles.codeLine}>
            <Text style={styles.lineNum}>{String(line.lineNum).padStart(2, ' ')}</Text>
            <View style={styles.lineContent}>
              {line.tokens.length === 0 ? (
                <Text style={styles.emptyLine}> </Text>
              ) : (
                line.tokens.map((token, i) => (
                  <Text key={i} style={[styles.token, { color: token.color }]}>
                    {token.text}
                  </Text>
                ))
              )}
            </View>
          </View>
        ))}
      </View>


      <View style={styles.footer}>
        <Text style={styles.footerText}>⛽ Gas Used: {gasUsed}</Text>
        <Text style={styles.footerText}>🔒 ABI-Encoded · Read-only</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
    backgroundColor: '#0D1117',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#161B22',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { color: '#E2E8F0', fontSize: 13, fontWeight: '600', fontFamily: 'monospace' },
  verifiedBadge: {
    backgroundColor: '#052E16',
    borderWidth: 1,
    borderColor: '#166534',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: { color: '#4ADE80', fontSize: 11, fontWeight: '700' },
  copyBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  copyBtnText: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },

  metaRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#0D1117',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    gap: 18,
  },
  metaItem: { alignItems: 'flex-start' },
  metaLabel: { fontSize: 9, fontWeight: '700', color: '#475569', letterSpacing: 0.8, marginBottom: 3 },
  metaValue: { fontSize: 11, fontFamily: 'monospace', color: '#67E8F9', fontWeight: '600' },
  networkBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  networkDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ADE80' },
  networkText: { fontSize: 11, color: '#4ADE80', fontWeight: '600' },

  editor: {
    paddingVertical: 12,
    paddingRight: 14,
    backgroundColor: '#0D1117',
  },
  codeLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 22,
  },
  lineNum: {
    width: 32,
    textAlign: 'right',
    paddingRight: 10,
    color: '#374151',
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 22,
    userSelect: 'none' as any,
  },
  lineContent: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  token: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 22,
  },
  emptyLine: { fontSize: 12, lineHeight: 22 },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#161B22',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  footerText: { fontSize: 10, color: '#475569', fontWeight: '500' },
});

export default RawDataDisplay;
