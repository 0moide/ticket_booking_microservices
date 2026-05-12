import React, { useState, useEffect } from 'react';
import { filmAPI } from '../services/api';
import FilmCard from '../components/FilmCard';
import LoadingSpinner from '../components/LoadingSpinner';

function HomePage({ selectedDate, searchTerm, selectedGenres, genreMode, setGenres, setAvailableDates }) {
    const [allFilms, setAllFilms] = useState([]);
    const [filteredFilms, setFilteredFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadFilms();
    }, []);

    useEffect(() => {
        filterFilms();
    }, [allFilms, selectedDate, searchTerm, selectedGenres, genreMode]);

    const loadFilms = async () => {
        try {
            setLoading(true);
            const response = await filmAPI.getAllFilmsWithSessions();
            
            const filmsWithDates = response.data.map(film => ({
                ...film,
                sessions: film.sessions.map(session => ({
                    ...session,
                    dateObj: new Date(session.time)
                }))
            }));
            setAllFilms(filmsWithDates);
            
            // Собираем уникальные жанры
            const uniqueGenres = new Set();
            filmsWithDates.forEach(film => {
                if (film.genre && Array.isArray(film.genre)) {
                    film.genre.forEach(genre => {
                        if (genre && genre.trim()) {
                            uniqueGenres.add(genre);
                        }
                    });
                }
            });
            setGenres(Array.from(uniqueGenres).sort());
            
            // Собираем уникальные даты
            const datesSet = new Set();
            filmsWithDates.forEach(film => {
                film.sessions.forEach(session => {
                    const sessionDate = new Date(session.time);
                    sessionDate.setHours(0, 0, 0, 0);
                    datesSet.add(sessionDate.getTime());
                });
            });
            const datesArray = Array.from(datesSet).map(timestamp => new Date(timestamp));
            datesArray.sort((a, b) => a - b);
            setAvailableDates(datesArray);
            
            setError(null);
        } catch (err) {
            console.error('Ошибка загрузки фильмов:', err);
            setError('Не удалось загрузить список фильмов');
        } finally {
            setLoading(false);
        }
    };

    const filterFilms = () => {
        let result = [...allFilms];
        
        // Фильтр по дате
        if (selectedDate) {
            result = result.filter(film => {
                return film.sessions.some(session => {
                    const sessionDate = new Date(session.time);
                    sessionDate.setHours(0, 0, 0, 0);
                    return sessionDate.getTime() === selectedDate.getTime();
                });
            });
        }
        
        // Фильтр по жанрам (поддерживает режимы AND и OR)
        if (selectedGenres && selectedGenres.length > 0) {
            result = result.filter(film => {
                if (film.genre && Array.isArray(film.genre)) {
                    if (genreMode === 'AND') {
                        // Режим "И" — фильм должен содержать ВСЕ выбранные жанры
                        return selectedGenres.every(selectedGenre => 
                            film.genre.includes(selectedGenre)
                        );
                    } else {
                        // Режим "ИЛИ" — фильм должен содержать ХОТЯ БЫ ОДИН выбранный жанр
                        return selectedGenres.some(selectedGenre => 
                            film.genre.includes(selectedGenre)
                        );
                    }
                }
                return false;
            });
        }
        
        // Поиск по названию
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            result = result.filter(film => 
                film.title.toLowerCase().includes(term)
            );
        }
        
        setFilteredFilms(result);
    };

    if (loading) return <LoadingSpinner />;
    
    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', color: '#e63946' }}>
                <h2>❌ {error}</h2>
                <button onClick={loadFilms} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>
                    Попробовать снова
                </button>
            </div>
        );
    }

    return (
        <div className="home-page">
            <h1 className="main-title">Сейчас в кино</h1>
            
            {filteredFilms.length > 0 ? (
                <>
                    {/* <div className="films-count">
                        Найдено фильмов: {filteredFilms.length}
                    </div> */}
                    <div className="films-grid">
                        {filteredFilms.map(film => (
                            <FilmCard key={film.id} film={film} selectedDate={selectedDate} />
                        ))}
                    </div>
                </>
            ) : (
                <div className="coming-soon" style={{ margin: '40px auto', maxWidth: '400px' }}>
                    <h3>🎬 Ничего не найдено</h3>
                    <p>Попробуйте изменить параметры поиска или выбрать другую дату</p>
                </div>
            )}
        </div>
    );
}

export default HomePage;