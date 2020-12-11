import React, { useState } from "react";
import { AuthProvider } from "./AuthProvider";
import { Routes } from "./Routes";
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import { Provider } from 'react-redux';
import { store } from './redux';
import { OpenSans_300Light, OpenSans_300Light_Italic, OpenSans_400Regular, OpenSans_400Regular_Italic, OpenSans_600SemiBold, OpenSans_600SemiBold_Italic, OpenSans_700Bold, OpenSans_700Bold_Italic, OpenSans_800ExtraBold, OpenSans_800ExtraBold_Italic} from '@expo-google-fonts/open-sans';

const fetchFont = () => {
  return Font.loadAsync({
    'Motidash': require('../assets/fonts/Motidash.ttf'),
    'OpenSans-Bold': require('../assets/fonts/OpenSans-Bold.ttf'),
    'OpenSans-BoldItalic': require('../assets/fonts/OpenSans-BoldItalic.ttf'),
    'OpenSans-ExtraBold': require('../assets/fonts/OpenSans-ExtraBold.ttf'),
    'OpenSans-ExtraBoldItalic': require('../assets/fonts/OpenSans-ExtraBoldItalic.ttf'),
    'OpenSans-Italic': require('../assets/fonts/OpenSans-Italic.ttf'),
    'OpenSans-Light': require('../assets/fonts/OpenSans-Light.ttf'),
    'OpenSans-LightItalic': require('../assets/fonts/OpenSans-LightItalic.ttf'),
    'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
    'OpenSans-SemiBold': require('../assets/fonts/OpenSans-SemiBold.ttf'),
    'OpenSans-SemiBoldItalic': require('../assets/fonts/OpenSans-SemiBoldItalic.ttf'),
    OpenSans_300Light,
    OpenSans_300Light_Italic,
    OpenSans_400Regular,
    OpenSans_400Regular_Italic,
    OpenSans_600SemiBold,
    OpenSans_600SemiBold_Italic,
    OpenSans_700Bold,
    OpenSans_700Bold_Italic,
    OpenSans_800ExtraBold,
    OpenSans_800ExtraBold_Italic
  });
};

interface ProvidersProps {
  
}

export const Providers: React.FC<ProvidersProps> = ({}) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  if(!fontLoaded) {
      return (
      <AppLoading
        startAsync={fetchFont} 
        onError={()=> console.log("error")} 
        onFinish={() => {
        setFontLoaded(true)
      }}/>
    );
  }
    return (
      <Provider store={store}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
      </Provider>
    );
}