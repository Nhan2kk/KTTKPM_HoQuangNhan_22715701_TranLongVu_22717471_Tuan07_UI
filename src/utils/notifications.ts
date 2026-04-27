export type NotificationType = "info" | "success" | "error";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  read: boolean;
}

const STORAGE_KEY = "app_notifications";
const UPDATE_EVENT = "app-notification-updated";

export const getNotifications = (): AppNotification[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as AppNotification[];
  } catch {
    return [];
  }
};

export const saveNotifications = (items: AppNotification[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 50)));
  window.dispatchEvent(new Event(UPDATE_EVENT));
};

export const pushNotification = (
  title: string,
  message: string,
  type: NotificationType = "info",
) => {
  const newItem: AppNotification = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    message,
    type,
    createdAt: new Date().toISOString(),
    read: false,
  };

  const current = getNotifications();
  saveNotifications([newItem, ...current]);
};

export const markAllNotificationsRead = () => {
  const current = getNotifications();
  saveNotifications(current.map((item) => ({ ...item, read: true })));
};

export const clearNotifications = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(UPDATE_EVENT));
};

export const notificationUpdateEvent = UPDATE_EVENT;
