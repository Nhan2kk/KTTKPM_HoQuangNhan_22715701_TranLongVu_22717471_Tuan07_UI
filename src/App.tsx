// src/App.tsx
import { useState } from "react";
import "./App.css";
import Header from "./component/Header";
import Footer from "./component/Footer";
import ListMoviePage from "./pages/ListMoviePage";
import BookingListPage from "./pages/BookingListPage";

function App() {
  const [currentPage, setCurrentPage] = useState<"movies" | "bookings">(
    "movies",
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          <button
            onClick={() => setCurrentPage("movies")}
            className={`py-4 px-2 font-medium border-b-2 transition ${
              currentPage === "movies"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Danh sách phim
          </button>
          <button
            onClick={() => setCurrentPage("bookings")}
            className={`py-4 px-2 font-medium border-b-2 transition ${
              currentPage === "bookings"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Lịch sử đặt vé
          </button>
        </div>
      </nav>

      <main className="flex-1">
        {currentPage === "movies" ? <ListMoviePage /> : <BookingListPage />}
      </main>

      <Footer />
    </div>
  );
}

export default App;
