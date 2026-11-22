import { NavLink, Outlet } from 'react-router-dom'
import './AdminLayout.css'

function AdminLayout() {
  const menuItems = [
    { path: '/admin', label: 'Tổng quan kinh doanh', end: true },
    { path: '/admin/phim', label: 'Quản lý phim' },
    { path: '/admin/phong-chieu', label: 'Thiết lập phòng & ghế' },
    { path: '/admin/suat-chieu', label: 'Quản lý suất chiếu' },
    { path: '/admin/don-hang', label: 'Quản lý vé & đơn hàng' },
    { path: '/admin/nhan-vien', label: 'Quản lý nhân viên' },
  ]

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span style={{ color: '#f43f5e' }}><span className="admin-logo-accent">AH</span>CINEMA</span>
          <span className="admin-badge">ADMIN</span>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout