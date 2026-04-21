// src/components/Header.tsx
export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 py-5 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Movie Booking
            </h1>
            <p className="text-gray-600 text-xs">Event-Driven Microservices</p>
          </div>
        </div>

        <div className="hidden md:block text-gray-500 text-xs">
          Spring Boot + RabbitMQ + React
        </div>
      </div>
    </header>
  );
}
