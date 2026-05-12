import axios from 'axios';

const API_BASE_URL = '/api';
const STATIC_BASE_URL = '';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const filmAPI = {
    getAllFilmsWithSessions: () => api.get('/films/with-sessions'),
    getSeatsByFilmAndSession: (filmId, sessionId) => 
        api.get(`/films/${filmId}/sessions/${sessionId}/seats`),
    reserveMultipleSeats: (filmId, sessionId, bookingData) => 
        api.post(`/films/${filmId}/sessions/${sessionId}/seats/reserve-multiple`, bookingData),
    cancelBooking: (filmId, sessionId, cancelData) => 
        api.post(`/films/${filmId}/sessions/${sessionId}/seats/unreserve-multiple`, cancelData),
};

export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${STATIC_BASE_URL}/${cleanPath}`;
};

export default api;
