import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { removeItem } from "./storage";

const BACKGROUND_FETCH_TASK = "background-logout";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  await Promise.all([
    removeItem("userInfo"),
    removeItem("access_token"),
    removeItem("userDetails"),
  ]);
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export const registerBackgroundFetchAsync = () => {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 15,
    stopOnTerminate: false,
    startOnBoot: true,
  });
};