import { useState } from "react";
import type { Movie } from "../types/movie";
import type { BookingRequest } from "../types/booking";
import { bookingService } from "../services/bookingService";

interface BookingModalProps {
  isOpen: boolean;
  movie: Movie | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Seat layout: 8 rows x 12 seats
const SEAT_ROWS = 8;
const SEATS_PER_ROW = 12;

export default function BookingModal({
  isOpen,
  movie,
  onClose,
  onSuccess,
}: BookingModalProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [userId, setUserId] = useState("1");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !movie) return null;

  // Generate seat layout
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
    return selectedSeats.length * movie.price;
  };

  const handleBooking = async () => {
    if (!selectedSeats.length) {
      alert("❌ Vui lòng chọn ít nhất một ghế!");
      return;
    }

    if (!userId || isNaN(Number(userId))) {
      alert("❌ Vui lòng nhập ID người dùng hợp lệ!");
      return;
    }

    setLoading(true);
    try {
      const bookingData: BookingRequest = {
        userId: Number(userId),
        movieId: Number(movie.id),
        seatNumbers: selectedSeats.sort(),
        totalPrice: calculateTotal(),
      };

      const result = await bookingService.create(bookingData);
      alert(`✅ Đặt vé thành công! Mã đơn: ${result.id}`);
      setSelectedSeats([]);
      setUserId("1");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert(`❌ Đặt vé thất bại: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 scrollbar-hide">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-lg flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-8 py-5 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
              {movie.title}
            </h2>
            <p className="text-sm text-gray-600">
              {movie.price.toLocaleString("vi-VN")} VND/vé
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl transition"
          >
            ×
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-8 py-6 space-y-6">
          {/* User ID Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              ID Người dùng
            </label>
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              placeholder="VD: 1, 2, 3..."
            />
          </div>

          {/* Screen */}
          <div className="flex justify-center py-2">
            <div className="bg-gray-200 px-10 py-2 rounded-full">
              <p className="text-center text-gray-600 font-medium text-xs tracking-wide">
                MÀN HÌNH
              </p>
            </div>
          </div>

          {/* Seat Selection */}
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
                          {seat.slice(-1)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-8 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white border border-gray-300 rounded"></div>
              <span className="text-gray-600">Trống</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-900 rounded"></div>
              <span className="text-gray-600">Chọn</span>
            </div>
          </div>

          {/* Selected Seats Info */}
          {selectedSeats.length > 0 && (
            <div className="bg-gray-100 border border-gray-200 p-4 rounded-lg">
              <p className="font-medium text-gray-900 mb-2 text-sm">
                Ghế đã chọn ({selectedSeats.length}):
              </p>
              <p className="text-gray-700 text-sm font-medium">
                {selectedSeats.sort().join(", ")}
              </p>
            </div>
          )}

          {/* Total Price */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Tổng tiền:</span>
              <span className="text-2xl font-bold text-gray-900">
                {calculateTotal().toLocaleString("vi-VN")} VND
              </span>
            </div>
          </div>
        </div>

        {/* Footer - Buttons */}
        <div className="bg-gray-50 border-t border-gray-200 px-8 py-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleBooking}
            disabled={loading || selectedSeats.length === 0}
            className="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xử lý..." : "Đặt vé"}
          </button>
        </div>
      </div>
    </div>
  );
}
