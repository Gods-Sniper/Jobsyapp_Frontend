import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { Platform } from "react-native";

import { registerForPushNotificationsAsync } from "@/app/notifications/registerPushToken";
import { API_BASE_URL } from "@/app/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifcation = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );

  const [loggedUserToken, setLoggedUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserToken = async () => {
      const token = await AsyncStorage.getItem("token");
      setLoggedUserToken(token);
    };
    const fetchUser = async () => {
      const userString = await AsyncStorage.getItem("user");
      if (userString) {
        setUser(JSON.parse(userString));
      }
    };
    fetchUser();
    fetchUserToken();
  }, []);

  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  useEffect(() => {
    registerForPushNotificationsAsync().then(async (token) => {
      token && setExpoPushToken(token);
      await fetch(`${API_BASE_URL}/users/${user?._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedUserToken}`,
        },
        body: JSON.stringify({ expoPushToken: token }),
      }).catch((error) => {
        console.error("Error saving token:", error);
      });
    });

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
    }
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [loggedUserToken, user]);

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error: null }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
