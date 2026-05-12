import React, { useState, useRef, useEffect } from 'react';
import './SearchAndFiltersHeader.css';

function SearchAndFiltersHeader({ onSearchChange, onGenreChange, onGenreModeChange, genres, selectedGenres, genreMode, setGenres }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const popupRef = useRef(null);
    const buttonRef = useRef(null);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearchChange(value);
    };

    const handleClear = () => {
        setSearchTerm('');
        onSearchChange('');
    };

    const handleGenreClick = (genre) => {
        let newSelectedGenres;
        if (selectedGenres.includes(genre)) {
            newSelectedGenres = selectedGenres.filter(g => g !== genre);
        } else {
            newSelectedGenres = [...selectedGenres, genre];
        }
        onGenreChange(newSelectedGenres);
    };

    const handleReset = () => {
        onGenreChange([]);
        setShowFilterPopup(false);
    };

    const togglePopup = () => {
        setShowFilterPopup(!showFilterPopup);
    };

    const toggleGenreMode = () => {
        const newMode = genreMode === 'AND' ? 'OR' : 'AND';
        onGenreModeChange(newMode);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setShowFilterPopup(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedCount = selectedGenres?.length || 0;

    return (
        <div className="header-filters">
            <div className="header-search">
                <input
                    type="text"
                    placeholder="Поиск..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="header-search-input"
                />
                {searchTerm && (
                    <button className="header-search-clear" onClick={handleClear}>
                        ✕
                    </button>
                )}
            </div>
            
            <div className="header-filter-wrapper">
                <button 
                    ref={buttonRef}
                    className={`filter-btn ${selectedCount > 0 ? 'active' : ''}`}
                    onClick={togglePopup}
                    title="Фильтр по жанрам"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6H20M6 12H18M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="8" cy="6" r="2" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="16" cy="12" r="2" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="18" r="2" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {selectedCount > 0 && <span className="filter-badge">{selectedCount}</span>}
                </button>
                
                {showFilterPopup && (
                    <div className="filter-popup" ref={popupRef}>
                        <div className="filter-popup-header">
                            <span>Фильтр по жанрам</span>
                            <button className="filter-popup-reset" onClick={handleReset}>
                                Сбросить все
                            </button>
                        </div>
                        
                        {/* Переключатель режима фильтрации */}
                        {selectedCount > 0 && (
                            <div className="filter-mode-toggle">
                                <span className="filter-mode-label">Режим фильтрации:</span>
                                <div className="filter-mode-buttons">
                                    <button
                                        className={`filter-mode-btn ${genreMode === 'AND' ? 'active' : ''}`}
                                        onClick={toggleGenreMode}
                                    >
                                        строгое совпадение
                                    </button>
                                    <button
                                        className={`filter-mode-btn ${genreMode === 'OR' ? 'active' : ''}`}
                                        onClick={toggleGenreMode}
                                    >
                                        хотя бы 1 совпадение
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        <div className="filter-popup-genres">
                            {genres && genres.length > 0 ? (
                                genres.map(genre => (
                                    <button
                                        key={genre}
                                        className={`filter-genre-btn ${selectedGenres.includes(genre) ? 'active' : ''}`}
                                        onClick={() => handleGenreClick(genre)}
                                    >
                                        {genre}
                                    </button>
                                ))
                            ) : (
                                <div className="filter-genre-empty">Нет доступных жанров</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchAndFiltersHeader;