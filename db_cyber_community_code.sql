-- =============================================
-- Movie Booking System Database Creation Script
-- MySQL Version 8.0+
-- =============================================

-- Tạo database
CREATE DATABASE IF NOT EXISTS movie_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE movie_booking;

-- =============================================
-- Xóa các bảng nếu tồn tại (theo thứ tự dependency)
-- =============================================
DROP TABLE IF EXISTS DatVe;
DROP TABLE IF EXISTS LichChieu;
DROP TABLE IF EXISTS Ghe;
DROP TABLE IF EXISTS RapPhim;
DROP TABLE IF EXISTS CumRap;
DROP TABLE IF EXISTS HeThongRap;
DROP TABLE IF EXISTS Banner;
DROP TABLE IF EXISTS Phim;
DROP TABLE IF EXISTS NguoiDung;

-- =============================================
-- Tạo bảng NguoiDung
-- =============================================
CREATE TABLE NguoiDung (
    taiKhoan VARCHAR(50) PRIMARY KEY,
    hoTen VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    soDt VARCHAR(15) NOT NULL,
    matKhau VARCHAR(255) NOT NULL,
    maNhom VARCHAR(10) DEFAULT 'GP01',
    maLoaiNguoiDung VARCHAR(20) DEFAULT 'KhachHang',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_loaiNguoiDung (maLoaiNguoiDung)
);

-- =============================================
-- Tạo bảng Phim
-- =============================================
CREATE TABLE Phim (
    maPhim INT AUTO_INCREMENT PRIMARY KEY,
    tenPhim VARCHAR(200) NOT NULL,
    trailer VARCHAR(500),
    hinhAnh VARCHAR(500),
    moTa TEXT,
    ngayKhoiChieu DATE NOT NULL,
    danhGia DECIMAL(2,1) DEFAULT 0,
    hot BOOLEAN DEFAULT FALSE,
    dangChieu BOOLEAN DEFAULT TRUE,
    sapChieu BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_ngayKhoiChieu (ngayKhoiChieu),
    INDEX idx_dangChieu (dangChieu),
    INDEX idx_sapChieu (sapChieu),
    INDEX idx_hot (hot)
);

-- =============================================
-- Tạo bảng Banner
-- =============================================
CREATE TABLE Banner (
    maBanner INT AUTO_INCREMENT PRIMARY KEY,
    maPhim INT NOT NULL,
    hinhAnh VARCHAR(500) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (maPhim) REFERENCES Phim(maPhim) ON DELETE CASCADE,
    INDEX idx_maPhim (maPhim)
);

-- =============================================
-- Tạo bảng HeThongRap
-- =============================================
CREATE TABLE HeThongRap (
    maHeThongRap VARCHAR(10) PRIMARY KEY,
    tenHeThongRap VARCHAR(100) NOT NULL,
    logo VARCHAR(500),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Tạo bảng CumRap
-- =============================================
CREATE TABLE CumRap (
    maCumRap VARCHAR(20) PRIMARY KEY,
    tenCumRap VARCHAR(200) NOT NULL,
    diaChi TEXT NOT NULL,
    maHeThongRap VARCHAR(10) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (maHeThongRap) REFERENCES HeThongRap(maHeThongRap) ON DELETE CASCADE,
    INDEX idx_maHeThongRap (maHeThongRap)
);

-- =============================================
-- Tạo bảng RapPhim
-- =============================================
CREATE TABLE RapPhim (
    maRap INT AUTO_INCREMENT PRIMARY KEY,
    tenRap VARCHAR(100) NOT NULL,
    maCumRap VARCHAR(20) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (maCumRap) REFERENCES CumRap(maCumRap) ON DELETE CASCADE,
    INDEX idx_maCumRap (maCumRap)
);

-- =============================================
-- Tạo bảng Ghe
-- =============================================
CREATE TABLE Ghe (
    maGhe INT AUTO_INCREMENT PRIMARY KEY,
    tenGhe VARCHAR(10) NOT NULL,
    loaiGhe ENUM('Thuong', 'Vip') DEFAULT 'Thuong',
    maRap INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (maRap) REFERENCES RapPhim(maRap) ON DELETE CASCADE,
    INDEX idx_maRap (maRap),
    INDEX idx_loaiGhe (loaiGhe),
    UNIQUE KEY unique_ghe_rap (tenGhe, maRap)
);

-- =============================================
-- Tạo bảng LichChieu
-- =============================================
CREATE TABLE LichChieu (
    maLichChieu INT AUTO_INCREMENT PRIMARY KEY,
    maRap INT NOT NULL,
    maPhim INT NOT NULL,
    ngayGioChieu DATETIME NOT NULL,
    giaVe DECIMAL(10,2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (maRap) REFERENCES RapPhim(maRap) ON DELETE CASCADE,
    FOREIGN KEY (maPhim) REFERENCES Phim(maPhim) ON DELETE CASCADE,
    INDEX idx_maRap (maRap),
    INDEX idx_maPhim (maPhim),
    INDEX idx_ngayGioChieu (ngayGioChieu),
    UNIQUE KEY unique_lich_chieu (maRap, maPhim, ngayGioChieu)
);

-- =============================================
-- Tạo bảng DatVe
-- =============================================
CREATE TABLE DatVe (
    taiKhoan VARCHAR(50) NOT NULL,
    maLichChieu INT NOT NULL,
    maGhe INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (taiKhoan, maLichChieu, maGhe),
    FOREIGN KEY (taiKhoan) REFERENCES NguoiDung(taiKhoan) ON DELETE CASCADE,
    FOREIGN KEY (maLichChieu) REFERENCES LichChieu(maLichChieu) ON DELETE CASCADE,
    FOREIGN KEY (maGhe) REFERENCES Ghe(maGhe) ON DELETE CASCADE,
    
    INDEX idx_taiKhoan (taiKhoan),
    INDEX idx_maLichChieu (maLichChieu),
    INDEX idx_maGhe (maGhe)
);

-- =============================================
-- Thêm dữ liệu mẫu
-- =============================================

-- Thêm người dùng mẫu
INSERT INTO NguoiDung (taiKhoan, hoTen, email, soDt, matKhau, maLoaiNguoiDung) VALUES
('admin', 'Administrator', 'admin@movie.com', '0123456789', '$2a$10$N9qo8uLOickgx2ZMRZoMye/Lo/kxkOHCdZXF1h4D7xqXR5FXV5cJq', 'QuanTri'),
('user01', 'Nguyen Van A', 'user01@gmail.com', '0987654321', '$2a$10$N9qo8uLOickgx2ZMRZoMye/Lo/kxkOHCdZXF1h4D7xqXR5FXV5cJq', 'KhachHang'),
('user02', 'Tran Thi B', 'user02@gmail.com', '0912345678', '$2a$10$N9qo8uLOickgx2ZMRZoMye/Lo/kxkOHCdZXF1h4D7xqXR5FXV5cJq', 'KhachHang');

-- Thêm phim mẫu
INSERT INTO Phim (tenPhim, trailer, hinhAnh, moTa, ngayKhoiChieu, danhGia, hot, dangChieu, sapChieu) VALUES
('Avengers: Endgame', 'https://www.youtube.com/watch?v=TcMBFSGVi1c', 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', 'Cuộc chiến cuối cùng của các siêu anh hùng', '2023-04-26', 9.0, TRUE, TRUE, FALSE),
('Spider-Man: No Way Home', 'https://www.youtube.com/watch?v=JfVOs4VSpmA', 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', 'Peter Parker đối mặt với đa vũ trụ', '2023-12-17', 8.5, TRUE, TRUE, FALSE),
('The Batman', 'https://www.youtube.com/watch?v=mqqft2x_Aa4', 'https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg', 'Người Dơi phiên bản mới', '2024-03-04', 8.0, FALSE, FALSE, TRUE);

-- Thêm banner mẫu
INSERT INTO Banner (maPhim, hinhAnh) VALUES
(1, 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg'),
(2, 'https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg'),
(3, 'https://image.tmdb.org/t/p/original/qqHQsStV6exghCM7zbObuYBiYxw.jpg');

-- Thêm hệ thống rạp mẫu
INSERT INTO HeThongRap (maHeThongRap, tenHeThongRap, logo) VALUES
('CGV', 'CGV Cinemas', 'https://s3img.vcdn.vn/123phim/2018/09/cgv-cinemas-15379624326697.jpg'),
('LOTTE', 'Lotte Cinema', 'https://s3img.vcdn.vn/123phim/2018/09/lotte-cinema-15379624518541.jpg'),
('GALAXY', 'Galaxy Cinema', 'https://s3img.vcdn.vn/123phim/2018/09/galaxy-cinema-15379624629809.jpg');

-- Thêm cụm rạp mẫu
INSERT INTO CumRap (maCumRap, tenCumRap, diaChi, maHeThongRap) VALUES
('CGV-AEON', 'CGV Aeon Mall Bình Tân', 'Tầng 3, AEON Mall Bình Tân, Số 1 đường số 17A, Bình Trị Đông B, Bình Tân, TP.HCM', 'CGV'),
('CGV-LANDMARK', 'CGV Landmark 81', 'Tầng Basement 1 & 2, Landmark 81, 720A Điện Biên Phủ, Bình Thạnh, TP.HCM', 'CGV'),
('LOTTE-NOWZONE', 'Lotte Cinema Nowzone', 'Tầng 7, Nowzone Fashion Mall, 235 Nguyễn Văn Cừ, Quận 1, TP.HCM', 'LOTTE'),
('GALAXY-NGUYEN-DU', 'Galaxy Nguyễn Du', '116 Nguyễn Du, Quận 1, TP.HCM', 'GALAXY');

-- Thêm rạp phim mẫu
INSERT INTO RapPhim (tenRap, maCumRap) VALUES
('Rạp 1', 'CGV-AEON'),
('Rạp 2', 'CGV-AEON'),
('Rạp 3', 'CGV-AEON'),
('Rạp 1', 'CGV-LANDMARK'),
('Rạp 2', 'CGV-LANDMARK'),
('Rạp 1', 'LOTTE-NOWZONE'),
('Rạp 2', 'LOTTE-NOWZONE'),
('Rạp 1', 'GALAXY-NGUYEN-DU');

-- =============================================
-- Tạo ghế cho các rạp (A1-A10, B1-B10, C1-C10)
-- =============================================
DELIMITER //
CREATE PROCEDURE CreateSeats()
BEGIN
    DECLARE rap_id INT;
    DECLARE done INT DEFAULT FALSE;
    DECLARE cur CURSOR FOR SELECT maRap FROM RapPhim;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO rap_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Tạo ghế hàng A (VIP)
        INSERT INTO Ghe (tenGhe, loaiGhe, maRap) VALUES
        (CONCAT('A', 1), 'Vip', rap_id),
        (CONCAT('A', 2), 'Vip', rap_id),
        (CONCAT('A', 3), 'Vip', rap_id),
        (CONCAT('A', 4), 'Vip', rap_id),
        (CONCAT('A', 5), 'Vip', rap_id),
        (CONCAT('A', 6), 'Vip', rap_id),
        (CONCAT('A', 7), 'Vip', rap_id),
        (CONCAT('A', 8), 'Vip', rap_id),
        (CONCAT('A', 9), 'Vip', rap_id),
        (CONCAT('A', 10), 'Vip', rap_id);
        
        -- Tạo ghế hàng B, C (Thường)
        INSERT INTO Ghe (tenGhe, loaiGhe, maRap) VALUES
        (CONCAT('B', 1), 'Thuong', rap_id),
        (CONCAT('B', 2), 'Thuong', rap_id),
        (CONCAT('B', 3), 'Thuong', rap_id),
        (CONCAT('B', 4), 'Thuong', rap_id),
        (CONCAT('B', 5), 'Thuong', rap_id),
        (CONCAT('B', 6), 'Thuong', rap_id),
        (CONCAT('B', 7), 'Thuong', rap_id),
        (CONCAT('B', 8), 'Thuong', rap_id),
        (CONCAT('B', 9), 'Thuong', rap_id),
        (CONCAT('B', 10), 'Thuong', rap_id),
        (CONCAT('C', 1), 'Thuong', rap_id),
        (CONCAT('C', 2), 'Thuong', rap_id),
        (CONCAT('C', 3), 'Thuong', rap_id),
        (CONCAT('C', 4), 'Thuong', rap_id),
        (CONCAT('C', 5), 'Thuong', rap_id),
        (CONCAT('C', 6), 'Thuong', rap_id),
        (CONCAT('C', 7), 'Thuong', rap_id),
        (CONCAT('C', 8), 'Thuong', rap_id),
        (CONCAT('C', 9), 'Thuong', rap_id),
        (CONCAT('C', 10), 'Thuong', rap_id);
        
    END LOOP;
    CLOSE cur;
END//
DELIMITER ;

-- Gọi procedure để tạo ghế
CALL CreateSeats();
DROP PROCEDURE CreateSeats;

-- Thêm lịch chiếu mẫu
INSERT INTO LichChieu (maRap, maPhim, ngayGioChieu, giaVe) VALUES
(1, 1, '2024-01-15 10:00:00', 120000),
(1, 1, '2024-01-15 14:00:00', 150000),
(1, 1, '2024-01-15 18:00:00', 180000),
(2, 2, '2024-01-15 11:00:00', 120000),
(2, 2, '2024-01-15 15:00:00', 150000),
(3, 3, '2024-03-05 10:00:00', 130000),
(4, 1, '2024-01-16 09:00:00', 110000),
(5, 2, '2024-01-16 13:00:00', 140000);

-- Thêm một vài vé đã đặt mẫu
INSERT INTO DatVe (taiKhoan, maLichChieu, maGhe) VALUES
('user01', 1, 1),
('user01', 1, 2),
('user02', 2, 5),
('user02', 2, 6);

-- =============================================
-- Tạo View hữu ích
-- =============================================

-- View thông tin lịch chiếu chi tiết
CREATE VIEW v_LichChieuChiTiet AS
SELECT 
    lc.maLichChieu,
    lc.ngayGioChieu,
    lc.giaVe,
    p.tenPhim,
    p.hinhAnh as hinhAnhPhim,
    p.trailer,
    rp.tenRap,
    cr.tenCumRap,
    cr.diaChi,
    htr.tenHeThongRap,
    htr.logo as logoHeThongRap
FROM LichChieu lc
JOIN Phim p ON lc.maPhim = p.maPhim
JOIN RapPhim rp ON lc.maRap = rp.maRap
JOIN CumRap cr ON rp.maCumRap = cr.maCumRap
JOIN HeThongRap htr ON cr.maHeThongRap = htr.maHeThongRap;

-- View thông tin đặt vé chi tiết
CREATE VIEW v_DatVeChiTiet AS
SELECT 
    dv.taiKhoan,
    nd.hoTen,
    nd.email,
    p.tenPhim,
    lc.ngayGioChieu,
    lc.giaVe,
    g.tenGhe,
    g.loaiGhe,
    rp.tenRap,
    cr.tenCumRap,
    dv.createdAt as ngayDat
FROM DatVe dv
JOIN NguoiDung nd ON dv.taiKhoan = nd.taiKhoan
JOIN LichChieu lc ON dv.maLichChieu = lc.maLichChieu
JOIN Phim p ON lc.maPhim = p.maPhim
JOIN Ghe g ON dv.maGhe = g.maGhe
JOIN RapPhim rp ON lc.maRap = rp.maRap
JOIN CumRap cr ON rp.maCumRap = cr.maCumRap;

-- =============================================
-- Tạo Stored Procedures
-- =============================================

-- Procedure kiểm tra ghế còn trống
DELIMITER //
CREATE PROCEDURE CheckAvailableSeats(IN p_maLichChieu INT)
BEGIN
    SELECT 
        g.maGhe,
        g.tenGhe,
        g.loaiGhe,
        CASE 
            WHEN dv.maGhe IS NULL THEN 'Trong'
            ELSE 'DaDat'
        END as trangThai
    FROM Ghe g
    JOIN RapPhim rp ON g.maRap = rp.maRap
    JOIN LichChieu lc ON rp.maRap = lc.maRap
    LEFT JOIN DatVe dv ON g.maGhe = dv.maGhe AND dv.maLichChieu = p_maLichChieu
    WHERE lc.maLichChieu = p_maLichChieu
    ORDER BY g.tenGhe;
END//
DELIMITER ;

-- Procedure thống kê doanh thu
DELIMITER //
CREATE PROCEDURE ThongKeDoanhThu(IN p_startDate DATE, IN p_endDate DATE)
BEGIN
    SELECT 
        DATE(lc.ngayGioChieu) as ngayChieu,
        p.tenPhim,
        cr.tenCumRap,
        COUNT(dv.maGhe) as soVeDaBan,
        SUM(lc.giaVe) as doanhThu
    FROM LichChieu lc
    JOIN Phim p ON lc.maPhim = p.maPhim
    JOIN RapPhim rp ON lc.maRap = rp.maRap
    JOIN CumRap cr ON rp.maCumRap = cr.maCumRap
    LEFT JOIN DatVe dv ON lc.maLichChieu = dv.maLichChieu
    WHERE DATE(lc.ngayGioChieu) BETWEEN p_startDate AND p_endDate
    GROUP BY DATE(lc.ngayGioChieu), p.tenPhim, cr.tenCumRap
    ORDER BY ngayChieu DESC, doanhThu DESC;
END//
DELIMITER ;

-- =============================================
-- Tạo Indexes để tối ưu performance
-- =============================================
CREATE INDEX idx_phim_status ON Phim(dangChieu, sapChieu, hot);
CREATE INDEX idx_lichchieu_datetime ON LichChieu(ngayGioChieu);
CREATE INDEX idx_datve_created ON DatVe(createdAt);

-- =============================================
-- Hoàn thành
-- =============================================
SELECT 'Database movie_booking đã được tạo thành công!' as message;

-- Hiển thị thống kê
SELECT 'Thống kê dữ liệu:' as info;
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
