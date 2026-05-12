import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ru from 'date-fns/locale/ru';
import './DateFilter.css';

function DateFilter({ onDateChange, selectedDate, availableDates = [] }) {
    const [showCalendar, setShowCalendar] = useState(false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isDateAvailable = (date) => {
        if (!date) return false;
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return availableDates.some(availableDate => 
            availableDate.getTime() === checkDate.getTime()
        );
    };

    const isTodayAvailable = isDateAvailable(today);
    const isTomorrowAvailable = isDateAvailable(tomorrow);

    const handleToday = () => {
        if (isTodayAvailable) {
            setShowCalendar(false);
            onDateChange(today);
        }
    };

    const handleTomorrow = () => {
        if (isTomorrowAvailable) {
            setShowCalendar(false);
            onDateChange(tomorrow);
        }
    };

    const handleDateSelect = (date) => {
        setShowCalendar(false);
        if (date && isDateAvailable(date)) {
            const newDate = new Date(date);
            newDate.setHours(0, 0, 0, 0);
            onDateChange(newDate);
        }
    };

    // Функция для отображения текста на кнопке "Выбрать день"
    const getPickerButtonText = () => {
        if (!selectedDate) return 'Выбрать день';
        
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        const tomorrowDate = new Date(todayDate);
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        
        // Если выбранная дата - сегодня или завтра, не меняем текст кнопки
        if (selectedDate.getTime() === todayDate.getTime() ||
            selectedDate.getTime() === tomorrowDate.getTime()) {
            return 'Выбрать день';
        }
        
        // Иначе показываем выбранную дату
        return selectedDate.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long'
        });
    };

    const formatDate = (date) => {
        if (!date) return 'Выбрать день';
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        
        if (date.getTime() === todayDate.getTime()) {
            return 'Сегодня';
        }
        
        const tomorrowDate = new Date(todayDate);
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        if (date.getTime() === tomorrowDate.getTime()) {
            return 'Завтра';
        }
        
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long'
        });
    };

    const filterDate = (date) => {
        return isDateAvailable(date);
    };

    const isTodayActive = selectedDate && formatDate(selectedDate) === 'Сегодня';
    const isTomorrowActive = selectedDate && formatDate(selectedDate) === 'Завтра';
    const isCustomDateActive = selectedDate && !isTodayActive && !isTomorrowActive;

    return (
        <div className="date-filter">
            <button 
                className={`date-btn ${isTodayActive ? 'active' : ''} ${!isTodayAvailable ? 'disabled' : ''}`}
                onClick={handleToday}
                disabled={!isTodayAvailable}
                title={!isTodayAvailable ? 'Нет сеансов на сегодня' : ''}
            >
                Сегодня
            </button>
            <button 
                className={`date-btn ${isTomorrowActive ? 'active' : ''} ${!isTomorrowAvailable ? 'disabled' : ''}`}
                onClick={handleTomorrow}
                disabled={!isTomorrowAvailable}
                title={!isTomorrowAvailable ? 'Нет сеансов на завтра' : ''}
            >
                Завтра
            </button>
            <div className="date-picker-wrapper">
                <button 
                    className={`date-btn ${isCustomDateActive ? 'active' : ''}`}
                    onClick={() => setShowCalendar(!showCalendar)}
                >
                    {getPickerButtonText()}
                </button>
                {showCalendar && (
                    <div className="date-picker-popup">
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateSelect}
                            inline
                            minDate={today}
                            filterDate={filterDate}
                            locale={ru}
                            onClickOutside={() => setShowCalendar(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default DateFilter;