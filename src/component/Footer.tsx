// src/components/Footer.tsx
export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 py-10 mt-auto">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-sm">
                    © 2026 Movie Service - Đồ án Kiến trúc Phần mềm Hướng Dịch
                    vụ
                </p>
                <p className="text-xs mt-2 text-gray-500">
                    Backend: Spring Boot + RabbitMQ (Event Driven) • Frontend:
                    React + TypeScript
                </p>
            </div>
        </footer>
    );
}
