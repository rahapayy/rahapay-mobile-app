import React from "react";
import { SWRConfig } from "swr";
import { AppState } from "react-native";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

// import cacheProvider from "./utils/CacheProvider";
import { axios } from "../utils/api";

const SWR = ({
  children,
  logOut,
}: {
  children: React.ReactNode;
  logOut: () => void;
}) => {
  const [isOnline, setIsOnline] = React.useState<boolean>(false);
  const previousNetworkState = React.useRef<NetInfoState | null>(null);

  const mounted = React.useRef<boolean>(false);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
      previousNetworkState.current = state;
      mounted.current = true;
    });

    return () => {
      unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (mounted.current) {
      if (!isOnline && previousNetworkState.current?.isConnected) {
        // showToast("No internet connection", "", "error");
      }
    }
  }, [isOnline]);

  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        fetcher: fetcher,
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
          if (error.status === 401) {
            logOut();
            return;
          }
          // // only fetch data once
          // if (retryCount === 0) {
          //   revalidate();
          // }
          // Never retry on 404.
          if (error.status === 404) return;
          // Only retry up to 3 times.
          if (retryCount >= 2) return;
          // Retry after 5 seconds.
          setTimeout(() => revalidate({ retryCount }), 5000);
        },
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        isVisible() {
          return AppState.currentState === "active";
        },
        isOnline() {
          return isOnline;
        },
        initFocus(callback) {
          let appState = AppState.currentState;
          const onAppStateChange = (nextAppState: any) => {
            /* If it's resuming from background or inactive mode to active one */
            if (
              appState.match(/inactive|background/) &&
              nextAppState === "active"
            ) {
              callback();
            }
            appState = nextAppState;
          };

          // Subscribe to the app state change events
          const subscription = AppState.addEventListener(
            "change",
            onAppStateChange
          );

          return () => {
            subscription.remove();
          };
        },
        initReconnect(callback) {
          const unsubscribe = NetInfo.addEventListener((state) => {
            if (
              !previousNetworkState.current?.isConnected &&
              state.isConnected &&
              state.isInternetReachable
            ) {
              callback();
            }
            previousNetworkState.current = state;
          });

          return () => {
            unsubscribe();
          };
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWR;

export const fetcher = async (url: string) => {
  try {
    const res = await axios.get(url);
    if (res.status === 200 || res.status === 201) {
      return res.data;
    } else {
      throw new FetcherError({
        message:
          (res?.data as any)?.message ||
          (res?.data as any)?.response ||
          "An error occurred while fetching the data.",
        name: "Error",
        status: res.status || 500,
      });
    }
  } catch (error: any) {
    throw error;
  }
};

type ErrorType = {
  message: string;
  name: string;
  status: number;
};

class FetcherError extends Error {
  status: number;
  constructor({ message, name, status }: ErrorType) {
    super(message);
    this.name = name;
    this.status = status;
  }
}
