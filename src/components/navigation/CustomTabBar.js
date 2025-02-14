import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 4;

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const translateX = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * TAB_WIDTH,
      useNativeDriver: true,
      damping: 20,
      stiffness: 300,
    }).start();
  }, [state.index]);

  const handleTabPress = (index, isFocused, route) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.card,
          paddingBottom: insets.bottom || 20,
        }
      ]}
    >
      {/* Active Tab Indicator */}
      <Animated.View
        style={[
          styles.indicator,
          {
            backgroundColor: theme.colors.primary,
            transform: [{ translateX }],
          },
        ]}
      />

      {/* Tab Buttons */}
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        let iconName;
        switch (route.name) {
          case 'Home':
            iconName = isFocused ? 'home' : 'home-outline';
            break;
          case 'Search':
            iconName = isFocused ? 'search' : 'search-outline';
            break;
          case 'Categories':
            iconName = isFocused ? 'grid' : 'grid-outline';
            break;
          case 'Profile':
            iconName = isFocused ? 'person' : 'person-outline';
            break;
          default:
            iconName = 'ellipsis-horizontal';
        }

        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            onPress={() => handleTabPress(index, isFocused, route)}
            style={styles.tabButton}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={iconName}
                size={26}
                color={isFocused ? theme.colors.primary : theme.colors.subtext}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.label,
                  {
                    color: isFocused ? theme.colors.primary : theme.colors.subtext,
                    fontWeight: isFocused ? '600' : '400',
                  },
                ]}
              >
                {route.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#fff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: TAB_WIDTH,
    height: 3,
    backgroundColor: '#1E90FF',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: TAB_WIDTH,
    paddingVertical: 8,
    paddingTop: 15,
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default CustomTabBar;