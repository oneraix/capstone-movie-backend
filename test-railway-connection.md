# 🧪 Test Railway Database Connection

## Bước 1: Cập nhật .env

Sau khi có DATABASE_URL từ Railway, cập nhật file `.env`:

```env
DATABASE_URL="mysql://root:password@containers-us-west-XX.railway.app:port/database_name"
```

## Bước 2: Test Connection

```bash
# Test với Prisma
npx prisma db pull

# Nếu thành công, bạn sẽ thấy:
# Environment variables loaded from .env
# Prisma schema loaded from prisma/schema.prisma
# Datasource "db": MySQL database "database_name"
```

## Bước 3: Kiểm tra dữ liệu

```bash
# Mở Prisma Studio
npx prisma studio

# Hoặc test API
npm run dev
curl http://localhost:3069/api/QuanLyPhim/LayDanhSachPhim
```

## Bước 4: Deploy lên Vercel

1. **Copy DATABASE_URL** từ Railway
2. **Paste vào Vercel Environment Variables**
3. **Deploy**

## Troubleshooting

### Lỗi Connection
```bash
# Kiểm tra DATABASE_URL
echo $DATABASE_URL

# Test connection
npx prisma db pull
```

### Lỗi Import Script
- Kiểm tra file `db_cyber_community_code.sql`
- Đảm bảo đã import thành công trong Railway Console
- Kiểm tra logs trong Railway Dashboard
