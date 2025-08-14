#!/bin/bash

# Script để setup database với SQL script
# Sử dụng: ./scripts/setup-database.sh [option]

echo "🗄️ Setting up Movie Booking Database..."

# Kiểm tra file SQL script
if [ ! -f "db_cyber_community_code.sql" ]; then
    echo "❌ File db_cyber_community_code.sql not found!"
    exit 1
fi

echo "✅ Found SQL script: db_cyber_community_code.sql"

# Menu options
case "${1:-}" in
    "planetscale")
        setup_planetscale
        ;;
    "railway")
        setup_railway
        ;;
    "docker")
        setup_docker
        ;;
    "local")
        setup_local
        ;;
    *)
        show_menu
        ;;
esac

show_menu() {
    echo ""
    echo "🎯 Choose your database setup option:"
    echo "1) PlanetScale (Recommended - Free)"
    echo "2) Railway (Free tier)"
    echo "3) Local Docker (Development)"
    echo "4) Local MySQL (Development)"
    echo ""
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1) setup_planetscale ;;
        2) setup_railway ;;
        3) setup_docker ;;
        4) setup_local ;;
        *) echo "❌ Invalid choice"; exit 1 ;;
    esac
}

setup_planetscale() {
    echo "🚀 Setting up PlanetScale Database..."
    
    # Kiểm tra PlanetScale CLI
    if ! command -v pscale &> /dev/null; then
        echo "📦 Installing PlanetScale CLI..."
        npm install -g pscale
    fi
    
    echo "🔐 Please login to PlanetScale..."
    pscale auth login
    
    echo "📁 Creating database..."
    read -p "Enter database name (default: movie-booking): " db_name
    db_name=${db_name:-movie-booking}
    
    pscale database create $db_name
    
    echo "📥 Importing SQL script..."
    pscale db shell $db_name < db_cyber_community_code.sql
    
    echo "🔗 Getting connection string..."
    DATABASE_URL=$(pscale connect $db_name main --format=json | jq -r '.connection_strings.mysql')
    
    update_env_file "$DATABASE_URL"
    echo "✅ PlanetScale setup completed!"
}

setup_railway() {
    echo "🚂 Setting up Railway Database..."
    
    # Kiểm tra Railway CLI
    if ! command -v railway &> /dev/null; then
        echo "📦 Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    echo "🔐 Please login to Railway..."
    railway login
    
    echo "📁 Creating new project..."
    railway init
    
    echo "🗄️ Adding MySQL service..."
    railway add
    
    echo "📥 Importing SQL script..."
    railway connect < db_cyber_community_code.sql
    
    echo "🔗 Getting DATABASE_URL..."
    DATABASE_URL=$(railway variables | grep DATABASE_URL | cut -d'=' -f2)
    
    update_env_file "$DATABASE_URL"
    echo "✅ Railway setup completed!"
}

setup_docker() {
    echo "🐳 Setting up Local Docker Database..."
    
    # Kiểm tra Docker
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker not found. Please install Docker first."
        exit 1
    fi
    
    # Dừng container cũ nếu có
    docker stop movie-booking-mysql 2>/dev/null || true
    docker rm movie-booking-mysql 2>/dev/null || true
    
    echo "🚀 Starting MySQL container..."
    docker run --name movie-booking-mysql \
        -e MYSQL_ROOT_PASSWORD=rootpassword \
        -e MYSQL_DATABASE=movie_booking \
        -p 3306:3306 \
        -d mysql:8.0
    
    echo "⏳ Waiting for MySQL to start..."
    sleep 30
    
    echo "📥 Importing SQL script..."
    docker exec -i movie-booking-mysql mysql -u root -prootpassword movie_booking < db_cyber_community_code.sql
    
    DATABASE_URL="mysql://root:rootpassword@localhost:3306/movie_booking"
    update_env_file "$DATABASE_URL"
    
    echo "✅ Docker setup completed!"
    echo "🔗 MySQL running on localhost:3306"
    echo "📊 phpMyAdmin: http://localhost:8080 (if you have it running)"
}

setup_local() {
    echo "🔧 Setting up Local MySQL Database..."
    
    # Kiểm tra MySQL
    if ! command -v mysql &> /dev/null; then
        echo "❌ MySQL not found. Please install MySQL first."
        echo "💡 Windows: Download MySQL Installer"
        echo "💡 macOS: brew install mysql"
        echo "💡 Ubuntu: sudo apt install mysql-server"
        exit 1
    fi
    
    echo "📁 Creating database..."
    mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS movie_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    
    echo "📥 Importing SQL script..."
    mysql -u root -p movie_booking < db_cyber_community_code.sql
    
    read -p "Enter MySQL username (default: root): " username
    username=${username:-root}
    
    read -p "Enter MySQL password: " password
    
    DATABASE_URL="mysql://$username:$password@localhost:3306/movie_booking"
    update_env_file "$DATABASE_URL"
    
    echo "✅ Local MySQL setup completed!"
}

update_env_file() {
    local DATABASE_URL=$1
    
    echo "📝 Updating .env file..."
    if [ -f ".env" ]; then
        cp .env .env.backup
        echo "📋 Backed up .env to .env.backup"
    fi
    
    # Tạo .env mới
    cat > .env << EOF
# Database Configuration
DATABASE_URL="$DATABASE_URL"

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_also_long_and_random
JWT_REFRESH_EXPIRES_IN=30d

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Server Configuration
PORT=3069
NODE_ENV=development
EOF
    
    echo "✅ .env file updated with DATABASE_URL"
}

# Test database connection
test_connection() {
    echo "🧪 Testing database connection..."
    
    if npx prisma db pull > /dev/null 2>&1; then
        echo "✅ Database connection successful!"
    else
        echo "❌ Database connection failed!"
        echo "💡 Please check your DATABASE_URL in .env file"
    fi
}

# Main execution
echo ""
echo "🎉 Database setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update other environment variables in .env file"
echo "2. Test connection: npx prisma db pull"
echo "3. Start development: npm run dev"
echo "4. View database: npx prisma studio"
echo ""
echo "🔐 Default users:"
echo "- Admin: admin / 123456"
echo "- User 1: user01 / 123456"
echo "- User 2: user02 / 123456"
