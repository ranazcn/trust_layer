import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SecurityClearance } from '@/utils/blockchain';

interface SecurityClearanceProps {
  data: SecurityClearance;
}

const SecurityClearanceDisplay: React.FC<SecurityClearanceProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerDot} />
        <Text style={styles.title}>SECURITY_PARAMETERS (ZK-PROOF)</Text>
      </View>

      <View style={styles.grid}>

        <View style={[styles.card, data.isHuman ? styles.cardActive : styles.cardInactive]}>
          <Text style={styles.cardLabel}>ZK-KYC STATUS</Text>
          <Text style={[styles.cardValue, data.isHuman ? styles.textActive : styles.textInactive]}>
            {data.isHuman ? 'HUMANITY_VERIFIED' : 'UNVERIFIED'}
          </Text>
        </View>


        <View style={[styles.card, data.ensName ? styles.cardActive : styles.cardInactive]}>
          <Text style={styles.cardLabel}>ON-CHAIN IDENTITY</Text>
          <Text style={[styles.cardValue, data.ensName ? styles.textActive : styles.textInactive]}>
            {data.ensName ? data.ensName.toUpperCase() : 'NO_ENS_RECORD'}
          </Text>
        </View>


        <View style={[styles.card, data.isHardware ? styles.cardActive : styles.cardInactive]}>
          <Text style={styles.cardLabel}>WALLET TYPE</Text>
          <Text style={[styles.cardValue, data.isHardware ? styles.textActive : styles.textInactive]}>
            {data.isHardware ? 'HARDWARE_SIG' : 'HOT_WALLET'}
          </Text>
        </View>


        <View style={[styles.card, styles.cardActive]}>
          <Text style={styles.cardLabel}>WALLET_AGE</Text>
          <Text style={[styles.cardValue, styles.textActive]}>{data.ageTier}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  headerDot: {
    width: 6,
    height: 6,
    borderRadius: 1,
    backgroundColor: '#00F5FF',
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#070D1A',
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
  },
  cardActive: {
    borderColor: '#00F5FF',
    borderLeftWidth: 3,
    borderLeftColor: '#00F5FF',
  },
  cardInactive: {
    borderColor: '#1A2A4A',
    borderLeftWidth: 3,
    borderLeftColor: '#1A2A4A',
  },
  cardLabel: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: '#4A7A9A',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  textActive: {
    color: '#C0D8F0',
  },
  textInactive: {
    color: '#4A7A9A',
    opacity: 0.6,
  },
});

export default SecurityClearanceDisplay;
