import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { type RegisterRequest } from '../types/user';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterRequest>({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phone: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
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
        setError('');

        // Validation
        if (formData.password !== confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }

        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);

        try {
            await userService.register(formData);
            alert('✅ Đăng ký thành công! Vui lòng đăng nhập');
            navigate('/login');
        } catch (err) {
            setError('Đăng ký thất bại. Vui lòng kiểm tra thông tin');
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
                    <p className="text-gray-400 mt-2">Tạo tài khoản mới</p>
                </div>

                {/* Form */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-8 text-center">
                        Đăng Ký
                    </h3>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-2xl text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Tên đăng nhập
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                placeholder="john_doe"
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="john@example.com"
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                placeholder="John Doe"
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="0901234567"
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Ít nhất 6 ký tự"
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Xác nhận mật khẩu
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                                placeholder="Nhập lại mật khẩu"
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-2xl transition transform hover:scale-105 active:scale-95 mt-6"
                        >
                            {loading ? '⏳ Đang tạo...' : '✨ Tạo Tài Khoản'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center">
                        <div className="flex-1 h-px bg-white/20"></div>
                        <span className="px-4 text-gray-400 text-sm">hoặc</span>
                        <div className="flex-1 h-px bg-white/20"></div>
                    </div>

                    {/* Login Link */}
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold rounded-2xl transition"
                    >
                        🔓 Đã có tài khoản? Đăng Nhập
                    </button>
                </div>
            </div>
        </div>
    );
}
