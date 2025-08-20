show create table dangkikhoahoc;

CREATE TABLE `vaitro` (
  `vaiTro_id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `tenVaiTro` enum('hoc_vien','nguoi_quan_ly','giang_vien') DEFAULT NULL,
  PRIMARY KEY (`vaiTro_id`)
);

CREATE TABLE `taikhoan` (
  `taiKhoan_id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `tenDangNhap` varchar(50) NOT NULL,
  `matKhau` varchar(300) NOT NULL,
  `tenNguoiDung` varchar(50) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `namSinh` varchar(10) DEFAULT NULL,
  `SDT` varchar(11) DEFAULT NULL,
  `ngayTao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ngaySua` datetime DEFAULT NULL,
  `ngayXoa` datetime DEFAULT NULL,
  `vaiTro_id` tinyint unsigned DEFAULT NULL,
  `mota` text,
  `status` varchar(45) DEFAULT 'all',
  PRIMARY KEY (`taiKhoan_id`),
  UNIQUE KEY `email` (`email`),
  KEY `vaiTro_id` (`vaiTro_id`),
  CONSTRAINT `taikhoan_ibfk_1` FOREIGN KEY (`vaiTro_id`) REFERENCES `vaitro` (`vaiTro_id`) ON DELETE RESTRICT
);

CREATE TABLE `caphoc` (
  `capHoc_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tenCapHoc` varchar(100) NOT NULL,
  `is_active` tinyint DEFAULT '1',
  `ngayTao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`capHoc_id`)
) ;

CREATE TABLE `chuongtrinhhoc` (
  `CTH_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ten_CTH` varchar(100) NOT NULL,
  `capHoc_id` bigint unsigned DEFAULT NULL,
  `ngayTao` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint DEFAULT '1',
  PRIMARY KEY (`CTH_id`),
  KEY `capHoc_id` (`capHoc_id`),
  CONSTRAINT `chuongtrinhhoc_ibfk_1` FOREIGN KEY (`capHoc_id`) REFERENCES `caphoc` (`capHoc_id`) ON DELETE CASCADE
) ;

CREATE TABLE `loaikhoahoc` (
  `LKH_id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `tenLKH` varchar(100) DEFAULT NULL,
  `ngayTao` datetime DEFAULT NULL,
  `CTH_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`LKH_id`),
  KEY `CTH_id` (`CTH_id`),
  CONSTRAINT `loaikhoahoc_ibfk_1` FOREIGN KEY (`CTH_id`) REFERENCES `chuongtrinhhoc` (`CTH_id`) ON DELETE SET NULL
) ;

CREATE TABLE `khoahoc` (
  `khoaHoc_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tenKhoaHoc` varchar(100) NOT NULL,
  `giaca` varchar(20) NOT NULL,
  `hanDangKy` date NOT NULL,
  `ngayBatDau` date NOT NULL,
  `ngayKetThuc` date NOT NULL,
  `mota` varchar(500) DEFAULT NULL,
  `trangThai` enum('chua_chap_nhan','chap_nhan') DEFAULT 'chua_chap_nhan',
  `hinhanh` text,
  `is_active` enum('dang_hoat_dong','khong_hoat_dong') DEFAULT 'dang_hoat_dong',
  `LKH_id` tinyint unsigned DEFAULT NULL,
  `soHVTD` bigint unsigned DEFAULT '40',
  `ngayTao` datetime DEFAULT CURRENT_TIMESTAMP,
  `gv_tao` varchar(45) NOT NULL,
  PRIMARY KEY (`khoaHoc_id`),
  KEY `LKH_id` (`LKH_id`),
  CONSTRAINT `khoahoc_ibfk_1` FOREIGN KEY (`LKH_id`) REFERENCES `loaikhoahoc` (`LKH_id`) ON DELETE SET NULL
);

CREATE TABLE `baikiemtra` (
  `BKT_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tenBKT` varchar(100) NOT NULL,
  `ngayTao` datetime DEFAULT CURRENT_TIMESTAMP,
  `khoaHoc_id` bigint unsigned NOT NULL,
  `nguoiTao_id` tinyint unsigned DEFAULT NULL,
  `time_limit` tinyint DEFAULT '40',
  `number_question` tinyint NOT NULL,
  PRIMARY KEY (`BKT_id`),
  KEY `baikiemtra_ibfk_1` (`khoaHoc_id`),
  KEY `baikiemtra_ibfk_2` (`nguoiTao_id`),
  CONSTRAINT `baikiemtra_ibfk_1` FOREIGN KEY (`khoaHoc_id`) REFERENCES `khoahoc` (`khoaHoc_id`) ON DELETE CASCADE,
  CONSTRAINT `baikiemtra_ibfk_2` FOREIGN KEY (`nguoiTao_id`) REFERENCES `taikhoan` (`taiKhoan_id`) ON DELETE CASCADE
) ;

CREATE TABLE `baigiang` (
  `BG_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tenBG` varchar(100) NOT NULL,
  `videoURl` text NOT NULL,
  `mota` text NOT NULL,
  `ngayTao` datetime DEFAULT CURRENT_TIMESTAMP,
  `khoaHoc_id` bigint unsigned DEFAULT NULL,
  `mien_phi` varchar(45) DEFAULT 'khong',
  PRIMARY KEY (`BG_id`),
  KEY `khoaHoc_id` (`khoaHoc_id`),
  CONSTRAINT `baigiang_ibfk_1` FOREIGN KEY (`khoaHoc_id`) REFERENCES `khoahoc` (`khoaHoc_id`)
) ;

CREATE TABLE `review` (
  `review_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `khoaHoc_id` bigint unsigned NOT NULL,
  `content` text,
  `create_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_id` tinyint unsigned NOT NULL,
  `rating` tinyint NOT NULL,
  PRIMARY KEY (`review_id`),
  KEY `review_ibfk_2` (`user_id`),
  KEY `review_ibfk_1` (`khoaHoc_id`),
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`khoaHoc_id`) REFERENCES `khoahoc` (`khoaHoc_id`) ON DELETE CASCADE,
  CONSTRAINT `review_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `taikhoan` (`taiKhoan_id`) ON DELETE CASCADE
) ;

CREATE TABLE `image_review` (
  `imgae_review_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `review_id` bigint unsigned DEFAULT NULL,
  `link_image` text,
  PRIMARY KEY (`imgae_review_id`),
  KEY `review_id` (`review_id`),
  CONSTRAINT `image_review_ibfk_1` FOREIGN KEY (`review_id`) REFERENCES `review` (`review_id`) ON DELETE CASCADE
);

CREATE TABLE `cauhoi` (
  `cauHoi_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `BKT_id` bigint unsigned DEFAULT NULL,
  `tenCauHoi` varchar(100) NOT NULL,
  `answer_id_correct` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`cauHoi_id`),
  KEY `BKT_id` (`BKT_id`),
  CONSTRAINT `cauhoi_ibfk_1` FOREIGN KEY (`BKT_id`) REFERENCES `baikiemtra` (`BKT_id`) ON DELETE CASCADE
);

CREATE TABLE `cautraloi` (
  `CTL_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `cauHoi_id` bigint unsigned DEFAULT NULL,
  `noiDung` text NOT NULL,
  PRIMARY KEY (`CTL_id`),
  KEY `cauHoi_id` (`cauHoi_id`),
  CONSTRAINT `cautraloi_ibfk_1` FOREIGN KEY (`cauHoi_id`) REFERENCES `cauhoi` (`cauHoi_id`) ON DELETE CASCADE
);

CREATE TABLE `userexam` (
  `user_exam_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` tinyint unsigned DEFAULT NULL,
  `exam_id` bigint unsigned DEFAULT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `start_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `duration` varchar(8) DEFAULT NULL,
  PRIMARY KEY (`user_exam_id`),
  KEY `user_id` (`user_id`),
  KEY `exam_id` (`exam_id`),
  CONSTRAINT `userexam_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `taikhoan` (`taiKhoan_id`) ON DELETE SET NULL,
  CONSTRAINT `userexam_ibfk_2` FOREIGN KEY (`exam_id`) REFERENCES `baikiemtra` (`BKT_id`) ON DELETE CASCADE
);

CREATE TABLE `useranswer` (
  `user_answer_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `answer_id` bigint unsigned DEFAULT NULL,
  `user_exam_id` bigint unsigned DEFAULT NULL,
  `question_id` bigint unsigned DEFAULT NULL,
  `is_correct` tinyint DEFAULT '0',
  PRIMARY KEY (`user_answer_id`),
  KEY `user_exam_id` (`user_exam_id`),
  CONSTRAINT `useranswer_ibfk_1` FOREIGN KEY (`user_exam_id`) REFERENCES `userexam` (`user_exam_id`) ON DELETE CASCADE
);

CREATE TABLE `dangkikhoahoc` (
  `course_registration_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` tinyint unsigned NOT NULL,
  `course_id` bigint unsigned NOT NULL,
  `register_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_method_type` varchar(50) DEFAULT 'card',
  `payment_method` varchar(50) DEFAULT 'stripe',
  `amount_paid` decimal(12,2) DEFAULT '0.00',
  `note` text,
  `invoice_url` text,
  PRIMARY KEY (`course_registration_id`),
  KEY `user_id` (`user_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `dangkikhoahoc_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `taikhoan` (`taiKhoan_id`),
  CONSTRAINT `dangkikhoahoc_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `khoahoc` (`khoaHoc_id`)
);