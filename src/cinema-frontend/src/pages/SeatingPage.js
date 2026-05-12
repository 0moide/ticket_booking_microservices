import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { filmAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

function SeatingPage() {
    const { filmId, sessionId } = useParams();
    const [sessionData, setSessionData] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [booking, setBooking] = useState({
        userName: '',
        userEmail: ''
    });
    const [cancelKey, setCancelKey] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        loadSeatingData();
    }, [sessionId]);

    const loadSeatingData = async () => {
        try {
            setLoading(true);
            const response = await filmAPI.getSeatsByFilmAndSession(filmId, sessionId);
            const data = response.data;
            
            if (data.error) {
                setError(data.error);
                return;
            }
            
            setSessionData({
                filmId: filmId,
                filmTitle: data.filmTitle || sessionData?.filmTitle || 'Фильм',
                hallNumber: data.hallNumber,
                sessionTime: data.sessionTime
            });
            
            // Преобразуем места из объекта в массив для удобной работы
            const seatsArray = [];
            if (data.seats) {
                if (typeof data.seats === 'object' && !Array.isArray(data.seats)) {
                    Object.values(data.seats).forEach(seat => {
                        seatsArray.push({
                            id: seat.id || seat.seatNumber,
                            seatNumber: seat.seatNumber,
                            row: seat.row,
                            number: seat.number,
                            status: seat.status
                        });
                    });
                } else if (Array.isArray(data.seats)) {
                    data.seats.forEach(seat => {
                        seatsArray.push(seat);
                    });
                }
            }
            
            // Сортируем по ряду и номеру
            seatsArray.sort((a, b) => {
                if (a.row !== b.row) return a.row - b.row;
                return a.number - b.number;
            });
            
            setSeats(seatsArray);
            setError(null);
        } catch (err) {
            console.error('Ошибка загрузки схемы зала:', err);
            toast.error('Не удалось загрузить схему зала');
            setError('Не удалось загрузить схему зала');
        } finally {
            setLoading(false);
        }
    };

    const toggleSeat = (seat) => {
        if (seat.status !== 'Available') {
            if (seat.status === 'Reserved') {
                toast('Это место уже забронировано', { icon: '🟡' });
            } else if (seat.status === 'Sold') {
                toast('Это место уже продано', { icon: '🔴' });
            }
            return;
        }
        
        setSelectedSeats(prev => {
            if (prev.some(s => s.seatNumber === seat.seatNumber)) {
                return prev.filter(s => s.seatNumber !== seat.seatNumber);
            } else {
                return [...prev, seat];
            }
        });
    };

    const getSeatClass = (seat) => {
        if (selectedSeats.some(s => s.seatNumber === seat.seatNumber)) {
            return 'seat selected';
        }
        switch(seat.status) {
            case 'Available': return 'seat available';
            case 'Reserved': return 'seat reserved';
            case 'Sold': return 'seat sold';
            default: return 'seat unavailable';
        }
    };

    const getSeatStatusText = (status) => {
        switch(status) {
            case 'Available': return 'Свободно';
            case 'Reserved': return 'Забронировано';
            case 'Sold': return 'Продано';
            default: return 'Недоступно';
        }
    };

    const handleBooking = async () => {
        if (selectedSeats.length === 0) {
            toast.error('Пожалуйста, выберите места');
            return;
        }
        
        if (!booking.userName.trim()) {
            toast.error('Введите ваше имя');
            return;
        }
        
        if (!booking.userEmail.trim()) {
            toast.error('Введите email');
            return;
        }
        
        if (!isValidEmail(booking.userEmail)) {
            toast.error('Введите корректный email адрес');
            return;
        }

        try {
            setLoading(true);
            const seatNumbers = selectedSeats.map(s => s.seatNumber);
            
            const response = await filmAPI.reserveMultipleSeats(
                filmId, 
                sessionId, 
                {
                    userName: booking.userName,
                    userEmail: booking.userEmail,
                    seatNumbers: seatNumbers
                }
            );
            
            if (response.data.success) {
                const key = response.data.key;
                if (key) {
                    toast.success(
                        `✅ Бронирование успешно!\n\nКлюч бронирования: ${key}\n\nСохраните этот ключ для отмены бронирования.`,
                        { duration: 8000 }
                    );
                } else {
                    toast.success('✅ Бронирование успешно оформлено! Проверьте почту для получения ключа.');
                }
                
                setSelectedSeats([]);
                setBooking({ userName: '', userEmail: '' });
                loadSeatingData();
            } else {
                toast.error('❌ Не удалось забронировать места. Возможно, некоторые места уже заняты.');
                loadSeatingData();
            }
        } catch (err) {
            console.error('Ошибка бронирования:', err);
            toast.error('❌ Произошла ошибка при бронировании');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = () => {
        if (!cancelKey.trim()) {
            toast.error('Введите ключ бронирования');
            return;
        }
        setShowConfirmModal(true);
    };

    const handleCancelConfirm = async () => {
        setShowConfirmModal(false);
        
        try {
            setLoading(true);
            
            const response = await filmAPI.cancelBooking(filmId, sessionId, {
                key: cancelKey
            });
            
            if (response.data.success) {
                toast.success('✅ Бронирование успешно отменено');
                setCancelKey('');
                loadSeatingData();
            } else {
                toast.error('❌ Не удалось отменить бронирование. Проверьте правильность ключа.');
            }
        } catch (err) {
            console.error('Ошибка отмены:', err);
            toast.error('❌ Произошла ошибка при отмене бронирования');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelModalClose = () => {
        setShowConfirmModal(false);
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const formatSessionTime = (timeString) => {
        if (!timeString) return '';
        const date = new Date(timeString);
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRowsCount = () => {
        if (!seats.length) return 0;
        const rows = [...new Set(seats.map(s => s.row))];
        return Math.max(...rows);
    };

    const getSeatsPerRow = () => {
        if (!seats.length) return 0;
        const seatsInRow = seats.filter(s => s.row === 1);
        return seatsInRow.length;
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="error" style={{ textAlign: 'center', padding: '50px', color: '#e63946' }}>{error}</div>;
    if (!sessionData) return <div className="error">Нет данных о сеансе</div>;

    const rowsCount = getRowsCount();
    const seatsPerRow = getSeatsPerRow();

    return (
        <div className="seating-page">
            <div className="back-to-home">
                <Link to={`/film/${filmId}`} className="back-home-btn">
                    ← Назад к фильму
                </Link>
                <Link to="/" className="back-home-btn" style={{ marginLeft: '10px' }}>
                    🏠 На главную
                </Link>
            </div>
            {/* Модальное окно подтверждения */}
            {showConfirmModal && (
                <div className="confirm-modal-overlay" onClick={handleCancelModalClose}>
                    <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Подтверждение отмены</h3>
                        <p>Вы уверены, что хотите отменить бронирование? Это действие нельзя отменить.</p>
                        <div className="confirm-modal-buttons">
                            <button className="btn btn-secondary" onClick={handleCancelModalClose}>
                                Отмена
                            </button>
                            <button className="btn btn-cancel" onClick={handleCancelConfirm}>
                                Подтвердить отмену
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="session-info">
                <h2>{sessionData.filmTitle}</h2>
                <div className="hall-info">
                    <span className="hall-badge">🎬 Зал № {sessionData.hallNumber}</span>
                    <span className="hall-badge">⏰ {formatSessionTime(sessionData.sessionTime)}</span>
                    <span className="hall-badge">🪑 Рядов: {rowsCount}, мест в ряду: {seatsPerRow}</span>
                </div>
            </div>

            <div className="screen">🎬 ЭКРАН 🎬</div>

            <div className="seating-chart">
                {Array(rowsCount).fill().map((_, rowIndex) => {
                    const rowNumber = rowIndex + 1;
                    const seatsInRow = seats.filter(s => s.row === rowNumber);
                    
                    return (
                        <div key={rowNumber} className="row">
                            <div className="row-label">Ряд {rowNumber}</div>
                            {Array(seatsPerRow).fill().map((_, seatIndex) => {
                                const seatNumber = seatIndex + 1;
                                const seat = seatsInRow.find(s => s.number === seatNumber);
                                
                                if (!seat) {
                                    return <div key={seatNumber} className="seat unavailable" style={{ visibility: 'hidden' }}></div>;
                                }
                                
                                return (
                                    <button
                                        key={seat.seatNumber}
                                        className={getSeatClass(seat)}
                                        onClick={() => toggleSeat(seat)}
                                        disabled={seat.status !== 'Available'}
                                        title={`${getSeatStatusText(seat.status)}`}
                                    >
                                        {seat.number}
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            <div className="legend">
                <div className="legend-item">
                    <div className="legend-color available"></div>
                    <span>Свободно</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color selected"></div>
                    <span>Выбрано</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color reserved"></div>
                    <span>Забронировано</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color sold"></div>
                    <span>Продано</span>
                </div>
            </div>

            <div className="booking-section">
                <div className="booking-card">
                    <h3 className="card-title">📝 Новое бронирование</h3>
                    
                    {selectedSeats.length > 0 && (
                        <div className="selected-seats-info">
                            <h4>Выбранные места:</h4>
                            <p>
                                {selectedSeats.map(seat => `ряд ${seat.row}, место ${seat.number}`).join(' • ')}
                            </p>
                            <p>Всего мест: {selectedSeats.length}</p>
                        </div>
                    )}
                    
                    <div className="form-group">
                        <label>Ваше имя *</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Введите ваше имя"
                            value={booking.userName}
                            onChange={(e) => setBooking({...booking, userName: e.target.value})}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Email (для получения ключа) *</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="example@mail.com"
                            value={booking.userEmail}
                            onChange={(e) => setBooking({...booking, userEmail: e.target.value})}
                        />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button className="btn" onClick={handleBooking}>
                            ✅ Подтвердить бронирование
                        </button>
                        <button className="btn btn-secondary" onClick={() => setSelectedSeats([])}>
                            ✖ Очистить выбор
                        </button>
                    </div>
                </div>

                <div className="booking-card">
                    <h3 className="card-title">❌ Отмена бронирования</h3>
                    
                    <div className="info-message">
                        <strong>ℹ️ Как отменить бронь:</strong><br />
                        Введите ключ бронирования, который был отправлен на вашу почту
                    </div>
                    
                    <div className="form-group">
                        <label>Ключ бронирования *</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Введите ключ бронирования"
                            value={cancelKey}
                            onChange={(e) => setCancelKey(e.target.value)}
                        />
                    </div>
                    
                    <button className="btn btn-cancel" onClick={handleCancelClick}>
                        ❌ Отменить бронирование
                    </button>
                    
                </div>
            </div>
        </div>
    );
}

export default SeatingPage;