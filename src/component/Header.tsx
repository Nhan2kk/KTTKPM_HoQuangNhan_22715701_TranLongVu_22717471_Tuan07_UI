import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { type User } from "../types/user";
import {
  clearNotifications,
  getNotifications,
  markAllNotificationsRead,
  notificationUpdateEvent,
  type AppNotification,
} from "../utils/notifications";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        localStorage.removeItem("user");
      }
    }
    return null;
  });
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    getNotifications(),
  );
  const [toastNotification, setToastNotification] =
    useState<AppNotification | null>(null);
  const latestShownIdRef = useRef<string | null>(
    (() => {
      const existing = getNotifications();
      return existing.length > 0 ? existing[0].id : null;
    })(),
  );

  const unreadCount = notifications.filter((item) => !item.read).length;

  useEffect(() => {
    const handleUserLogin = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    const handleNotificationUpdate = () => {
      const items = getNotifications();
      setNotifications(items);

      if (items.length > 0 && items[0].id !== latestShownIdRef.current) {
        setToastNotification(items[0]);
        latestShownIdRef.current = items[0].id;
      }
    };

    window.addEventListener("user-login", handleUserLogin);
    window.addEventListener("storage", handleUserLogin);
    window.addEventListener(notificationUpdateEvent, handleNotificationUpdate);
    return () => {
      window.removeEventListener("user-login", handleUserLogin);
      window.removeEventListener("storage", handleUserLogin);
      window.removeEventListener(
        notificationUpdateEvent,
        handleNotificationUpdate,
      );
    };
  }, []);

  useEffect(() => {
    if (!toastNotification) return;

    const timeoutId = window.setTimeout(() => {
      setToastNotification(null);
    }, 3500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toastNotification]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("user-login"));
    navigate("/login");
  };

  const getInitials = (fullName: string) => {
    const words = fullName.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "U";
    if (words.length === 1) return words[0].slice(0, 1).toUpperCase();
    return `${words[0].slice(0, 1)}${words[words.length - 1].slice(0, 1)}`.toUpperCase();
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => navigate("/movies")}
          >
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                MovieHub
              </h1>
              <p className="text-gray-500 text-xs">Movie Ticket System</p>
            </div>
          </div>

          {user ? (
            <div className="flex items-center gap-6">
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (!showNotifications && unreadCount > 0) {
                      markAllNotificationsRead();
                    }
                  }}
                  className="relative px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 hover:bg-gray-50 transition"
                  aria-label="Thông báo"
                >
                  Thông báo
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center font-semibold">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <p className="font-semibold text-gray-800">Thông báo</p>
                      <button
                        onClick={() => {
                          clearNotifications();
                          setShowNotifications(false);
                        }}
                        className="text-xs text-gray-500 hover:text-gray-900"
                      >
                        Xóa tất cả
                      </button>
                    </div>

                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-sm text-gray-500 px-4 py-6 text-center">
                          Chưa có thông báo nào.
                        </p>
                      ) : (
                        notifications.map((item) => (
                          <div
                            key={item.id}
                            className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                          >
                            <p className="text-sm font-semibold text-gray-800">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {item.message}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-2">
                              {new Date(item.createdAt).toLocaleString("vi-VN")}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-semibold">
                  {getInitials(user.fullName)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user.fullName}</p>
                  <p className="text-xs text-gray-500">{user.username}</p>
                </div>
              </div>

              {/* Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  ⋮
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl z-50">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-700">
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{user.phone}</p>
                      <span className="inline-block mt-2 px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                        {user.role === "ADMIN" ? " Admin" : " User"}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-gray-900 hover:bg-gray-50 font-medium transition border-t"
                    >
                      Đăng Xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Đăng Nhập
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
              >
                Đăng Ký
              </button>
            </div>
          )}
        </div>
      </header>

      {toastNotification && (
        <div className="fixed top-4 right-4 z-[999] w-[320px]">
          <div
            className={`rounded-lg border shadow-lg p-4 bg-white ${
              toastNotification.type === "success"
                ? "border-emerald-300"
                : toastNotification.type === "error"
                  ? "border-red-300"
                  : "border-gray-300"
            }`}
          >
            <p className="text-sm font-semibold text-gray-900">
              {toastNotification.title}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {toastNotification.message}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
