/*
    Notifications:

    This was created out of frustration with loading notifications into testing environments.
*/

/** checks if push notifications are supported */
function isPushNotificationSupported() {
  return "serviceWorker" in navigator && "PushManager" in window;
}

/** Checks if the user hasn't decided on push notifications */
function checkUserPermission() {
  return Notification.permission === "default";
}

/** asks for user permission to show push notifications if the user hasn't decided yet*/
export async function askUserPermission() {
  if (isPushNotificationSupported() && checkUserPermission()) {
    return await Notification.requestPermission();
  } else return null;
}

/** Shows incomming message to user though push notifications
 *
 *  closeTime = interval to show the notification to user (default is set to 1 second).
 *  image = an image to show to the user.
 */
export function pushUserMessage(
  username: string,
  msg: string,
  closeTime: number = 2,
  image?: string
) {
  const title = username + " wrote you a message!";
  const settings = {
    icon: image,
    body: msg
  };

  if (isPushNotificationSupported() && Notification.permission === "granted") {
    const Message = new Notification(title, settings);
    setTimeout(() => {
      Message.close();
    }, closeTime * 1000);
  }
}
