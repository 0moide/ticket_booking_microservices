import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // ← добавляем импорт
import HomePage from './pages/HomePage';
import FilmPage from './pages/FilmPage';
import SeatingPage from './pages/SeatingPage';
import DateFilter from './components/DateFilter';
import SearchAndFiltersHeader from './components/SearchAndFiltersHeader';
import AboutPage from './pages/AboutPage';
import RulesPage from './pages/RulesPage';
import ContactsPage from './pages/ContactsPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function AppContent() {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [genres, setGenres] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [genreMode, setGenreMode] = useState('OR');
    
    return (
        <div className="app">
            <Toaster 
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#2D2D2D',
                        color: '#FFFFFF',
                        border: '1px solid #747474',
                        borderRadius: '12px',
                        padding: '12px 20px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#14A76C',
                            secondary: '#FFFFFF',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#E63946',
                            secondary: '#FFFFFF',
                        },
                    },
                }}
            />
            <header className="header">
                <div className="container header-container">
                    <div className="logo-area">
                        <Link to="/" className="logo">🎬 Кинотеатр CINEMA</Link>
                        <div className="tagline">Лучшие фильмы на большом экране</div>
                    </div>
                    
                    {isHomePage && (
                        <div className="filters-area">
                            <DateFilter 
                                onDateChange={setSelectedDate} 
                                selectedDate={selectedDate}
                                availableDates={availableDates}
                            />
                            <SearchAndFiltersHeader 
                                onSearchChange={setSearchTerm}
                                onGenreChange={setSelectedGenres}
                                onGenreModeChange={setGenreMode}
                                genres={genres}
                                selectedGenres={selectedGenres}
                                genreMode={genreMode}
                                setGenres={setGenres}
                            />
                        </div>
                    )}
                </div>
            </header>

            <main className="container">
                <Routes>
                    <Route path="/" element={
                        <HomePage 
                            selectedDate={selectedDate}
                            searchTerm={searchTerm}
                            selectedGenres={selectedGenres}
                            genreMode={genreMode}
                            setGenres={setGenres}
                            setAvailableDates={setAvailableDates}
                        />
                    } />
                    <Route path="/film/:id" element={<FilmPage />} />
                    <Route path="/film/:filmId/session/:sessionId" element={<SeatingPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/rules" element={<RulesPage />} />
                    <Route path="/contacts" element={<ContactsPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
            </main>

            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="copyright">
                            © 2026 Кинотеатр CINEMA. Все права защищены.
                        </div>
                        <div className="footer-links">
                            <Link to="/about">О кинотеатре</Link>
                            <Link to="/rules">Правила</Link>
                            <Link to="/contacts">Контакты</Link>
                            <Link to="/admin">Админ панель</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;