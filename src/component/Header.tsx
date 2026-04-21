// src/components/Header.tsx
export default function Header() {
    return (
        <header className="bg-teal-700 text-white py-6 shadow-md">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="text-4xl">🎬</div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Movie Service
                        </h1>
                        <p className="text-teal-100 text-sm">
                            Event-Driven Microservices
                        </p>
                    </div>
                </div>

                <div className="hidden md:block text-teal-100 text-sm">
                    Spring Boot + RabbitMQ + React
                </div>
            </div>
        </header>
    );
}
