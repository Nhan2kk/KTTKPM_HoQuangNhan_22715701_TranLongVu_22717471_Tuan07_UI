export interface Booking {
  id: string;
  userId: number;
  movieId: number;
  seatNumbers: string[];
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "FAILED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface BookingRequest {
  userId: number;
  movieId: number;
  seatNumbers: string[];
  totalPrice: number;
}

export interface BookingResponse {
  id: string;
  userId: number;
  movieId: number;
  seatNumbers: string[];
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "FAILED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}
