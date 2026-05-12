import React from 'react';
import { Link } from 'react-router-dom';

function AboutPage() {
    return (
        <div className="about-page">
            <div className="about-container">
                <h1 className="main-title">О кинотеатре</h1>
                <div className="about-content">
                    <p>Добро пожаловать в кинотеатр CINEMA!</p>
                    <p>Мы — современный кинотеатр с комфортными залами и новейшим оборудованием.</p>
                    <p>Наши залы оснащены:</p>
                    <ul>
                        <li>🎬 Лазерными проекторами 4K</li>
                        <li>🔊 Объёмным звуком Dolby Atmos</li>
                        <li>🛋️ Удобными креслами с подстаканниками</li>
                        <li>🎥 Широкими экранами с 3D поддержкой</li>
                    </ul>
                    <p>Мы находимся по адресу: г. Москва, ул. Кинотеатральная, д. 1</p>
                    <p>Телефон: +7 (495) 123-45-67</p>
                    <p>Часы работы: ежедневно с 10:00 до 23:00</p>
                    <Link to="/" className="btn" style={{ marginTop: '20px' }}>← Вернуться на главную</Link>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;