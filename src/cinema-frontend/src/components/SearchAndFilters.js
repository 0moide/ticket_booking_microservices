import React, { useState, useEffect } from 'react';
import './SearchAndFilters.css';

function SearchAndFilters({ onSearchChange, onGenreChange, genres, selectedGenre }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearchChange(value);
    };

    const handleGenreClick = (genre) => {
        if (selectedGenre === genre) {
            onGenreChange(''); // Снимаем фильтр если нажали на тот же жанр
        } else {
            onGenreChange(genre);
        }
    };

    return (
        <div className="search-filters">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="🔍 Поиск фильмов..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                />
                {searchTerm && (
                    <button 
                        className="search-clear"
                        onClick={() => {
                            setSearchTerm('');
                            onSearchChange('');
                        }}
                    >
                        ✕
                    </button>
                )}
            </div>
            
            {genres.length > 0 && (
                <div className="genres-filter">
                    <span className="genres-label">Жанры:</span>
                    <div className="genres-list">
                        <button
                            className={`genre-btn ${selectedGenre === '' ? 'active' : ''}`}
                            onClick={() => onGenreChange('')}
                        >
                            Все
                        </button>
                        {genres.map(genre => (
                            <button
                                key={genre}
                                className={`genre-btn ${selectedGenre === genre ? 'active' : ''}`}
                                onClick={() => handleGenreClick(genre)}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchAndFilters;