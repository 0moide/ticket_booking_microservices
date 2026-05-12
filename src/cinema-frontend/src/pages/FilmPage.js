import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { filmAPI, getImageUrl } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import DateFilter from '../components/DateFilter';

function FilmPage() {
    const { id } = useParams();
    const location = useLocation();
    const [film, setFilm] = useState(null);
    const [allSessions, setAllSessions] = useState([]);
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableDates, setAvailableDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAgeClass = (minAge) => {
        if (minAge <= 0) return 'age-0';
        if (minAge <= 6) return 'age-6';
        if (minAge <= 12) return 'age-12';
        if (minAge <= 16) return 'age-16';
        return 'age-18';
    };

    useEffect(() => {
        loadFilm();
    }, [id]);

    useEffect(() => {
        filterSessionsByDate();
    }, [allSessions, selectedDate]);

    const loadFilm = async () => {
        try {
            setLoading(true);
            const response = await filmAPI.getAllFilmsWithSessions();
            const foundFilm = response.data.find(f => f.id === parseInt(id));
            
            if (foundFilm) {
                setFilm(foundFilm);
                const sessionsWithDates = foundFilm.sessions.map(session => ({
                    ...session,
                    dateObj: new Date(session.time)
                }));
                setAllSessions(sessionsWithDates);
                
                // Собираем уникальные даты
                const datesSet = new Set();
                sessionsWithDates.forEach(session => {
                    const sessionDate = new Date(session.time);
                    sessionDate.setHours(0, 0, 0, 0);
                    datesSet.add(sessionDate.getTime());
                });
                const datesArray = Array.from(datesSet).map(timestamp => new Date(timestamp));
                datesArray.sort((a, b) => a - b);
                setAvailableDates(datesArray);
                
                // Проверяем, есть ли дата в URL
                const urlParams = new URLSearchParams(location.search);
                const dateParam = urlParams.get('date');
                
                if (dateParam) {
                    const dateFromUrl = new Date(dateParam);
                    dateFromUrl.setHours(0, 0, 0, 0);
                    // Проверяем, доступна ли эта дата
                    if (datesArray.some(d => d.getTime() === dateFromUrl.getTime())) {
                        setSelectedDate(dateFromUrl);
                    } else if (datesArray.length > 0) {
                        setSelectedDate(datesArray[0]);
                    }
                } else if (datesArray.length > 0) {
                    setSelectedDate(datesArray[0]);
                }
                
                setError(null);
            } else {
                setError('Фильм не найден');
            }
        } catch (err) {
            console.error('Ошибка загрузки фильма:', err);
            setError('Не удалось загрузить информацию о фильме');
        } finally {
            setLoading(false);
        }
    };

    const filterSessionsByDate = () => {
        if (!selectedDate) {
            setFilteredSessions(allSessions);
            return;
        }
        
        const filtered = allSessions.filter(session => {
            const sessionDate = new Date(session.time);
            sessionDate.setHours(0, 0, 0, 0);
            return sessionDate.getTime() === selectedDate.getTime();
        });
        
        filtered.sort((a, b) => new Date(a.time) - new Date(b.time));
        setFilteredSessions(filtered);
    };

    const formatSessionTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="error" style={{ textAlign: 'center', padding: '50px', color: '#e63946' }}>{error}</div>;
    if (!film) return <div className="error">Фильм не найден</div>;

    return (
        <div className="film-page">
            <div className="back-to-home">
                <Link to="/" className="back-home-btn">
                    ← Вернуться на главную
                </Link>
            </div>
            
            <div className="film-details">
                <div className="film-poster-container">
                    <img 
                        src={getImageUrl(film.posterUrl)} 
                        alt={film.title} 
                        className="film-poster-large" 
                    />
                </div>
                <div className="film-info-container">
                    <h1 className="film-title">{film.title}</h1>
                    <div className="film-meta">
                        {film.genre && Array.isArray(film.genre) && film.genre.map((genre, index) => (
                            <span key={index} className="meta-item">{genre}</span>
                        ))}
                        <span className="meta-item">{film.duration} мин</span>
                        <span className={`meta-item age ${getAgeClass(film.minAge)}`}>{film.minAge}+</span>
                    </div>
                    <p className="film-description">{film.description}</p>
                    
                    {allSessions.length > 0 ? (
                        <div className="sessions-section">
                            <h3>Доступные сеансы</h3>
                            
                            <DateFilter 
                                onDateChange={setSelectedDate} 
                                selectedDate={selectedDate}
                                availableDates={availableDates}
                            />
                            
                            {filteredSessions.length > 0 ? (
                                <div className="sessions-grid">
                                    {filteredSessions.map((session) => (
                                        <div key={session.id} className="session-card">
                                            <div className="session-time">
                                                {formatSessionTime(session.time)}
                                            </div>
                                            <div className="session-info">
                                                <div>Зал № {session.hallNumber}</div>
                                                <div>Свободно мест: {session.availableSeats}</div>
                                            </div>
                                            <Link 
                                                to={`/film/${film.id}/session/${session.id}`}
                                                className="btn"
                                            >
                                                Выбрать места
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="coming-soon">
                                    <h3>📅 Нет сеансов на выбранную дату</h3>
                                    <p>Пожалуйста, выберите другую дату</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="coming-soon">
                            <h3>🎬 Скоро в прокате</h3>
                            <p>Следите за расписанием сеансов</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FilmPage;