import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-top">
        <div className="footer-column">
          <img src="/logo.png" alt="Logo" className="footer-logo" />
          <ul>
            <li>
              <a href="/gioi-thieu">Giới thiệu</a>
            </li>
            <li>
              <a href="/phong-truyen-thong">Phòng truyền thông</a>
            </li>
            <li>
              <a href="/hoc-sinh-tieu-bieu">Học sinh tiêu biểu</a>
            </li>
            <li>
              <a href="/dieu-khoan">Điều khoản chính sách</a>
            </li>
            <li>
              <a href="/quy-che">Quy chế hoạt động</a>
            </li>
            <li>
              <a href="/tuyen-dung">Tuyển dụng</a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Chương trình học tiêu biểu</h4>
          <ul>
            <li>Topclass</li>
            <li>TopUni</li>
            <li>PAT HSA</li>
            <li>PAT TSA</li>
            <li>PAT V-ACT</li>
            <li>HOCCMAIBOOK</li>
            <li>PEN</li>
            <li>H10</li>
            <li>ICANCONNECT</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Dịch vụ hỗ trợ học tập</h4>
          <ul>
            <li>Cập nhật tin tức</li>
            <li>Diễn đàn học tập</li>
            <li>Thư viện học liệu</li>
            <li>Chia sẻ kinh nghiệm</li>
            <li>Kiểm tra, thi thử</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Khách hàng / Đối tác</h4>
          <ul>
            <li>
              <a href="/lien-he">Liên hệ</a>
            </li>
            <li>
              <a href="/gop-y">Góp ý</a>
            </li>
            <li>
              <a href="/hoi-dap">Giải đáp thắc mắc</a>
            </li>
          </ul>
          <div className="footer-apps">
            <a href="#">
              <img src="/google-play.png" alt="Google Play" />
            </a>
            <a href="#">
              <img src="/app-store.png" alt="App Store" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © Công ty Cổ phần Đầu tư và Dịch vụ Giáo dục. Mọi quyền được bảo lưu.
        </p>
        <div className="footer-social">
          <a href="#">
            <i className="fa-brands fa-facebook"></i>
          </a>
          <a href="#">
            <i className="fa-brands fa-youtube"></i>
          </a>
          <a href="#">
            <i className="fa-brands fa-tiktok"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
