import { useState, useEffect } from "react";
import type { BookingResponse } from "../types/booking";
import { bookingService } from "../services/bookingService";

export default function BookingListPage() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("1");
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async (forceShowAll?: boolean) => {
    try {
      setLoading(true);
      setError(null);
      let data;
      const isShowingAll = forceShowAll !== undefined ? forceShowAll : showAllBookings;
      
      if (isShowingAll) {
        data = await bookingService.getAll();
      } else if (userId) {
        data = await bookingService.getByUserId(Number(userId));
      } else {
        data = [];
      }
      setBookings(data);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Không thể tải danh sách đặt vé";
      console.error("Lỗi tải danh sách đặt vé:", error);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [showAllBookings]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-gray-100 text-gray-700 border border-gray-300";
      case "PENDING":
        return "bg-gray-50 text-gray-600 border border-gray-300";
      case "FAILED":
        return "bg-gray-100 text-gray-700 border border-gray-300";
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
      {/* Header */}
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
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  placeholder="Nhập ID người dùng"
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
            onClick={() => setShowAllBookings(!showAllBookings)}
            className={`px-6 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              showAllBookings
                ? "bg-gray-200 hover:bg-gray-300 text-gray-900"
                : "bg-gray-900 hover:bg-gray-800 text-white"
            }`}
          >
            {showAllBookings ? "Xem của tôi" : "Xem tất cả"}
          </button>
        </div>
      </div>

      {/* Content */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">⚠️ {error}</p>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
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
              <p className="text-sm text-gray-600">Tổng doanh thu</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {bookings
                  .reduce((sum, b) => sum + b.totalPrice, 0)
                  .toLocaleString("vi-VN")}{" "}
                VND
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
