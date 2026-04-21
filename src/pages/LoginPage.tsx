import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { type LoginRequest } from '../types/user';

export default function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginRequest>({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const user = await userService.login(formData);
            // Lưu user vào localStorage
            localStorage.setItem('user', JSON.stringify(user));
            // Dispatch event custom để notify thay đổi
            window.dispatchEvent(new Event('user-login'));
            // Điều hướng đến danh sách phim
            navigate('/movies');
        } catch (err) {
            setError('Tài khoản hoặc mật khẩu không chính xác');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-teal-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-bold text-teal-400 mb-2">
                        🎬
                    </h1>
                    <h2 className="text-3xl font-bold text-white">MovieHub</h2>
                    <p className="text-gray-400 mt-2">
                        Khám phá những bộ phim tuyệt vời
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-8 text-center">
                        Đăng Nhập
                    </h3>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-2xl text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Tên đăng nhập
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                placeholder="Nhập tên đăng nhập"
                                className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Nhập mật khẩu"
                                className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-2xl transition transform hover:scale-105 active:scale-95"
                        >
                            {loading ? '⏳ Đang đăng nhập...' : '🔓 Đăng Nhập'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-8 flex items-center">
                        <div className="flex-1 h-px bg-white/20"></div>
                        <span className="px-4 text-gray-400 text-sm">hoặc</span>
                        <div className="flex-1 h-px bg-white/20"></div>
                    </div>

                    {/* Register Link */}
                    <button
                        onClick={() => navigate('/register')}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold rounded-2xl transition"
                    >
                        📝 Chưa có tài khoản? Đăng Ký
                    </button>
                </div>

                {/* Demo Info */}
                <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-gray-400 text-sm text-center">
                        <span className="text-teal-300 font-semibold">
                            Demo:
                        </span>{' '}
                        john_doe / 123456
                    </p>
                </div>
            </div>
        </div>
    );
}
