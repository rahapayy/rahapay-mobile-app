import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

const BACKGROUND_FETCH_TASK = "background-sync";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  // Perform background sync tasks here
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export const registerBackgroundFetchAsync = () => {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 15,
    stopOnTerminate: false,
    startOnBoot: true,
  });
};
