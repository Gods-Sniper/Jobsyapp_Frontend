import { Redirect, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";

const OnboardingLayout = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [shouldRedirect, setShouldRedirect] = React.useState(false);

  React.useEffect(() => {
    const checkOnboarding = async () => {
      const hasOnboarded = await SecureStore.getItemAsync("hasOnboarded");
      if (hasOnboarded === "true") {
        setShouldRedirect(true);
      }
      setIsLoading(false);
    };
    checkOnboarding();
  }, []);

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (shouldRedirect) {
    return <Redirect href="/welcomepage" />;
  }
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onbaording2" options={{ headerShown: false }} />
    </Stack>
  );
};

export default OnboardingLayout;
