import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';

function FilmCard({ film, selectedDate }) {
    const displayGenres = () => {
        if (!film.genre || !Array.isArray(film.genre)) return '';
        if (film.genre.length === 1) return film.genre[0];
        return film.genre.slice(0, 2).join(', ') + (film.genre.length > 2 ? '...' : '');
    };

    const getAgeClass = (minAge) => {
        if (minAge <= 0) return 'age-0';
        if (minAge <= 6) return 'age-6';
        if (minAge <= 12) return 'age-12';
        if (minAge <= 16) return 'age-16';
        return 'age-18';
    };

    // Формируем URL с датой
    const getFilmLink = () => {
        if (selectedDate) {
            const dateParam = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
            return `/film/${film.id}?date=${dateParam}`;
        }
        return `/film/${film.id}`;
    };

    return (
        <div className="film-card">
            <div className="card-header">
                <img 
                    src={getImageUrl(film.posterUrl)} 
                    alt={film.title} 
                    className="film-poster" 
                />
                <div className={`age-badge ${getAgeClass(film.minAge)}`}>
                    {film.minAge}+
                </div>
            </div>
            <div className="film-info">
                <h3 className="film-title">{film.title}</h3>
                <div className="film-meta">
                    <span>{film.duration} мин</span>
                    <span className="film-genre">{displayGenres()}</span>
                </div>
                <p className="film-description">{film.description}</p>
                <Link to={getFilmLink()} className="btn">
                    Выбрать сеанс
                </Link>
            </div>
        </div>
    );
}

export default FilmCard;