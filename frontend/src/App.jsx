import { useState, useEffect } from 'react'

function App() {
  const [danhSach, setDanhSach] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Lấy URL từ biến môi trường Vercel (hoặc test local)
  const apiUrl = import.meta.env.VITE_API_URL || 'https://ahcinema.click/api'

  // 1. READ (GET) - Lấy danh sách phòng
  const fetchPhongChieu = () => {
    setLoading(true)
    fetch(`${apiUrl}/phong_chieu`)
      .then(res => res.json())
      .then(data => {
        // Xử lý cả trường hợp Laravel trả về array trực tiếp hoặc bọc trong object 'data'
        setDanhSach(Array.isArray(data) ? data : data.data || [])
        setLoading(false)
      })
      .catch(err => console.error("Lỗi lấy dữ liệu:", err))
  }

  // Chạy lần đầu khi load trang
  useEffect(() => {
    fetchPhongChieu()
  }, [])

  // 2. CREATE (POST) - Thêm phòng mới ngẫu nhiên
  const handleCreate = () => {
    const newRoom = {
      ten_phong: `Phòng Test ${Math.floor(Math.random() * 100)}`,
      suc_chua: 50,
      loai_phong: '2D'
    }

    fetch(`${apiUrl}/phong_chieu`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json' 
      },
      body: JSON.stringify(newRoom)
    })
    .then(res => res.json())
    .then(() => fetchPhongChieu()) // Load lại danh sách sau khi thêm
    .catch(err => alert("Lỗi thêm: " + err.message))
  }

  // 3. UPDATE (PUT/PATCH) - Cập nhật tên phòng
  const handleUpdate = (id) => {
    const updatedData = {
      ten_phong: `Phòng VIP (Updated)`
    }

    fetch(`${apiUrl}/phong_chieu/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })
    .then(res => res.json())
    .then(() => fetchPhongChieu()) // Load lại danh sách
    .catch(err => alert("Lỗi sửa: " + err.message))
  }

  // 4. DELETE (DELETE) - Xóa phòng
  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa phòng này?")) return;

    fetch(`${apiUrl}/phong_chieu/${id}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' }
    })
    .then(() => fetchPhongChieu()) // Load lại danh sách
    .catch(err => alert("Lỗi xóa: " + err.message))
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>🎬 TEST FULL CRUD - AHCINEMA</h2>
      
      <button 
        onClick={handleCreate} 
        style={{ padding: '10px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', marginBottom: '15px', cursor: 'pointer' }}
      >
        ➕ Thêm Phòng Mới (CREATE)
      </button>
      
      {loading ? <p>Đang tải dữ liệu...</p> : (
        <table border="1" width="100%" cellPadding="10" style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th>ID</th>
              <th>Tên Phòng</th>
              <th>Sức chứa</th>
              <th>Loại</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {danhSach.length === 0 ? <tr><td colSpan="5" style={{textAlign: 'center'}}>Chưa có dữ liệu</td></tr> : null}
            {danhSach.map(phong => (
              <tr key={phong.id}>
                <td>{phong.id}</td>
                <td>{phong.ten_phong}</td>
                <td>{phong.suc_chua}</td>
                <td>{phong.loai_phong}</td>
                <td>
                  <button onClick={() => handleUpdate(phong.id)} style={{ marginRight: '10px', padding: '5px', cursor: 'pointer' }}>✏️ Sửa</button>
                  <button onClick={() => handleDelete(phong.id)} style={{ color: 'red', padding: '5px', cursor: 'pointer' }}>🗑️ Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App