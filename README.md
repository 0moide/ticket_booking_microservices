# 🎬 Кинотеатр CINEMA — Микросервисная система бронирования билетов

<div align="center">

![Java](https://img.shields.io/badge/Java-17-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green)
![React](https://img.shields.io/badge/React-18-blue)
![Docker](https://img.shields.io/badge/Docker-✓-2496ED)
![Kafka](https://img.shields.io/badge/Kafka-✓-231F20)

</div>

## 📋 О проекте

**Кинотеатр CINEMA** — это полноценная платформа для бронирования билетов в кинотеатр, построенная на микросервисной архитектуре.


---

## 🛠 Технологический стек

### Backend
| Технология | Назначение |
|------------|------------|
| **Java 17** | Основной язык программирования |
| **Spring Boot 3.2** | Фреймворк для микросервисов |
| **Spring Cloud Gateway** | API Gateway, маршрутизация |
| **Spring Cloud Netflix Eureka** | Service Discovery |
| **Spring Data JPA + Hibernate** | Работа с базой данных |
| **Spring Kafka** | Асинхронные события |
| **PostgreSQL** | Реляционная база данных |
| **Maven** | Сборка проекта |

### Frontend
| Технология | Назначение |
|------------|------------|
| **React 18** | Библиотека для UI |
| **React Router DOM** | Навигация между страницами |
| **Axios** | HTTP запросы к API |
| **React DatePicker** | Календарь для выбора даты |
| **React Hot Toast** | Всплывающие уведомления |

### DevOps
| Технология | Назначение |
|------------|------------|
| **Docker** | Контейнеризация сервисов |
| **Docker Compose** | Оркестрация контейнеров |
| **Apache Kafka** | Асинхронная коммуникация |
| **Nginx** | Веб-сервер для фронтенда |

---

## ⚙️ Микросервисы

| Сервис | Порт | Описание |
|--------|------|----------|
| **Discovery Service** | 8761 | Регистрация и обнаружение сервисов (Eureka) |
| **Film Service** | 8081 | Управление фильмами, сеансами, постерами |
| **Booking Service** | 8082 | Бронирование мест, управление ключами |
| **Notification Service** | 8083 | Email уведомления (Kafka Consumer) |
| **Gateway** | 8080 | Единая точка входа для фронтенда |
| **Frontend** | 80/3000 | React приложение |

---

### Требования
- Docker & Docker Compose
- JDK 17 (для локальной разработки)
- Node.js 18+ (для фронтенда)
