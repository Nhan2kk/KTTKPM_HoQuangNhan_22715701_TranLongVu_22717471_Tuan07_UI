// src/App.tsx
import './App.css';
import Header from './component/Header';
import Footer from './component/Footer';
import ListMoviePage from './pages/ListMoviePage';

function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                <ListMoviePage />
            </main>

            <Footer />
        </div>
    );
}

export default App;
