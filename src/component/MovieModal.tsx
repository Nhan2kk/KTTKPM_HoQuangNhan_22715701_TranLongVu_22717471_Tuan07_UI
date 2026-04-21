/*eslint-disable */
import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { type Movie, type MovieRequest } from "../types/movie";

interface MovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie?: Movie | null;
  onSave: (data: MovieRequest) => Promise<void>;
  title: string;
}

export default function MovieModal({
  isOpen,
  onClose,
  movie,
  onSave,
  title,
}: MovieModalProps) {
  const [formData, setFormData] = useState<MovieRequest>({
    title: "",
    description: "",
    duration: null,
    genre: "",
    poster: "",
    price: 0,
    status: "NOW_SHOWING",
    releaseDate: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title,
        description: movie.description || "",
        duration: movie.duration,
        genre: movie.genre,
        poster: movie.poster || "",
        price: movie.price,
        status: movie.status,
        releaseDate: movie.releaseDate.split("T")[0],
      });
    } else {
      setFormData({
        title: "",
        description: "",
        duration: null,
        genre: "",
        poster: "",
        price: 0,
        status: "NOW_SHOWING",
        releaseDate: "",
      });
    }
  }, [movie]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "duration" || name === "price"
          ? value === ""
            ? null
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      alert("Có lỗi xảy ra khi lưu phim!");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gray-50 border-b border-gray-200 px-8 py-5 flex-shrink-0">
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 flex-1 overflow-y-auto scrollbar-hide px-8 py-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên phim *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thể loại *
              </label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời lượng (phút)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá vé (VNĐ) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày phát hành *
              </label>
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none focus:border-transparent"
              >
                <option value="NOW_SHOWING">Đang chiếu</option>
                <option value="COMING_SOON">Sắp chiếu</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link Poster (URL)
              </label>
              <input
                type="url"
                name="poster"
                value={formData.poster}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none focus:border-transparent"
              />
            </div>
          </div>
        </form>

        <div className="bg-gray-50 border-t border-gray-200 px-8 py-4 flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={submitting}
            onClick={(e) => {
              e.preventDefault();
              const form =
                (e.target as HTMLButtonElement).closest("form") ||
                document.querySelector("form");
              if (form) {
                const submitEvent = new Event("submit", { bubbles: true });
                form.dispatchEvent(submitEvent);
              }
            }}
            className="flex-1 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-600 text-white rounded-lg font-medium transition"
          >
            {submitting ? "Đang lưu..." : "Cập nhật"}
          </button>
        </div>
      </div>
    </div>
  );
}
