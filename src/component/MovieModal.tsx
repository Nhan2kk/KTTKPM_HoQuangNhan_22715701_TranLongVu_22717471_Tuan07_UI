/*eslint-disable */
import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { type Movie, type MovieRequest } from '../types/movie';

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
        title: '',
        description: '',
        duration: null,
        genre: '',
        poster: '',
        price: 0,
        status: 'NOW_SHOWING',
        releaseDate: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (movie) {
            setFormData({
                title: movie.title,
                description: movie.description || '',
                duration: movie.duration,
                genre: movie.genre,
                poster: movie.poster || '',
                price: movie.price,
                status: movie.status,
                releaseDate: movie.releaseDate.split('T')[0],
            });
        } else {
            setFormData({
                title: '',
                description: '',
                duration: null,
                genre: '',
                poster: '',
                price: 0,
                status: 'NOW_SHOWING',
                releaseDate: '',
            });
        }
    }, [movie]);

    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === 'duration' || name === 'price'
                    ? value === ''
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
            alert('Có lỗi xảy ra khi lưu phim!');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden">
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-teal-700 mb-6">
                        {title}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
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
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Thời lượng (phút)
                                </label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration ?? ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                >
                                    <option value="NOW_SHOWING">
                                        Đang chiếu
                                    </option>
                                    <option value="COMING_SOON">
                                        Sắp chiếu
                                    </option>
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 rounded-2xl font-medium transition"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 py-4 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold rounded-2xl transition"
                            >
                                {submitting
                                    ? 'Đang lưu...'
                                    : movie
                                      ? 'Cập nhật'
                                      : 'Tạo mới'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
