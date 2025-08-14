# ⚡ Hướng dẫn nhanh: Setup Database với SQL Script

## 🎯 Tổng quan

File `db_cyber_community_code.sql` đã có sẵn:
- ✅ Schema database hoàn chỉnh
- ✅ Dữ liệu mẫu (users, movies, cinemas)
- ✅ Stored procedures và views
- ✅ Indexes tối ưu

## 🚀 Setup nhanh (5 phút)

### Bước 1: Chạy script tự động
```bash
chmod +x scripts/setup-database.sh
./scripts/setup-database.sh
```

### Bước 2: Chọn option
1. **PlanetScale** (Khuyến nghị - Free)
2. **Railway** (Free tier)
3. **Local Docker** (Development)
4. **Local MySQL** (Development)

### Bước 3: Test
```bash
# Test connection
npx prisma db pull

# Start development
npm run dev

# View database
npx prisma studio
```

## 🔐 Dữ liệu có sẵn

### Users:
- **Admin**: `admin` / `123456` (QuanTri)
- **User 1**: `user01` / `123456` (KhachHang)
- **User 2**: `user02` / `123456` (KhachHang)

### Movies:
- Avengers: Endgame
- Spider-Man: No Way Home
- The Batman

### Cinemas:
- CGV Aeon Mall Bình Tân
- CGV Landmark 81
- Lotte Cinema Nowzone
- Galaxy Nguyễn Du

## 🎯 Manual Setup (Nếu script không hoạt động)

### PlanetScale
```bash
# 1. Cài CLI
npm install -g pscale

# 2. Login và tạo DB
pscale auth login
pscale database create movie-booking

# 3. Import script
pscale db shell movie-booking < db_cyber_community_code.sql
```

### Railway
```bash
# 1. Cài CLI
npm install -g @railway/cli

# 2. Login và tạo project
railway login
railway init
railway add

# 3. Import script
railway connect < db_cyber_community_code.sql
```

### Local Docker
```bash
# 1. Chạy MySQL container
docker run --name movie-booking-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=movie_booking \
  -p 3306:3306 \
  -d mysql:8.0

# 2. Import script
sleep 30
docker exec -i movie-booking-mysql mysql -u root -prootpassword movie_booking < db_cyber_community_code.sql
```

## 🔧 Environment Variables

Sau khi setup, cập nhật `.env`:

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

## ✅ Kiểm tra

### Test API
```bash
# Test Swagger UI
curl http://localhost:3069/api-docs

# Test API endpoints
curl http://localhost:3069/api/QuanLyPhim/LayDanhSachPhim
curl http://localhost:3069/api/QuanLyNguoiDung/DangNhap
```

### Test Database
```bash
# Prisma Studio
npx prisma studio

# Check tables
npx prisma db pull
```

## 🔗 Links hữu ích

- **PlanetScale**: https://planetscale.com
- **Railway**: https://railway.app
- **Vercel**: https://vercel.com
- **Prisma Studio**: `npx prisma studio`

## 💰 Chi phí

| Platform | Free Tier | Paid |
|----------|-----------|------|
| PlanetScale | 1B reads/month | $29/month |
| Railway | $5 credit/month | Pay-as-you-go |
| Vercel | 100GB bandwidth/month | $20/month |
| **Tổng** | **Miễn phí** | **$49/month** |

## 🆘 Troubleshooting

### Lỗi Connection
```bash
# Kiểm tra DATABASE_URL
echo $DATABASE_URL

# Test connection
npx prisma db pull
```

### Lỗi Import Script
```bash
# Kiểm tra file
ls -la db_cyber_community_code.sql

# Test import
mysql -u root -p -e "CREATE DATABASE test_db;"
mysql -u root -p test_db < db_cyber_community_code.sql
```

### Lỗi Deploy
- Kiểm tra Environment Variables trong Vercel
- Xem logs trong Vercel Dashboard
- Test local trước khi deploy
