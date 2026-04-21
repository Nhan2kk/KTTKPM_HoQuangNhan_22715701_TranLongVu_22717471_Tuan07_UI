import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { type User } from '../types/user';

export default function Header() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch {
                localStorage.removeItem('user');
            }
        }
        return null;
    });
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const handleUserLogin = () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                try {
                    setUser(JSON.parse(userData));
                } catch {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        window.addEventListener('user-login', handleUserLogin);
        window.addEventListener('storage', handleUserLogin);
        return () => {
            window.removeEventListener('user-login', handleUserLogin);
            window.removeEventListener('storage', handleUserLogin);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-lg border-b-4 border-teal-600">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => navigate('/movies')}
                >
                    <div className="text-4xl">🎬</div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                            MovieHub
                        </h1>
                        <p className="text-teal-600 text-xs font-semibold">
                            Khám phá những bộ phim tuyệt vời
                        </p>
                    </div>
                </div>

                {user ? (
                    <div className="flex items-center gap-6">
                        {/* User Info */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">
                                    {user.fullName}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user.username}
                                </p>
                            </div>
                        </div>

                        {/* Menu Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                                ⋮
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl z-50">
                                    <div className="p-3 border-b border-gray-200">
                                        <p className="text-sm font-semibold text-gray-700">
                                            {user.email}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {user.phone}
                                        </p>
                                        <span
                                            className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-teal-100 text-teal-700'}`}
                                        >
                                            {user.role === 'ADMIN'
                                                ? '👨‍💼 Admin'
                                                : '👤 User'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-semibold transition border-t"
                                    >
                                        🚪 Đăng Xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-2 bg-white text-teal-600 border-2 border-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition"
                        >
                            🔓 Đăng Nhập
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
                        >
                            📝 Đăng Ký
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
