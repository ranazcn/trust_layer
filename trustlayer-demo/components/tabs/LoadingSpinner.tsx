import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';

const LoadingSpinner: React.FC = () => {
  const dots = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(dots, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(dots, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [dots]);

  const opacity = dots.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });

  const bars = [1, 0.7, 0.4, 0.2, 0.4, 0.7, 1];

  return (
    <View style={styles.container}>
      <View style={styles.barGroup}>
        {bars.map((h, i) => (
          <Animated.View
            key={i}
            style={[
              styles.bar,
              {
                height: 24 * h,
                opacity: dots.interpolate({
                  inputRange: [0, 1],
                  outputRange: [h * 0.3, h],
                }),
              },
            ]}
          />
        ))}
      </View>
      <Animated.Text style={[styles.loadingText, { opacity }]}>
        CONNECTING_TO_NODE...
      </Animated.Text>
      <Text style={styles.loadingSubtext}>{'> smart_contract.read() → pending'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 18,
    height: 30,
  },
  bar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: '#00F5FF',
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: '#00F5FF',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 245, 255, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 11,
    color: '#2A5A7A',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
});

export default LoadingSpinner;
