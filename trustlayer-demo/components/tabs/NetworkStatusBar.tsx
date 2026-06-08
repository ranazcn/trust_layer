import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { ChainId, NetworkStatus, CHAINS, generateNetworkStatus } from '@/utils/blockchain';

interface NetworkStatusBarProps {
  chainId: ChainId;
}

const NetworkStatusBar: React.FC<NetworkStatusBarProps> = ({ chainId }) => {
  const [status, setStatus] = useState<NetworkStatus>(generateNetworkStatus(chainId));
  const blink = useRef(new Animated.Value(1)).current;


  useEffect(() => {
    setStatus(generateNetworkStatus(chainId));
  }, [chainId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus((prev) => ({
        ...generateNetworkStatus(chainId),
        blockNumber: prev.blockNumber + 1,
      }));
    }, 12000);
    return () => clearInterval(interval);
  }, [chainId]);


  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, { toValue: 0.2, duration: 800, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 1,   duration: 800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [blink]);

  const chain = CHAINS[chainId];

  return (
    <View style={[styles.container, { borderBottomColor: chain.color + '30' }]}>

      <View style={styles.group}>
        <Animated.View style={[styles.liveDot, { backgroundColor: chain.color, opacity: blink, shadowColor: chain.color }]} />
        <Text style={[styles.blockNum, { color: chain.color }]}>
          #{status.blockNumber.toLocaleString()}
        </Text>
      </View>


      <View style={styles.group}>
        <Text style={styles.statLabel}>GAS</Text>
        <Text style={styles.statValue}>{status.gasPrice} gwei</Text>
      </View>

      <View style={styles.group}>
        <Text style={styles.statLabel}>TPS</Text>
        <Text style={styles.statValue}>{status.tps}</Text>
      </View>


      <View style={styles.group}>
        <Text style={styles.statLabel}>ETH</Text>
        <Text style={[styles.ethPrice]}>${status.ethPrice.toLocaleString()}</Text>
      </View>


      <View style={styles.demoBadge}>
        <Text style={styles.demoText}>⚗ DEMO</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#070D1A',
    borderBottomWidth: 1,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  blockNum: {
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: '#2A4A6A',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#4A7A9A',
    fontWeight: '600',
  },
  ethPrice: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#FFE600',
    fontWeight: '700',
    textShadowColor: 'rgba(255,230,0,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  demoBadge: {
    backgroundColor: 'rgba(255, 165, 0, 0.12)',
    borderWidth: 1,
    borderColor: '#FFA500',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 2,
  },
  demoText: {
    fontSize: 9,
    fontFamily: 'monospace',
    fontWeight: '800',
    color: '#FFA500',
    letterSpacing: 1,
  },
});

export default NetworkStatusBar;
