import type { BookingRequest, BookingResponse } from "../types/booking";

const API_GATEWAY_URL =
  import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:8080";
const API_URL = `${API_GATEWAY_URL}/api/bookings`;

export const bookingService = {
  async create(booking: BookingRequest): Promise<BookingResponse> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    });

    if (!response.ok) {
      throw new Error(`Lỗi đặt vé: ${response.statusText}`);
    }
    return response.json();
  },

  async getAll(): Promise<BookingResponse[]> {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Lỗi tải danh sách đặt vé: ${response.statusText}`);
    }
    return response.json();
  },

  async getById(id: string): Promise<BookingResponse> {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Lỗi tải chi tiết đặt vé: ${response.statusText}`);
    }
    return response.json();
  },

  async getByUserId(userId: number): Promise<BookingResponse[]> {
    const response = await fetch(`${API_URL}/by-user/${userId}`);
    if (!response.ok) {
      throw new Error(
        `Lỗi tải danh sách đặt vé của người dùng: ${response.statusText}`,
      );
    }
    return response.json();
  },

  async updateStatus(
    id: string,
    status: "PENDING" | "CONFIRMED" | "FAILED" | "CANCELLED",
  ): Promise<BookingResponse> {
    const response = await fetch(`${API_URL}/${id}/status?status=${status}`, {
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error(`Lỗi cập nhật trạng thái: ${response.statusText}`);
    }
    return response.json();
  },

  async retryPayment(id: string): Promise<BookingResponse> {
    const response = await fetch(`${API_URL}/${id}/retry-payment`, {
      method: "POST",
    });

    if (response.status === 404) {
      const current = await this.getById(id);
      return this.create({
        userId: current.userId,
        movieId: current.movieId,
        seatNumbers: current.seatNumbers,
        totalPrice: current.totalPrice,
      });
    }

    if (!response.ok) {
      throw new Error(`Lỗi retry thanh toán: ${response.statusText}`);
    }
    return response.json();
  },
};
