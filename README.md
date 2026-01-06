# 🎉 Etkinlik & Katılım Yönetim Sistemi

React (Frontend) ve NestJS (Backend) kullanılarak geliştirilen, rol bazlı yetkilendirmeye sahip bir **Etkinlik & Katılım Yönetim Sistemi**.

## 📋 Gereksinimler

- Node.js (v18 veya üzeri)
- npm veya yarn
- Docker ve Docker Compose (PostgreSQL için)

## 🚀 Kurulum

### 1. PostgreSQL'i Docker ile Başlatma

Proje kök dizininde:

```bash
docker compose up -d
```

Bu komut PostgreSQL container'ını başlatır ve `event_manager` veritabanını otomatik oluşturur.

Container'ı durdurmak için:
```bash
docker compose down
```

Container durumunu kontrol etmek için:
```bash
docker compose ps
```

### 2. Backend Kurulumu

```bash
cd backend
npm install
```

### 3. Backend Ortam Değişkenleri

`backend/.env.example` dosyasını `.env` olarak kopyalayın ve değerlerinizi güncelleyin:

```bash
cd backend
cp .env.example .env
```

`.env` dosyası Docker Compose ile hazırlanmış varsayılan değerlerle çalışır. Gerekirse düzenleyebilirsiniz:

- `DB_HOST=localhost`
- `DB_PORT=5432`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=postgres`
- `DB_DATABASE=event_manager`

### 4. Frontend Kurulumu

```bash
cd frontend
npm install
```

### 5. Frontend Ortam Değişkenleri

`frontend/.env.example` dosyasını `.env` olarak kopyalayın:

```bash
cd frontend
cp .env.example .env
```

## ▶️ Çalıştırma

### Backend'i Başlatma

```bash
cd backend
npm run start:dev
```

Backend `http://localhost:3000` adresinde çalışacaktır.

### Frontend'i Başlatma

Yeni bir terminal penceresinde:

```bash
cd frontend
npm start
```

Frontend `http://localhost:3000` adresinde çalışacaktır (React varsayılan portu 3000'tir, farklı bir port kullanılabilir).

## 📁 Proje Yapısı

```
web-donemsonu/
├── backend/          # NestJS Backend
│   ├── src/         # Kaynak kodlar
│   └── ...
├── frontend/        # React Frontend
│   ├── src/         # Kaynak kodlar
│   └── ...
└── plan.md          # Proje planı
```

## 🛠 Teknolojiler

### Backend
- NestJS
- TypeORM
- PostgreSQL
- JWT Authentication
- Passport
- Bcrypt

### Frontend
- React
- TypeScript
- React Router DOM
- Axios

## 📝 Notlar

- Backend ve Frontend ayrı portlarda çalışır
- CORS ayarları backend'de yapılmalıdır
- JWT token'lar localStorage'da saklanır
- PostgreSQL veritabanı bağlantısı gerekir

## 🔐 Roller

- **ADMIN**: Etkinlik oluşturabilir, güncelleyebilir, silebilir
- **USER**: Etkinlikleri görüntüleyebilir ve katılabilir

