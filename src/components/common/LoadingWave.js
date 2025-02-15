import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const LoadingWave = ({ color = '#007AFF', size = 50 }) => {
  const animations = [...Array(3)].map(() => new Animated.Value(0));

  useEffect(() => {
    const createAnimation = (value, delay) => {
      return Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(value, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(value, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
    };

    Animated.parallel(
      animations.map((value, index) => createAnimation(value, index * 333))
    ).start();

    return () => {
      animations.forEach(anim => anim.stopAnimation());
    };
  }, []);

  return (
    <View style={[styles.container, { height: size }]}>
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: color,
              width: size / 6,
              height: size / 6,
              borderRadius: size / 12,
              transform: [
                {
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -(size / 3)],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    marginHorizontal: 4,
  },
});

export default LoadingWave; 