import { Link, NavLink, Outlet } from 'react-router-dom'
import './UserLayout.css'

function UserLayout() {
  return (
    <div className="user-wrapper">
      <header className="user-navbar">
        <div className="user-nav-container">
          <Link to="/" className="user-logo">
            <span className="user-logo-icon">▶</span>
            <span>
              <span className="user-logo-accent">AH</span>CINEMA
            </span>
          </Link>

          <nav className="user-nav-links">
            <NavLink to="/" end className={({ isActive }) => `user-nav-link ${isActive ? 'active' : ''}`}>
              Trang chủ
            </NavLink>
            <NavLink to="/phim" className={({ isActive }) => `user-nav-link ${isActive ? 'active' : ''}`}>
              Khám phá phim
            </NavLink>
            <NavLink to="/tai-khoan" className={({ isActive }) => `user-nav-link ${isActive ? 'active' : ''}`}>
              Vé của tôi
            </NavLink>
          </nav>

          <div className="user-nav-actions">
            {/* Nút chuyển nhanh sang Admin để tiện test đồ án */}
            <Link to="/admin/phong-chieu" className="user-btn-outline">
              Trang Admin
            </Link>
            <Link to="/dang-nhap" className="user-btn-primary">
              Đăng nhập
            </Link>
          </div>
        </div>
      </header>

      <main className="user-main">
        <Outlet />
      </main>

      <footer className="user-footer">
        <div className="user-footer-container">
          <div>
            <strong style={{ color: '#f8fafc' }}>AHCINEMA</strong> — Hệ thống đặt vé xem phim trực tuyến
          </div>
          <div>© 2026 AHCinema. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

export default UserLayout