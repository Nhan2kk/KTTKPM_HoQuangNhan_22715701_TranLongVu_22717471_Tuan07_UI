import { useEffect, useState } from "react";
import type { Movie } from "../types/movie";
import type { BookingRequest, BookingResponse } from "../types/booking";
import { bookingService } from "../services/bookingService";
import { type User } from "../types/user";
import { pushNotification } from "../utils/notifications";

interface BookingModalProps {
  isOpen: boolean;
  movie: Movie | null;
  initialBookingId?: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

const SEAT_ROWS = 8;
const SEATS_PER_ROW = 12;

type BookingStep = "select" | "payment";

export default function BookingModal({
  isOpen,
  movie,
  initialBookingId,
  onClose,
  onSuccess,
}: BookingModalProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<BookingStep>("select");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData) as User;
        if (user?.id) {
          setUserId(String(user.id));
          setUsername(user.username);
        }
      } catch {
        setUserId("");
        setUsername("");
      }
    }

    if (initialBookingId) {
      setStep("payment");
      setBookingId(initialBookingId);
      setSelectedSeats([]);
      void fetchBooking(initialBookingId);
    } else {
      setStep("select");
      setBookingId(null);
      setBooking(null);
      setPaymentError("");
    }
  }, [isOpen, initialBookingId]);

  const fetchBooking = async (id: string) => {
    try {
      const latest = await bookingService.getById(id);
      setBooking(latest);
      return latest;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  if (!isOpen) return null;

  const allSeats = Array.from({ length: SEAT_ROWS }, (_, row) =>
    Array.from({ length: SEATS_PER_ROW }, (_, seat) => {
      const rowLetter = String.fromCharCode(65 + row);
      const seatNumber = seat + 1;
      return `${rowLetter}${seatNumber}`;
    }),
  );

  const toggleSeat = (seat: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat],
    );
  };

  const calculateTotal = () => {
    if (!movie) return 0;
    return selectedSeats.length * movie.price;
  };

  const handleCreateBooking = async () => {
    if (!movie) return;
    if (!selectedSeats.length) {
      alert("Vui lòng chọn ít nhất một ghế.");
      return;
    }
    if (!userId || isNaN(Number(userId))) {
      alert("Không tìm thấy người dùng đăng nhập. Vui lòng đăng nhập lại.");
      return;
    }

    setLoading(true);
    try {
      const bookingData: BookingRequest = {
        userId: Number(userId),
        movieId: Number(movie.id),
        seatNumbers: [...selectedSeats].sort(),
        totalPrice: calculateTotal(),
      };

      const created = await bookingService.create(bookingData);
      pushNotification(
        "Booking đã tạo",
        `Đơn #${created.id} đã được tạo. Tiếp tục để thanh toán.`,
        "info",
      );

      setBookingId(created.id);
      setBooking(created);
      setStep("payment");
      setPaymentError("");
      onSuccess();
    } catch (error) {
      console.error(error);
      alert(`Đặt vé thất bại: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!bookingId) return;

    setLoading(true);
    setPaymentError("");
    try {
      const resetBooking = await bookingService.retryPayment(bookingId);
      const activeBookingId = resetBooking.id;
      if (activeBookingId !== bookingId) {
        setBookingId(activeBookingId);
      }
      setBooking(resetBooking);

      for (let i = 0; i < 12; i += 1) {
        const latest = await bookingService.getById(activeBookingId);
        setBooking(latest);

        if (latest.status === "CONFIRMED") {
          pushNotification(
            "Thanh toán thành công",
            `Đơn #${latest.id} đã được thanh toán thành công.`,
            "success",
          );
          onSuccess();
          closeAndReset();
          return;
        }

        if (latest.status === "FAILED") {
          pushNotification(
            "Thanh toán thất bại",
            `Đơn #${latest.id} thanh toán thất bại. Bạn có thể thử lại.`,
            "error",
          );
          onSuccess();
          setPaymentError(
            "Thanh toán thất bại. Bạn có thể bấm Tiếp tục thanh toán để thử lại.",
          );
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      setPaymentError(
        "Thanh toán đang xử lý. Vui lòng bấm làm mới trạng thái.",
      );
    } catch (error) {
      console.error(error);
      setPaymentError("Không thể xử lý thanh toán lúc này.");
    } finally {
      setLoading(false);
    }
  };

  const closeAndReset = () => {
    setStep("select");
    setSelectedSeats([]);
    setBookingId(null);
    setBooking(null);
    setPaymentError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 scrollbar-hide">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-lg flex flex-col">
        <div className="bg-gray-50 border-b border-gray-200 px-8 py-5 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
              {step === "select" ? movie?.title || "Đặt vé" : "Thanh toán"}
            </h2>
            <p className="text-sm text-gray-600">
              {step === "select"
                ? `${movie?.price?.toLocaleString("vi-VN") || 0} VND/vé`
                : `Đơn #${booking?.id ?? bookingId ?? "-"}`}
            </p>
          </div>
          <button
            onClick={closeAndReset}
            className="text-gray-400 hover:text-gray-600 text-2xl transition"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-8 py-6 space-y-6">
          {step === "select" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Người dùng
                  </label>
                  <input
                    type="text"
                    value={username}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    User ID
                  </label>
                  <input
                    type="text"
                    value={userId}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    readOnly
                  />
                </div>
              </div>

              <div className="flex justify-center py-2">
                <div className="bg-gray-200 px-10 py-2 rounded-full">
                  <p className="text-center text-gray-600 font-medium text-xs tracking-wide">
                    MÀN HÌNH
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <div className="flex justify-center overflow-x-auto scrollbar-hide">
                  <div className="space-y-2 py-2">
                    {allSeats.map((row, rowIndex) => (
                      <div
                        key={rowIndex}
                        className="flex justify-center items-center gap-2"
                      >
                        <div className="w-8 flex items-center justify-center font-semibold text-gray-600 text-sm">
                          {String.fromCharCode(65 + rowIndex)}
                        </div>
                        <div className="flex gap-1">
                          {row.map((seat) => (
                            <button
                              key={seat}
                              onClick={() => toggleSeat(seat)}
                              className={`w-8 h-8 rounded text-xs font-medium transition-all ${
                                selectedSeats.includes(seat)
                                  ? "bg-gray-900 text-white"
                                  : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              {seat.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedSeats.length > 0 && (
                <div className="bg-gray-100 border border-gray-200 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2 text-sm">
                    Ghế đã chọn ({selectedSeats.length}):
                  </p>
                  <p className="text-gray-700 text-sm font-medium">
                    {[...selectedSeats].sort().join(", ")}
                  </p>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Tổng tiền:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {calculateTotal().toLocaleString("vi-VN")} VND
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Mã đơn</p>
                  <p className="font-medium text-gray-900">
                    #{booking?.id ?? bookingId}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Trạng thái</p>
                  <p className="font-medium text-gray-900">
                    {booking?.status ?? "PENDING"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Số ghế</p>
                  <p className="font-medium text-gray-900">
                    {booking?.seatNumbers?.join(", ") ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Tổng tiền</p>
                  <p className="font-medium text-gray-900">
                    {(booking?.totalPrice ?? 0).toLocaleString("vi-VN")} VND
                  </p>
                </div>
              </div>

              {paymentError && (
                <p className="text-sm text-red-700">{paymentError}</p>
              )}
            </>
          )}
        </div>

        <div className="bg-gray-50 border-t border-gray-200 px-8 py-4 flex gap-3">
          <button
            onClick={closeAndReset}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition disabled:opacity-50"
          >
            Đóng
          </button>

          {step === "select" ? (
            <button
              onClick={handleCreateBooking}
              disabled={loading || selectedSeats.length === 0}
              className="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang tạo booking..." : "Tiếp tục"}
            </button>
          ) : (
            <button
              onClick={handleProcessPayment}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xử lý thanh toán..." : "Tiếp tục thanh toán"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
