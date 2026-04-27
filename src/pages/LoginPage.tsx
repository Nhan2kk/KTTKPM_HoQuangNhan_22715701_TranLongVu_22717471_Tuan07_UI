import { useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { type LoginRequest } from "../types/user";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await userService.login(formData);

      localStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(new Event("user-login"));

      navigate("/movies");
    } catch (err) {
      setError("Tài khoản hoặc mật khẩu không chính xác");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">MovieHub</h2>
          <p className="text-gray-500 mt-2">Đăng nhập hệ thống đặt vé</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Đăng Nhập
          </h3>

          {error && (
            <div className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Nhập tên đăng nhập"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Nhập mật khẩu"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium rounded-lg transition"
            >
              {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
            </button>
          </form>

          <div className="my-6 h-px bg-gray-200"></div>

          <button
            onClick={() => navigate("/register")}
            className="w-full py-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 font-medium rounded-lg transition"
          >
            Chưa có tài khoản? Đăng Ký
          </button>
        </div>
      </div>
    </div>
  );
}
