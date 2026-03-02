import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Keyboard, Modal, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { SheetHeader } from './SheetHeader';
import { ThemedView } from './View';

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number | string;
  scrollable?: boolean;
  title?: string;
  subtitle?: string;
  headerContent?: React.ReactNode;
};

export function BottomSheet({ visible, onClose, children, height = 'auto', scrollable = false, title, subtitle, headerContent }: BottomSheetProps) {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const { colors, layout } = useTheme();
  const isLargeScreen = windowWidth >= layout.containerMaxWidth;
  const [isVisible, setIsVisible] = useState(false);
  const translateY = useSharedValue(Dimensions.get('window').height);
  const context = useSharedValue({ y: 0 });
  const scrollOffset = useSharedValue(0);
  const keyboardOffset = useSharedValue(0);

  // Resolve height to absolute pixels
  const isAutoHeight = height === 'auto';
  const resolvedHeight = (() => {
    if (isAutoHeight) return undefined;
    if (typeof height === 'string' && height.endsWith('%')) {
      return windowHeight * (parseFloat(height) / 100);
    }
    return height as number;
  })();

  const prevVisible = useRef(visible);

  const closeSheet = useCallback(() => {
    'worklet';
    translateY.value = withTiming(windowHeight, { duration: 300 }, (finished: boolean | undefined) => {
      if (finished) {
        runOnJS(setIsVisible)(false);
        runOnJS(onClose)();
      }
    });
  }, [onClose, translateY, windowHeight]);

  const openSheet = useCallback(() => {
    'worklet';
    translateY.value = withSpring(0, { damping: 60, stiffness: 200 });
  }, [translateY]);

  useEffect(() => {
    if (visible && !prevVisible.current) {
      setIsVisible(true);
      translateY.value = windowHeight;
      scrollOffset.value = 0;
      requestAnimationFrame(() => {
          openSheet();
      });
    } else if (!visible && prevVisible.current) {
      if (isVisible) {
         closeSheet();
      }
    }
    prevVisible.current = visible;
  }, [visible, isVisible, openSheet, closeSheet, translateY, scrollOffset, windowHeight]);

  useEffect(() => {
      if (visible && !isVisible) {
          setIsVisible(true);
          translateY.value = windowHeight;
          requestAnimationFrame(() => openSheet());
          prevVisible.current = true;
      }
  }, [visible, isVisible, openSheet, translateY, windowHeight]);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      keyboardOffset.value = withTiming(e.endCoordinates.height, { duration: e.duration || 250 });
    });

    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      keyboardOffset.value = withTiming(0, { duration: (e && e.duration) || 250 });
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [keyboardOffset]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  const nativeScrollGesture = Gesture.Native();

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      const canDrag = scrollable
        ? (scrollOffset.value <= 0 && event.translationY > 0) || translateY.value > 0
        : event.translationY > 0 || translateY.value > 0;

      if (canDrag) {
        translateY.value = Math.max(event.translationY + context.value.y, 0);
      }
    })
    .onEnd(() => {
      if (translateY.value > windowHeight / 5) {
        closeSheet();
      } else {
        openSheet();
      }
    });

  if (scrollable) {
    panGesture.simultaneousWithExternalGesture(nativeScrollGesture);
  } else {
    panGesture.activeOffsetY(10);
    panGesture.failOffsetY(-10);
  }

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const rBackdropStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
          translateY.value,
          [0, windowHeight * 0.6], 
          [1, 0],
          Extrapolation.CLAMP
      );
      return {
          opacity: opacity,
      };
  });

  const rKeyboardStyle = useAnimatedStyle(() => {
    return {
      marginBottom: keyboardOffset.value,
    };
  });

  if (!isVisible) return null;

  const sheetSizeStyle = resolvedHeight
    ? { height: resolvedHeight }
    : { maxHeight: windowHeight * 0.9 };

  const contentView = scrollable ? (
    <GestureDetector gesture={nativeScrollGesture}>
      <Animated.ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={[
          styles.contentContainer,
          resolvedHeight ? { flex: 1 } : null,
        ]}
      >
        {children}
      </Animated.ScrollView>
    </GestureDetector>
  ) : (
    <ThemedView 
      style={[
        styles.contentContainer,
        resolvedHeight ? { flex: 1 } : null,
      ]} 
      onStartShouldSetResponder={() => true}
    >
      {children}
    </ThemedView>
  );

  return (
    <Modal transparent visible={isVisible} onRequestClose={() => closeSheet()} animationType="none" statusBarTranslucent>
        <GestureHandlerRootView style={{ flex: 1 }}>
                <ThemedView style={styles.fullScreen} pointerEvents="box-none">
                    <Pressable
                      style={styles.backdrop}
                      onPress={() => closeSheet()}
                    >
                        <Animated.View 
                            style={[
                                styles.backdrop,
                                { backgroundColor: 'rgba(0,0,0,0.6)' },
                                rBackdropStyle
                            ]} 
                        />
                    </Pressable>
                    
                    <Animated.View 
                      style={[
                        styles.sheetWrapper,
                        isLargeScreen ? { top: 0, justifyContent: 'center' } : null,
                        rKeyboardStyle,
                      ]}
                      pointerEvents="box-none"
                    >
                      <GestureDetector gesture={panGesture}>
                          <Animated.View 
                              style={[
                                  styles.bottomSheet,
                                  sheetSizeStyle,
                                  rBottomSheetStyle,
                                  { 
                                      backgroundColor: colors.background,
                                      paddingBottom: isLargeScreen ? 16 : 32,
                                      maxWidth: layout.containerMaxWidth,
                                      width: '100%',
                                      alignSelf: 'center',
                                      shadowOpacity: 0,
                                      elevation: 0,
                                      shadowColor: 'transparent',
                                  },
                                  isLargeScreen ? {
                                      borderRadius: 24,
                                      borderWidth: 1,
                                      borderBottomWidth: 3,
                                      borderColor: colors.border,
                                  } : {
                                      borderTopLeftRadius: 32,
                                      borderTopRightRadius: 32,
                                  },
                                  resolvedHeight ? { flex: 1 } : null,
                              ]}
                          >
                              {/* Header if title is present, else handle */}
                              {title ? (
                                <ThemedView style={{ paddingVertical: 10 }}>
                                  <SheetHeader title={title} subtitle={subtitle} onClose={() => closeSheet()} />
                                </ThemedView>
                              ) : (
                                <ThemedView style={styles.handleContainer}>
                                  <View style={[styles.handle, { backgroundColor: colors.border }]} />
                                </ThemedView>
                              )}

                              {headerContent}

                              {/* Content */}
                              {contentView}
                          </Animated.View>
                      </GestureDetector>
                    </Animated.View>
                </ThemedView>
        </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    sheetWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    bottomSheet: {
        overflow: 'hidden',
    },
    handleContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 12,
        paddingBottom: 8,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 9999,
    },
    contentContainer: {
        width: '100%',
    }
});
