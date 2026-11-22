import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import PhongChieu from './pages/admin/PhongChieu'

// Component tạm cho các trang chưa làm
const Placeholder = ({ title }) => (
  <div style={{ color: '#94a3b8' }}>
    <h2 style={{ color: '#fff', marginBottom: '8px' }}>{title}</h2>
    <p>Tính năng đang được phát triển...</p>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tạm thời vào thẳng Admin để dev */}
        <Route path="/" element={<Navigate to="/admin/phong-chieu" replace />} />

        {/* Luồng Admin */}
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