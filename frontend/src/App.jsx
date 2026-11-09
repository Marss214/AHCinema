import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  // Lấy đường dẫn API từ biến môi trường (hoặc fix cứng để test)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://ahcinema.click/api'

  useEffect(() => {
    // Gọi thử API lấy danh sách phòng chiếu (GET)
    fetch(`${apiUrl}/phong_chieu`)
      .then(res => {
        if (!res.ok) throw new Error('Lỗi mạng hoặc CORS')
        return res.json()
      })
      .then(result => setData(result))
      .catch(err => setError(err.message))
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>🎬 Test Kết Nối AHCinema</h2>
      <p><strong>Trạng thái:</strong> {data ? '🟢 Đã kết nối thành công!' : (error ? '🔴 Lỗi kết nối' : '🟡 Đang tải...')}</p>
      
      {error && <p style={{ color: 'red' }}>Chi tiết lỗi: {error}</p>}
      
      {data && (
        <div style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default App