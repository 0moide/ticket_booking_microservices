import React from 'react';
import { Link } from 'react-router-dom';

function ContactsPage() {
    return (
        <div className="contacts-page">
            <div className="contacts-container">
                <h1 className="main-title">Контакты</h1>
                <div className="contacts-content">
                    <div className="contacts-info">
                        <h3>📍 Адрес:</h3>
                        <p>г. Москва, ул. Кинотеатральная, д. 1</p>
                        
                        <h3>📞 Телефон:</h3>
                        <p>+7 (495) 123-45-67</p>
                        
                        <h3>📧 Email:</h3>
                        <p>info@cinema.ru</p>
                        
                        <h3>🕐 Режим работы:</h3>
                        <p>Ежедневно: 10:00 — 23:00</p>
                        <p>Касса: 10:00 — 22:30</p>
                        
                        <h3>🌐 Мы в соцсетях:</h3>
                        <div className="social-links">
                            <a href="#" target="_blank" rel="noopener noreferrer">📘 ВКонтакте</a>
                            <a href="#" target="_blank" rel="noopener noreferrer">📸 Telegram</a>
                            <a href="#" target="_blank" rel="noopener noreferrer">🎥 YouTube</a>
                        </div>
                    </div>
                    <Link to="/" className="btn" style={{ marginTop: '20px' }}>← Вернуться на главную</Link>
                </div>
            </div>
        </div>
    );
}

export default ContactsPage;