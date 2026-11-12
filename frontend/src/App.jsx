import { useState, useEffect } from 'react'

function App() {
  const [danhSach, setDanhSach] = useState([])
  const [loading, setLoading] = useState(false)
  
  // State điều khiển việc hiển thị Form hay Bảng
  const [showForm, setShowForm] = useState(false)
  
  const [formData, setFormData] = useState({ ten_phong: '', suc_chua: '', loai_phong: '2D' })
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

  const apiUrl = import.meta.env.VITE_API_URL || 'https://ahcinema.click/public/api'

  // READ (GET)
  const fetchPhongChieu = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/phong_chieu`)
      const data = await res.json()
      setDanhSach(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPhongChieu()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const validateForm = () => {
    if (!formData.ten_phong.trim()) return "Tên phòng không được để trống"
    if (!formData.suc_chua || formData.suc_chua <= 0) return "Sức chứa phải là số lớn hơn 0"
    if (!formData.loai_phong) return "Vui lòng chọn loại phòng"
    return null
  }

  const resetForm = () => {
    setFormData({ ten_phong: '', suc_chua: '', loai_phong: '2D' })
    setEditId(null)
    setError('')
  }

  // Mở form thêm mới
  const handleOpenAdd = () => {
    resetForm()
    setShowForm(true)
  }

  // Mở form cập nhật
  const handleOpenEdit = (phong) => {
    setEditId(phong.id)
    setFormData({
      ten_phong: phong.ten_phong,
      suc_chua: phong.suc_chua,
      loai_phong: phong.loai_phong
    })
    setError('')
    setShowForm(true)
  }

  // Hủy form, quay về trang chính
  const handleCancel = () => {
    setShowForm(false)
    resetForm()
  }

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    
    const method = editId ? 'PUT' : 'POST'
    const url = editId ? `${apiUrl}/phong_chieu/${editId}` : `${apiUrl}/phong_chieu`

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
           ten_phong: formData.ten_phong,
           suc_chua: parseInt(formData.suc_chua),
           loai_phong: formData.loai_phong
        })
      })

      if (!res.ok) throw new Error("Thao tác thất bại. Vui lòng kiểm tra lại hệ thống.")
      
      await fetchPhongChieu()
      setShowForm(false) // Tự động đóng form sau khi lưu thành công
      resetForm()
    } catch (err) {
      setError(err.message)
    }
  }

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phòng chiếu này?")) return

    try {
      const res = await fetch(`${apiUrl}/phong_chieu/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      })
      if (!res.ok) throw new Error("Lỗi hệ thống khi xóa")
      
      fetchPhongChieu()
    } catch (err) {
      alert(err.message)
    }
  }

  // CSS Inline phong cách tối giản
  const styles = {
    container: { maxWidth: '1000px', margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    title: { fontSize: '24px', fontWeight: '600', margin: 0 },
    btnPrimary: { background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '14px', transition: '0.2s' },
    btnSecondary: { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' },
    btnEdit: { background: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', marginRight: '8px' },
    btnDelete: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
    table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    th: { background: '#f8fafc', padding: '14px 16px', textAlign: 'left', fontWeight: '600', fontSize: '14px', borderBottom: '1px solid #e2e8f0', color: '#475569' },
    td: { padding: '14px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '14px' },
    formCard: { background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', maxWidth: '500px', margin: '0 auto' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' },
    input: { width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px', outline: 'none', transition: 'border 0.2s' },
    error: { color: '#dc2626', fontSize: '14px', marginBottom: '16px', background: '#fef2f2', padding: '10px', borderRadius: '6px', border: '1px solid #fecaca' }
  }

  return (
    <div style={styles.container}>
      {showForm ? (
        /* GIAO DIỆN FORM (Chỉ hiện khi bấm Thêm/Sửa) */
        <div style={styles.formCard}>
          <h2 style={{ ...styles.title, marginBottom: '20px', fontSize: '20px',color:"black" }}>
            {editId ? 'Cập nhật phòng chiếu' : 'Thêm phòng chiếu mới'}
          </h2>
          
          {error && <div style={styles.error}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Tên phòng</label>
              <input 
                type="text" 
                name="ten_phong"
                value={formData.ten_phong} 
                onChange={handleInputChange} 
                placeholder="Nhập tên phòng chiếu..."
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Sức chứa (người)</label>
              <input 
                type="number" 
                name="suc_chua"
                value={formData.suc_chua} 
                onChange={handleInputChange} 
                placeholder="Nhập số ghế..."
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Loại phòng</label>
              <select 
                name="loai_phong" 
                value={formData.loai_phong} 
                onChange={handleInputChange}
                style={styles.input}
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
              <button type="submit" style={{ ...styles.btnPrimary, flex: 1 }}>
                {editId ? 'Lưu cập nhật' : 'Thêm mới'}
              </button>
              <button type="button" onClick={handleCancel} style={styles.btnSecondary}>
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* GIAO DIỆN DANH SÁCH (Mặc định) */
        <div>
          <div style={styles.header}>
            <h2 style={styles.title}>Quản lý phòng chiếu</h2>
            <button onClick={handleOpenAdd} style={styles.btnPrimary}>
              + Thêm phòng chiếu
            </button>
          </div>

          {loading ? <p style={{ textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu...</p> : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Tên Phòng</th>
                  <th style={styles.th}>Sức chứa</th>
                  <th style={styles.th}>Loại</th>
                  <th style={styles.th}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {danhSach.length === 0 ? (
                  <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#64748b' }}>Chưa có dữ liệu</td></tr>
                ) : null}
                {danhSach.map(phong => (
                  <tr key={phong.id} style={{ transition: 'background 0.2s' }}>
                    <td style={{ ...styles.td, fontWeight: '500' }}>#{phong.id}</td>
                    <td style={styles.td}>{phong.ten_phong}</td>
                    <td style={styles.td}>{phong.suc_chua} ghế</td>
                    <td style={styles.td}>
                      <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', color: '#475569' }}>
                        {phong.loai_phong}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => handleOpenEdit(phong)} style={styles.btnEdit}>Sửa</button>
                      <button onClick={() => handleDelete(phong.id)} style={styles.btnDelete}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export default App