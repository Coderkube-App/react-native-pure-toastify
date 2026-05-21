# react-native-pure-toastify 🚀

A highly customizable, 60FPS fluid swipe-to-dismiss toast notification system for React Native and Expo. 

Inspired by `react-toastify`, it is built with **zero external dependencies** and is **100% compatible** with Expo Go and React Native Bare workflows out-of-the-box.

---

## Features ✨

- **Imperative Global API** - Call `toast.success()`, `toast.error()`, etc., from anywhere (inside or outside of components).
- **60FPS Native Animations** - Uses native-driven spring and timing transitions.
- **Swipe-to-Dismiss Gestures** - Built-in native horizontal swiping using `PanResponder`.
- **Shrinking Progress Timer** - Visual progress bar displaying the time remaining before auto-close.
- **Haptic Vibration Integrations** - Triggers clean physical vibration feedback on supported iOS & Android devices.
- **Light & Dark Theme Matching** - Tailored high-fidelity palettes for Success, Warning, Error, Info, and Default states.
- **Zero Native Dependencies** - Guaranteed Expo Go and Bare compatible.

---

## Installation 📦

```bash
npm install react-native-pure-toastify
```
or
```bash
yarn add react-native-pure-toastify
```

---

## Usage 🛠️

### 1. Setup the Root Provider

Wrap your application root with the `ToastProvider`:

```tsx
import React from 'react';
import { ToastProvider } from 'react-native-pure-toastify';
import MainScreen from './src/MainScreen';

export default function App() {
  return (
    <ToastProvider position="top" duration={3000}>
      <MainScreen />
    </ToastProvider>
  );
}
```

### 2. Trigger Toasts from Anywhere

Use the global `toast` object to dispatch success, error, warning, or informational alerts:

```tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { toast } from 'react-native-pure-toastify';

export default function MainScreen() {
  const triggerSuccess = () => {
    toast.success("Payment Received!", {
      description: "A copy of your receipt has been sent to your inbox.",
      haptic: "success",
    });
  };

  const triggerError = () => {
    toast.error("Declined", {
      description: "Please check your credentials and try again.",
      haptic: "error",
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={triggerSuccess}>
        <Text style={styles.text}>Trigger Success</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.errorBtn]} onPress={triggerError}>
        <Text style={styles.text}>Trigger Error</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorBtn: {
    backgroundColor: '#EF4444',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
```

---

## API Reference 📖

### ToastProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'top' \| 'bottom'` | `'top'` | Anchors notifications to the top or bottom of the screen. |
| `duration` | `number` | `3000` | Default time (in milliseconds) before the toast auto-closes. |

### Toast Options

All `toast` methods take an optional `ToastOptions` configuration object:

```tsx
toast.success("Message", options);
```

| Property | Type | Description |
|----------|------|-------------|
| `description` | `string` | Secondary descriptive text below the main message. |
| `duration` | `number` | Overrides the default duration for this specific alert. |
| `autoClose` | `boolean` | If set to `false`, the alert remains open until clicked or swiped. |
| `haptic` | `'success' \| 'warning' \| 'error' \| 'selection'` | Triggers a safe physical vibration pattern. |
| `onPress` | `() => void` | Callback triggered when the toast card is tapped. |
| `onClose` | `() => void` | Callback triggered when the toast card is dismissed/auto-closed. |

---

## License 📄

MIT
