import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  Vibration,
  Platform,
} from 'react-native';
import { ToastData } from './toast';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.4;

interface ToastItemProps {
  toast: ToastData;
  position: 'top' | 'bottom';
  defaultDuration: number;
  onDismiss: () => void;
}

export const ToastItem = ({
  toast,
  position,
  defaultDuration,
  onDismiss,
}: ToastItemProps) => {
  const {
    message,
    description,
    type,
    duration = defaultDuration,
    autoClose = true,
    haptic,
    onPress,
  } = toast;

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current; // Entry/Exit slide & fade
  const pan = useRef(new Animated.ValueXY()).current; // Horizontal swipe gesture
  const progressAnim = useRef(new Animated.Value(1)).current; // Progress bar scale

  const autoCloseTimerRef = useRef<any>(null);

  // Trigger haptic feedback safely
  const triggerHaptic = () => {
    if (!haptic) return;
    try {
      if (Platform.OS === 'ios') {
        // Simple patterns for iOS core Vibration
        if (haptic === 'success') Vibration.vibrate([0, 10]);
        else if (haptic === 'warning') Vibration.vibrate([0, 20]);
        else if (haptic === 'error') Vibration.vibrate([0, 30, 80, 30]);
        else Vibration.vibrate(10);
      } else {
        // Android patterns
        if (haptic === 'success') Vibration.vibrate(20);
        else if (haptic === 'warning') Vibration.vibrate([0, 20, 100, 20]);
        else if (haptic === 'error') Vibration.vibrate([0, 40, 100, 40]);
        else Vibration.vibrate(20);
      }
    } catch (e) {
      console.warn('Haptic vibration failed:', e);
    }
  };

  useEffect(() => {
    triggerHaptic();

    // Entry Transition (Slide + Scale + Fade)
    Animated.spring(slideAnim, {
      toValue: 1,
      tension: 40,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Start autoClose progress indicator and timer
    if (autoClose) {
      // Progress Bar Animation
      Animated.timing(progressAnim, {
        toValue: 0,
        duration: duration,
        useNativeDriver: false, // ScaleX progress requires layout transition
      }).start();

      autoCloseTimerRef.current = setTimeout(() => {
        handleExit();
      }, duration);
    }

    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, []);

  const handleExit = () => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }

    // Exit Transition (Slide-out + Fade-out)
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  // PanResponder to capture swipe-to-dismiss gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Only allow horizontal swiping
        pan.setValue({ x: gestureState.dx, y: 0 });
      },
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
          // Swipe Away with speed and friction
          const exitDirection = gestureState.dx > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH;
          Animated.timing(pan, {
            toValue: { x: exitDirection, y: 0 },
            duration: 150,
            useNativeDriver: true,
          }).start(() => {
            onDismiss();
          });
        } else {
          // Snap back to origin
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Dynamic status styling
  const getStatusStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: '#ECFDF5',
          border: '#A7F3D0',
          indicator: '#10B981',
          text: '#065F46',
          descText: '#047857',
        };
      case 'error':
        return {
          bg: '#FEF2F2',
          border: '#FCA5A5',
          indicator: '#EF4444',
          text: '#991B1B',
          descText: '#B91C1C',
        };
      case 'warning':
        return {
          bg: '#FFFBEB',
          border: '#FDE68A',
          indicator: '#F59E0B',
          text: '#92400E',
          descText: '#B45309',
        };
      case 'info':
        return {
          bg: '#EFF6FF',
          border: '#BFDBFE',
          indicator: '#3B82F6',
          text: '#1E40AF',
          descText: '#1D4ED8',
        };
      default:
        return {
          bg: '#FFFFFF',
          border: '#E2E8F0',
          indicator: '#64748B',
          text: '#1E293B',
          descText: '#475569',
        };
    }
  };

  const status = getStatusStyles();

  // Combine slide anim and gesture translation
  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [position === 'top' ? -100 : 100, 0],
  });

  const scale = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const opacity = slideAnim.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 1, 1],
  });

  const AnimatedView: any = Animated.View;
  const TouchableOpacityComponent: any = TouchableOpacity;
  const ViewComponent: any = View;
  const TextComponent: any = Text;

  return (
    <AnimatedView
      style={[
        styles.wrapper,
        {
          opacity,
          transform: [
            { translateY },
            { translateX: pan.x },
            { scale },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacityComponent
        activeOpacity={onPress ? 0.85 : 1}
        onPress={() => {
          if (onPress) onPress();
          handleExit();
        }}
        style={[
          styles.toastCard,
          {
            backgroundColor: status.bg,
            borderColor: status.border,
          },
        ]}
      >
        {/* Left Side Accent Color Strip */}
        <ViewComponent style={[styles.accentStrip, { backgroundColor: status.indicator }]} />

        <ViewComponent style={styles.contentContainer}>
          <TextComponent style={[styles.message, { color: status.text }]}>{message}</TextComponent>
          {description && (
            <TextComponent style={[styles.description, { color: status.descText }]}>
              {description}
            </TextComponent>
          )}
        </ViewComponent>

        {/* Progress Bar (if autoClose is enabled) */}
        {autoClose && (
          <AnimatedView
            style={[
              styles.progressBar,
              {
                backgroundColor: status.indicator,
                transform: [
                  {
                    scaleX: progressAnim,
                  },
                ],
              },
            ]}
          />
        )}
      </TouchableOpacityComponent>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  toastCard: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  accentStrip: {
    width: 4,
    height: '200%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 8,
  },
  message: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  description: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 3,
    lineHeight: 18,
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    width: '100%',
  },
});
