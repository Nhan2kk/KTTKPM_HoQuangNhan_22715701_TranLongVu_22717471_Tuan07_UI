/*eslint-disable */
import { useState, useEffect } from "react";
import { type Movie, type MovieRequest } from "../types/movie";
import { movieService } from "../services/movieService";

import MovieModal from "../component/MovieModal";
import BookingModal from "../component/BookingModal";

export default function ListMoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedMovieForBooking, setSelectedMovieForBooking] =
    useState<Movie | null>(null);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const data = await movieService.getAll();
      setMovies(data);
      setFilteredMovies(data);
    } catch (error) {
      console.error("Lỗi tải danh sách phim:", error);
      alert("Không thể kết nối đến server. Vui lòng kiểm tra backend!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Tìm kiếm realtime
  useEffect(() => {
    const filtered = movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredMovies(filtered);
  }, [searchTerm, movies]);

  const openCreateModal = () => {
    setEditingMovie(null);
    setModalOpen(true);
  };

  const openEditModal = (movie: Movie) => {
    setEditingMovie(movie);
    setModalOpen(true);
  };

  const handleSave = async (data: MovieRequest) => {
    try {
      if (editingMovie) {
        await movieService.update(editingMovie.id, data);
        alert("Cập nhật phim thành công!");
      } else {
        await movieService.create(data);
        alert(
          "Tạo phim thành công! Event CREATED đã được gửi qua RabbitMQ.",
        );
      }
      fetchMovies();
    } catch (error) {
      alert("Thao tác thất bại!");
      console.error(error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa phim "${title}" không?`)) return;

    try {
      await movieService.delete(id);
      alert("Xóa phim thành công! Event DELETED đã được gửi.");
      fetchMovies();
    } catch (error) {
      alert("Xóa phim thất bại");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Tiêu đề + Search + Button */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <h2 className="text-3xl font-semibold text-gray-900">Danh sách phim</h2>

        <div className="flex w-full md:w-auto gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm tên phim hoặc thể loại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          />
          <button
            onClick={openCreateModal}
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition whitespace-nowrap"
          >
            + Thêm phim
          </button>
        </div>
      </div>

      {/* Nội dung danh sách */}
      {loading ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          Đang tải danh sách phim...
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Không tìm thấy phim nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300"
            >
              {movie.poster && (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-60 object-cover"
                />
              )}

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900">
                  {movie.title}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
                  {movie.description || "Không có mô tả"}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                    {movie.genre}
                  </span>
                  {movie.duration && (
                    <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                      {movie.duration} phút
                    </span>
                  )}
                  <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                    {movie.price.toLocaleString("vi-VN")} ₫
                  </span>
                </div>

                <div className="text-xs text-gray-500 mb-4 flex justify-between">
                  <span className="text-gray-600 font-medium">
                    {movie.status === "NOW_SHOWING"
                      ? "Đang chiếu"
                      : "Sắp chiếu"}
                  </span>
                  <span>
                    {new Date(movie.releaseDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() =>
                      alert(
                        `Chi tiết phim:\n\nTên: ${movie.title}\nThể loại: ${movie.genre}\nMô tả: ${movie.description}`,
                      )
                    }
                    className="py-2.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition font-medium"
                  >
                    Chi tiết
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMovieForBooking(movie);
                      setBookingModalOpen(true);
                    }}
                    className="py-2.5 text-sm bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition font-medium"
                  >
                    Đặt vé
                  </button>
                  <button
                    onClick={() => openEditModal(movie)}
                    className="py-2.5 text-sm bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition font-medium"
                  >
                    Sửa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <MovieModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        movie={editingMovie}
        onSave={handleSave}
        title={editingMovie ? "Sửa thông tin phim" : "Thêm phim mới"}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        movie={selectedMovieForBooking}
        onClose={() => {
          setBookingModalOpen(false);
          setSelectedMovieForBooking(null);
        }}
        onSuccess={fetchMovies}
      />
    </div>
  );
}
