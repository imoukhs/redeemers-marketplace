import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const BOX_SIZE = 40;
const ANIMATION_DURATION = 800;

const Box = ({ index, animatedValue }) => {
  const { theme } = useTheme();

  const getTransform = () => {
    switch (index) {
      case 0:
        return {
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [BOX_SIZE, BOX_SIZE, BOX_SIZE * 2]
              })
            }
          ]
        };
      case 1:
        return {
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0, BOX_SIZE]
              })
            },
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [BOX_SIZE, 0, 0]
              })
            }
          ]
        };
      case 2:
        return {
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [BOX_SIZE, BOX_SIZE, 0]
              })
            },
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [BOX_SIZE, BOX_SIZE, BOX_SIZE]
              })
            }
          ]
        };
      case 3:
        return {
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [BOX_SIZE * 2, BOX_SIZE * 2, BOX_SIZE]
              })
            },
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, BOX_SIZE, BOX_SIZE]
              })
            }
          ]
        };
      default:
        return {};
    }
  };

  const boxShadow = {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  };

  return (
    <Animated.View style={[styles.box, getTransform(), boxShadow]}>
      {/* Main face */}
      <View style={[styles.face, { backgroundColor: theme.colors.primary }]} />
      
      {/* Right face */}
      <View style={[styles.rightFace, { backgroundColor: theme.colors.primary, opacity: 0.8 }]} />
      
      {/* Bottom face */}
      <View style={[styles.bottomFace, { backgroundColor: theme.colors.primary, opacity: 0.6 }]} />
    </Animated.View>
  );
};

const CustomLoader = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        <View style={styles.boxes}>
          {[0, 1, 2, 3].map((index) => (
            <Box key={index} index={index} animatedValue={animatedValue} />
          ))}
        </View>
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
  loaderContainer: {
    width: BOX_SIZE * 4,
    height: BOX_SIZE * 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxes: {
    width: BOX_SIZE * 3,
    height: BOX_SIZE * 2,
    transform: [
      { rotateX: '60deg' },
      { rotateZ: '45deg' },
    ],
    marginTop: -BOX_SIZE,
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    position: 'absolute',
  },
  face: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  rightFace: {
    position: 'absolute',
    width: BOX_SIZE / 2,
    height: '100%',
    right: -BOX_SIZE / 2,
    borderRadius: 4,
    transform: [
      { skewY: '45deg' }
    ],
  },
  bottomFace: {
    position: 'absolute',
    width: '100%',
    height: BOX_SIZE / 2,
    bottom: -BOX_SIZE / 2,
    borderRadius: 4,
    transform: [
      { skewX: '45deg' }
    ],
  },
});

export default CustomLoader; 