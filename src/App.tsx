import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './component/Header';
import Footer from './component/Footer';
import ListMoviePage from './pages/ListMoviePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { type User } from './types/user';

function App() {
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

    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Header />

                <main className="flex-1 bg-gray-50">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Protected Routes */}
                        {user ? (
                            <>
                                <Route
                                    path="/movies"
                                    element={<ListMoviePage />}
                                />
                                <Route
                                    path="/"
                                    element={<Navigate to="/movies" replace />}
                                />
                            </>
                        ) : (
                            <Route
                                path="*"
                                element={<Navigate to="/login" replace />}
                            />
                        )}
                    </Routes>
                </main>

                {user && <Footer />}
            </div>
        </Router>
    );
}

export default App;
