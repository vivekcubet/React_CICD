import React from 'react';
import Navigation from './src/navigation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import {store, persistor} from './src/redux/store';
import {ErrorBoundary, Loader} from './src/components';
import {ToastProvider} from 'react-native-toast-notifications';
import {PersistGate} from 'redux-persist/integration/react';
if (!__DEV__) {
  console.log = () => {};
}
const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastProvider swipeEnabled>
            <Loader />
            <GestureHandlerRootView style={styles.container}>
              <Navigation />
            </GestureHandlerRootView>
          </ToastProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
