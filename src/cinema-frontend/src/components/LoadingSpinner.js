import React from 'react';

function LoadingSpinner() {
    return (
        <div className="loading-overlay" style={{ display: 'flex' }}>
            <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Загрузка...</p>
            </div>
        </div>
    );
}

export default LoadingSpinner;