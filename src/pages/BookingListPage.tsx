import { useState, useEffect, useCallback, useRef } from "react";
import type { BookingResponse } from "../types/booking";
import { bookingService } from "../services/bookingService";
import { type User } from "../types/user";
import { pushNotification } from "../utils/notifications";
import BookingModal from "../component/BookingModal";

export default function BookingListPage() {
  const currentUser = (() => {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  })();

  const isAdmin = currentUser?.role === "ADMIN";

  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return "";
    try {
      const user = JSON.parse(userData) as User;
      return user?.id ? String(user.id) : "";
    } catch {
      return "";
    }
  });
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const previousStatuses = useRef<Record<string, string>>({});
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );

  const fetchBookings = useCallback(
    async (forceShowAll?: boolean) => {
      try {
        setLoading(true);
        setError(null);
        let data: BookingResponse[];
        const isShowingAll =
          forceShowAll !== undefined ? forceShowAll : showAllBookings;

        if (isShowingAll && isAdmin) {
          data = await bookingService.getAll();
        } else if (userId) {
          data = await bookingService.getByUserId(Number(userId));
        } else {
          data = [];
        }

        data.forEach((booking) => {
          const oldStatus = previousStatuses.current[booking.id];
          if (!oldStatus) {
            previousStatuses.current[booking.id] = booking.status;
            return;
          }

          if (oldStatus !== booking.status) {
            if (booking.status === "CONFIRMED") {
              pushNotification(
                "Booking xác nhận thành công",
                `Đơn #${booking.id} đã thanh toán thành công.`,
                "success",
              );
            }
            if (booking.status === "FAILED") {
              pushNotification(
                "Booking thanh toán thất bại",
                `Đơn #${booking.id} thanh toán thất bại.`,
                "error",
              );
            }
            previousStatuses.current[booking.id] = booking.status;
          }
        });

        setBookings(data);
        setLastUpdated(new Date());
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Không thể tải danh sách đặt vé";
        console.error("Lỗi tải danh sách đặt vé:", error);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [showAllBookings, userId, isAdmin],
  );

  useEffect(() => {
    if (showAllBookings || userId) {
      queueMicrotask(() => {
        void fetchBookings();
      });
    }
  }, [showAllBookings, userId, fetchBookings]);

  useEffect(() => {
    const hasPending = bookings.some((booking) => booking.status === "PENDING");
    if (!hasPending) return;

    const interval = setInterval(() => {
      void fetchBookings();
    }, 5000);

    return () => clearInterval(interval);
  }, [bookings, fetchBookings]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-emerald-100 text-emerald-800 border border-emerald-300";
      case "PENDING":
        return "bg-amber-100 text-amber-800 border border-amber-300";
      case "FAILED":
        return "bg-red-100 text-red-800 border border-red-300";
      case "CANCELLED":
        return "bg-gray-100 text-gray-700 border border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Đã xác nhận";
      case "PENDING":
        return "Chờ xử lý";
      case "FAILED":
        return "Thất bại";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">
          Lịch sử đặt vé
        </h2>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          {!showAllBookings && (
            <>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Người dùng
                </label>
                <input
                  type="number"
                  value={userId}
                  onChange={(e) => {
                    if (isAdmin) setUserId(e.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  placeholder="ID người dùng"
                  readOnly={!isAdmin}
                />
              </div>
              <button
                onClick={() => fetchBookings()}
                className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition"
              >
                Tìm kiếm
              </button>
            </>
          )}

          <button
            onClick={() => fetchBookings()}
            className="px-6 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 rounded-lg font-medium transition"
          >
            Làm mới
          </button>

          {isAdmin && (
            <button
              onClick={() => setShowAllBookings(!showAllBookings)}
              className={`px-6 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                showAllBookings
                  ? "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  : "bg-gray-900 hover:bg-gray-800 text-white"
              }`}
            >
              {showAllBookings ? "Xem của tôi" : "Xem tất cả"}
            </button>
          )}
        </div>

        {lastUpdated && (
          <p className="text-xs text-gray-500 mt-3">
            Cập nhật lúc: {lastUpdated.toLocaleTimeString("vi-VN")}
          </p>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-500">
          Đang tải dữ liệu...
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">Không tìm thấy đặt vé nào.</p>
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  Mã đơn
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  Người dùng
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  Phim
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  Ghế
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-900">
                  Tổng tiền
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  Ngày đặt
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-mono text-sm text-gray-700">
                    #{booking.id}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{booking.userId}</td>
                  <td className="px-4 py-3 text-gray-700">
                    #{booking.movieId}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {booking.seatNumbers.map((seat) => (
                        <span
                          key={seat}
                          className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs font-medium"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    {booking.totalPrice.toLocaleString("vi-VN")} VND
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(
                        booking.status,
                      )}`}
                    >
                      {getStatusLabel(booking.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(booking.createdAt).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {booking.status === "PENDING" ? (
                      <button
                        onClick={() => {
                          setSelectedBookingId(booking.id);
                          setBookingModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 text-xs"
                      >
                        Tiếp tục thanh toán
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">Tổng số đơn</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {bookings.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Đã xác nhận</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {bookings.filter((b) => b.status === "CONFIRMED").length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Doanh thu đã xác nhận</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {bookings
                  .filter((b) => b.status === "CONFIRMED")
                  .reduce((sum, b) => sum + b.totalPrice, 0)
                  .toLocaleString("vi-VN")}{" "}
                VND
              </p>
            </div>
          </div>
        </div>
      )}

      <BookingModal
        isOpen={bookingModalOpen}
        movie={null}
        initialBookingId={selectedBookingId}
        onClose={() => {
          setBookingModalOpen(false);
          setSelectedBookingId(null);
        }}
        onSuccess={() => {
          void fetchBookings();
        }}
      />
    </div>
  );
}
