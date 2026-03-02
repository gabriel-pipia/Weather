import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Search, Settings } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { ThemedText } from './ui/Text';
import { ThemedView } from './ui/View';

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { layout, colors, isDark } = useTheme();
  const { t } = useLanguage();
  
  const activeRouteName = state.routes[state.index]?.name;
  if (activeRouteName === 'forecast') {
    return null;
  }

  return (
    <ThemedView style={[styles.container, { paddingBottom: insets.bottom + 10 }]} themed={false}>
      <ThemedView 
        blur 
        intensity={80} 
        tint={isDark ? 'dark' : 'light'}
        style={[styles.tabBar, { 
            borderColor: colors.border,
            width: layout.containerWidth,
            maxWidth: layout.containerMaxWidth
          }]}
      >
        {state.routes.map((route, index) => {
          if (route.name === 'forecast') return null;

          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
             const event = navigation.emit({
               type: 'tabPress',
               target: route.key,
               canPreventDefault: true,
             });

             if (!isFocused && !event.defaultPrevented) {
               navigation.navigate({ name: route.name, merge: true } as any);
             }
          };

          const onLongPress = () => {
             navigation.emit({
               type: 'tabLongPress',
               target: route.key,
             });
          };

          const getIcon = () => {
             const color = isFocused ? colors.text : colors.textSecondary;
             if (route.name === 'index') return <Home color={color} size={24} strokeWidth={isFocused ? 2.5 : 2}/>;
             if (route.name === 'search') return <Search color={color} size={24} strokeWidth={isFocused ? 2.5 : 2} />;
             if (route.name === 'settings') return <Settings color={color} size={24} strokeWidth={isFocused ? 2.5 : 2} />;
             return null;
          };

          const getLabel = () => {
             if (route.name === 'index') return t('weather.today');
             if (route.name === 'search') return t('search.title');
             if (route.name === 'settings') return t('settings.title');
             return '';
          };

          return (
             <TouchableOpacity
               key={index}
               accessibilityRole="button"
               accessibilityState={isFocused ? { selected: true } : {}}
               accessibilityLabel={options.tabBarAccessibilityLabel}
               testID={options.tabBarButtonTestID}
               onPress={onPress}
               onLongPress={onLongPress}
               style={styles.tabItem}
               activeOpacity={1}
             >
               <MotiView 
                  style={styles.iconContainer}
                  animate={{
                     backgroundColor: isFocused 
                        ? (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)') 
                        : (isDark ? 'rgba(255,255,255,0)' : 'rgba(0,0,0,0)'),
                  }}
                  transition={{
                     type: 'timing',
                     duration: 300,
                  }}
               >
                 <MotiView
                    animate={{
                       translateY: isFocused ? -8 : 0,
                    }}
                    transition={{
                       type: "timing",
                       duration: 300,
                    }}
                 >
                   {getIcon()}
                 </MotiView>
                 <MotiView
                    style={styles.labelContainer}
                    animate={{
                       opacity: isFocused ? 1 : 0,
                       translateY: isFocused ? 0 : 10,
                       scale: isFocused ? 1 : 0.8,
                    }}
                    transition={{
                       type: "timing",
                       duration: 300,
                    }}
                 >
                    <ThemedText colorType="text" size="xs" type='defaultSemiBold' weight="semibold">
                      {getLabel()}
                    </ThemedText>
                 </MotiView>
               </MotiView>
             </TouchableOpacity>
          );
        })}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    height: 75,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    padding: 10,
    gap: 10,
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    height: "100%",
    width: "100%",
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    position: 'absolute',
    bottom: 2,
  },
});
