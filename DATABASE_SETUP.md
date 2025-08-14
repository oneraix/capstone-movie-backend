# 🗄️ Hướng dẫn Setup Database với SQL Script

## 📋 Tổng quan

File `db_cyber_community_code.sql` chứa:
- ✅ Schema database hoàn chỉnh
- ✅ Dữ liệu mẫu (users, movies, cinemas, seats, schedules)
- ✅ Stored procedures và views
- ✅ Indexes tối ưu performance

## 🚀 Cách 1: PlanetScale (Khuyến nghị - Free)

### Bước 1: Tạo PlanetScale Database
1. Vào [planetscale.com](https://planetscale.com)
2. Click "New Database" → Đặt tên: `movie-booking`
3. Copy connection string từ tab "Connect"

### Bước 2: Import SQL Script
```bash
# Cài PlanetScale CLI
npm install -g pscale

# Login
pscale auth login

# Import script
pscale db shell movie-booking < db_cyber_community_code.sql
```

## 🚂 Cách 2: Railway (Free tier)

### Bước 1: Tạo Railway MySQL
1. Vào [railway.app](https://railway.app)
2. New Project → Provision MySQL
3. Copy `DATABASE_URL` từ Variables

### Bước 2: Import SQL Script
```bash
# Cài Railway CLI
npm install -g @railway/cli

# Login và link project
railway login
railway link

# Import script
railway connect < db_cyber_community_code.sql
```

## ☁️ Cách 3: Supabase (Free tier)

### Bước 1: Tạo Supabase Project
1. Vào [supabase.com](https://supabase.com)
2. New Project → Đặt tên: `movie-booking`
3. Vào SQL Editor

### Bước 2: Import SQL Script
1. Copy toàn bộ nội dung `db_cyber_community_code.sql`
2. Paste vào SQL Editor
3. Click "Run" để execute

## 🐘 Cách 4: Neon (Free tier)

### Bước 1: Tạo Neon Database
1. Vào [neon.tech](https://neon.tech)
2. New Project → Đặt tên: `movie-booking`
3. Copy connection string

### Bước 2: Import SQL Script
```bash
# Sử dụng psql
psql "postgresql://username:password@host/database" < db_cyber_community_code.sql

# Hoặc sử dụng Neon Console SQL Editor
```

## 🐳 Cách 5: Local Docker (Development)

### Bước 1: Chạy MySQL Container
```bash
docker run --name movie-booking-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=movie_booking \
  -p 3306:3306 \
  -d mysql:8.0
```

### Bước 2: Import SQL Script
```bash
# Đợi container khởi động (30 giây)
sleep 30

# Import script
docker exec -i movie-booking-mysql mysql -u root -prootpassword movie_booking < db_cyber_community_code.sql
```

## 🔧 Cách 6: Local MySQL (Development)

### Bước 1: Cài MySQL
```bash
# Windows: Download MySQL Installer
# macOS: brew install mysql
# Ubuntu: sudo apt install mysql-server
```

### Bước 2: Import SQL Script
```bash
# Tạo database
mysql -u root -p -e "CREATE DATABASE movie_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import script
mysql -u root -p movie_booking < db_cyber_community_code.sql
```

## 📊 Kiểm tra Database

### Test Connection
```bash
# Cập nhật DATABASE_URL trong .env
DATABASE_URL="mysql://username:password@host:port/movie_booking"

# Test với Prisma
npx prisma db pull
npx prisma studio
```

### Kiểm tra dữ liệu
```sql
-- Kiểm tra số lượng records
SELECT 'NguoiDung' as bang, COUNT(*) as so_luong FROM NguoiDung
UNION ALL
SELECT 'Phim' as bang, COUNT(*) as so_luong FROM Phim
UNION ALL
SELECT 'HeThongRap' as bang, COUNT(*) as so_luong FROM HeThongRap
UNION ALL
SELECT 'CumRap' as bang, COUNT(*) as so_luong FROM CumRap
UNION ALL
SELECT 'RapPhim' as bang, COUNT(*) as so_luong FROM RapPhim
UNION ALL
SELECT 'Ghe' as bang, COUNT(*) as so_luong FROM Ghe
UNION ALL
SELECT 'LichChieu' as bang, COUNT(*) as so_luong FROM LichChieu
UNION ALL
SELECT 'DatVe' as bang, COUNT(*) as so_luong FROM DatVe;
```

## 🔐 Dữ liệu mẫu

### Users có sẵn:
- **Admin**: `admin` / `123456` (QuanTri)
- **User 1**: `user01` / `123456` (KhachHang)
- **User 2**: `user02` / `123456` (KhachHang)

### Movies có sẵn:
- Avengers: Endgame
- Spider-Man: No Way Home
- The Batman

### Cinemas có sẵn:
- CGV Aeon Mall Bình Tân
- CGV Landmark 81
- Lotte Cinema Nowzone
- Galaxy Nguyễn Du

## 🎯 Environment Variables

Sau khi setup database, cập nhật `.env`:

```env
# Database
DATABASE_URL="mysql://username:password@host:port/movie_booking"

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server
PORT=3069
NODE_ENV=development
```

## 🚀 Deploy lên Vercel

### Bước 1: Push code
```bash
git add .
git commit -m "feat: add database setup with SQL script"
git push origin main
```

### Bước 2: Deploy Vercel
1. Import project từ GitHub
2. Thêm Environment Variables (copy từ .env)
3. Deploy

## 🔄 Backup & Restore

### Export Database
```bash
# PlanetScale
pscale db dump movie-booking main > backup.sql

# Railway
railway connect mysqldump -u root -p movie_booking > backup.sql

# Local
mysqldump -u root -p movie_booking > backup.sql
```

### Restore Database
```bash
# Import backup
mysql -u root -p movie_booking < backup.sql

# Hoặc import script gốc
mysql -u root -p movie_booking < db_cyber_community_code.sql
```

## 💰 Chi phí

| Platform | Free Tier | Paid Plans |
|----------|-----------|------------|
| PlanetScale | 1B reads/month | $29/month |
| Railway | $5 credit/month | Pay-as-you-go |
| Supabase | 500MB storage | $25/month |
| Neon | 3GB storage | $0.12/GB |
| Local | Free | Free |

## 🎉 Kết quả

Sau khi setup thành công, bạn sẽ có:
- ✅ Database hoàn chỉnh với schema
- ✅ Dữ liệu mẫu để test
- ✅ Stored procedures và views
- ✅ Indexes tối ưu
- ✅ Ready để deploy production
