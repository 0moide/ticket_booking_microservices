import React, { useState } from 'react';
import axios from 'axios';

function AdminPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const resetFilmDB = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/film/reset');
            setMessage('✅ Film Service database reset successfully');
        } catch (error) {
            setMessage('❌ Error resetting Film Service: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const resetBookingDB = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/booking/reset');
            setMessage('✅ Booking Service database reset successfully');
        } catch (error) {
            setMessage('❌ Error resetting Booking Service: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const resetAll = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/film/reset');
            await axios.post('http://localhost:8080/api/booking/reset');
            setMessage('✅ Both databases reset successfully');
        } catch (error) {
            setMessage('❌ Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-container">
                <h1 className="main-title">Админ панель</h1>
                <div className="admin-buttons">
                    <button 
                        className="btn" 
                        onClick={resetFilmDB}
                        disabled={loading}
                    >
                        🔄 Сбросить Film Service
                    </button>
                    <button 
                        className="btn" 
                        onClick={resetBookingDB}
                        disabled={loading}
                    >
                        🔄 Сбросить Booking Service
                    </button>
                    <button 
                        className="btn btn-cancel" 
                        onClick={resetAll}
                        disabled={loading}
                    >
                        🔄 Сбросить всё
                    </button>
                </div>
                {message && <div className="admin-message">{message}</div>}
            </div>
        </div>
    );
}

export default AdminPage;