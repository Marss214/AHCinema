import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/user/Home'
import PhongChieu from './pages/admin/PhongChieu'

const Placeholder = ({ title }) => (
  <div style={{ padding: '40px', color: '#94a3b8', maxWidth: '1200px', margin: '0 auto' }}>
    <h2 style={{ color: '#fff', marginBottom: '8px' }}>{title}</h2>
    <p>Tính năng đang được phát triển...</p>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Luồng User (Khách hàng) */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="phim" element={<Placeholder title="Khám phá phim" />} />
          <Route path="phim/:id" element={<Placeholder title="Chi tiết phim & Đặt vé" />} />
          <Route path="tai-khoan" element={<Placeholder title="Tài khoản & Vé của tôi" />} />
          <Route path="dang-nhap" element={<Placeholder title="Đăng nhập" />} />
        </Route>

        {/* Luồng Admin (Quản trị viên) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Placeholder title="Tổng quan kinh doanh" />} />
          <Route path="phim" element={<Placeholder title="Quản lý phim" />} />
          <Route path="phong-chieu" element={<PhongChieu />} />
          <Route path="suat-chieu" element={<Placeholder title="Quản lý suất chiếu" />} />
          <Route path="don-hang" element={<Placeholder title="Quản lý vé & đơn hàng" />} />
          <Route path="nhan-vien" element={<Placeholder title="Quản lý nhân viên" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App