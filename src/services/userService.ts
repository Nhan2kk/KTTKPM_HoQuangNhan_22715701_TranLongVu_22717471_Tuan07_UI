import axios from "axios";
import {
  type User,
  type LoginRequest,
  type RegisterRequest,
} from "../types/user";

const API_GATEWAY_URL =
  import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:8080";
const API_BASE_URL = `${API_GATEWAY_URL}/api/users`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const userService = {
  // Lấy tất cả users
  getAll: async (): Promise<User[]> => {
    try {
      const res = await axiosInstance.get("");
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi lấy danh sách users:", error);
      throw error;
    }
  },

  // Lấy user theo ID
  getById: async (id: number): Promise<User> => {
    try {
      const res = await axiosInstance.get(`/${id}`);
      return res.data;
    } catch (error) {
      console.error(`❌ Lỗi lấy user ID ${id}:`, error);
      throw error;
    }
  },

  // Đăng ký
  register: async (data: RegisterRequest): Promise<User> => {
    try {
      const res = await axiosInstance.post("/register", data);
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi đăng ký:", error);
      throw error;
    }
  },

  // Đăng nhập
  login: async (data: LoginRequest): Promise<User> => {
    try {
      const res = await axiosInstance.post("/login", data);
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi đăng nhập:", error);
      throw error;
    }
  },

  // Cập nhật user
  update: async (id: number, data: Partial<User>): Promise<User> => {
    try {
      const res = await axiosInstance.put(`/${id}`, data);
      return res.data;
    } catch (error) {
      console.error(`❌ Lỗi cập nhật user ID ${id}:`, error);
      throw error;
    }
  },

  // Xóa user
  delete: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/${id}`);
      console.log(`✅ Xóa user ID ${id} thành công`);
    } catch (error) {
      console.error(`❌ Lỗi xóa user ID ${id}:`, error);
      throw error;
    }
  },
};
