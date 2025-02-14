import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const LoadingWave = ({ color = '#3498db' }) => {
  const barCount = 4;
  const animatedValues = useRef(
    Array(barCount).fill(0).map(() => new Animated.Value(10))
  ).current;

  useEffect(() => {
    const animations = animatedValues.map((value, index) => {
      return Animated.sequence([
        Animated.delay(index * 100),
        Animated.loop(
          Animated.sequence([
            Animated.timing(value, {
              toValue: 50,
              duration: 500,
              useNativeDriver: false,
            }),
            Animated.timing(value, {
              toValue: 10,
              duration: 500,
              useNativeDriver: false,
            }),
          ])
        ),
      ]);
    });

    Animated.parallel(animations).start();

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.wave}>
        {animatedValues.map((value, index) => (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              {
                height: value,
                backgroundColor: color,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wave: {
    width: 300,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  bar: {
    width: 20,
    marginHorizontal: 5,
    borderRadius: 5,
  },
});

export default LoadingWave; 