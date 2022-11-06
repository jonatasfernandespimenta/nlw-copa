import { NativeBaseProvider, StatusBar } from "native-base";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
} from "@expo-google-fonts/roboto";
import { Loading } from "./src/components/Loading";
import { THEME } from "./src/styles/theme";
import { SignIn } from "./src/screens/SignIn";
import { AuthContextProvider } from "./src/contexts/AuthContext";
import { New } from "./src/screens/New";
import { Pools } from "./src/screens/Pools";

export default function App() {
  const [fontsLoaded] = useFonts([Roboto_400Regular, Roboto_500Medium]);

  return (
    <NativeBaseProvider theme={THEME}>
      <AuthContextProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={"transparent"}
          translucent
        />
        {fontsLoaded ? <Pools /> : <Loading />}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}
