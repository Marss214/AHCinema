import { useState, useEffect } from 'react'
import './PhongChieu.css'

function PhongChieu() {
  const [danhSach, setDanhSach] = useState([])
  const [selectedPhong, setSelectedPhong] = useState(null)
  const [loading, setLoading] = useState(false)

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ ten_phong: '', suc_chua: '', loai_phong: '2D' })
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

  const apiUrl = import.meta.env.VITE_API_URL || 'https://ahcinema.click/public/api'

  const fetchPhongChieu = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/phong_chieu`)
      const data = await res.json()
      const list = Array.isArray(data) ? data : data.data || []
      setDanhSach(list)

      if (list.length > 0) {
        setSelectedPhong((prev) => {
          const found = prev ? list.find((p) => p.id === prev.id) : null
          return found || list[0]
        })
      } else {
        setSelectedPhong(null)
      }
    } catch (err) {
      console.error('Lỗi lấy dữ liệu:', err)
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
    if (!formData.ten_phong.trim()) return 'Tên phòng không được để trống'
    if (!formData.suc_chua || formData.suc_chua <= 0) return 'Sức chứa phải là số lớn hơn 0'
    if (!formData.loai_phong) return 'Vui lòng chọn loại phòng'
    return null
  }

  const resetForm = () => {
    setFormData({ ten_phong: '', suc_chua: '', loai_phong: '2D' })
    setEditId(null)
    setError('')
  }

  const handleOpenAdd = () => {
    resetForm()
    setShowForm(true)
  }

  const handleOpenEdit = (e, phong) => {
    e.stopPropagation()
    setEditId(phong.id)
    setFormData({
      ten_phong: phong.ten_phong,
      suc_chua: phong.suc_chua,
      loai_phong: phong.loai_phong,
    })
    setError('')
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    resetForm()
  }

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
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ten_phong: formData.ten_phong,
          suc_chua: parseInt(formData.suc_chua),
          loai_phong: formData.loai_phong,
        }),
      })

      const responseData = await res.json()

      if (!res.ok) {
        if (res.status === 422 && responseData.errors) {
          const thongBaoLoi = Object.values(responseData.errors)[0][0]
          throw new Error(thongBaoLoi)
        }
        throw new Error(responseData.message || 'Thao tác thất bại. Vui lòng kiểm tra lại.')
      }

      await fetchPhongChieu()
      setShowForm(false)
      resetForm()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Bạn có chắc chắn muốn xóa phòng chiếu này?')) return

    try {
      const res = await fetch(`${apiUrl}/phong_chieu/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error('Lỗi hệ thống khi xóa')
      fetchPhongChieu()
    } catch (err) {
      alert(err.message)
    }
  }

  const renderSeatMap = (sucChua) => {
    const GHE_MOI_HANG = 10
    const tongSoGhe = Math.min(sucChua || 0, 500)
    const soHang = Math.ceil(tongSoGhe / GHE_MOI_HANG)
    const bangChuCai = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    const seats = []
    let dem = 0

    for (let i = 0; i < soHang; i++) {
      const tenHang = bangChuCai[i] || `R${i + 1}`
      const isVip = soHang >= 3 && i >= soHang - 2

      for (let j = 1; j <= GHE_MOI_HANG; j++) {
        if (dem < tongSoGhe) {
          seats.push({ id: `${tenHang}${j}`, isVip })
          dem++
        }
      }
    }

    return seats
  }

  return (
    <div className="pc-container">
      <div className="pc-header">
        <div>
          <h2 className="pc-title">Thiết lập phòng & ghế</h2>
          <p className="pc-subtitle">Chọn một phòng bên dưới để xem trước sơ đồ ghế</p>
        </div>
        <button onClick={handleOpenAdd} className="pc-btn-primary">
          + Thêm phòng chiếu
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Đang tải dữ liệu...</p>
      ) : danhSach.length === 0 ? (
        <div className="pc-empty-box">Chưa có phòng chiếu nào. Hãy bấm "+ Thêm phòng chiếu".</div>
      ) : (
        <div className="pc-card-grid">
          {danhSach.map((phong) => {
            const isSelected = selectedPhong?.id === phong.id
            return (
              <div
                key={phong.id}
                onClick={() => setSelectedPhong(phong)}
                className={`pc-room-card ${isSelected ? 'selected' : ''}`}
              >
                <div className="pc-card-top">
                  <div>
                    <h3 className="pc-room-name">{phong.ten_phong}</h3>
                    <span className="pc-room-meta">
                      #{phong.id} • {phong.suc_chua} ghế
                    </span>
                  </div>
                  <span className="pc-type-badge">{phong.loai_phong}</span>
                </div>

                <div className="pc-card-actions">
                  <button onClick={(e) => handleOpenEdit(e, phong)} className="pc-btn-action">
                    Sửa
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, phong.id)}
                    className="pc-btn-action delete"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedPhong && (
        <div className="pc-seat-preview">
          <div className="pc-preview-header">
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#f8fafc' }}>
                Sơ đồ ghế: {selectedPhong.ten_phong} ({selectedPhong.loai_phong})
              </h3>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                Tổng sức chứa: {selectedPhong.suc_chua} ghế
              </span>
            </div>

            <div className="pc-legend">
              <div className="pc-legend-item">
                <span className="pc-legend-dot regular"></span>
                Ghế thường
              </div>
              <div className="pc-legend-item">
                <span className="pc-legend-dot vip"></span>
                Ghế VIP
              </div>
            </div>
          </div>

          <div className="pc-screen">MÀN HÌNH CHIẾU</div>

          <div className="pc-seat-grid">
            {renderSeatMap(selectedPhong.suc_chua).map((seat) => (
              <div
                key={seat.id}
                title={`Ghế ${seat.id} (${seat.isVip ? 'VIP' : 'Thường'})`}
                className={`pc-seat ${seat.isVip ? 'vip' : ''}`}
              >
                {seat.id}
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="pc-modal-overlay">
          <div className="pc-modal-card">
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#f8fafc' }}>
              {editId ? 'Cập nhật phòng chiếu' : 'Thêm phòng chiếu mới'}
            </h3>

            {error && <div className="pc-error-box">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="pc-form-group">
                <label className="pc-label">Tên phòng</label>
                <input
                  type="text"
                  name="ten_phong"
                  value={formData.ten_phong}
                  onChange={handleInputChange}
                  placeholder="VD: Phòng 01, Phòng IMAX..."
                  className="pc-input"
                />
              </div>

              <div className="pc-form-group">
                <label className="pc-label">Sức chứa (số ghế)</label>
                <input
                  type="number"
                  name="suc_chua"
                  value={formData.suc_chua}
                  onChange={handleInputChange}
                  placeholder="2D: 50-300 | 3D: 30-100 | IMAX: 200-500"
                  className="pc-input"
                />
              </div>

              <div className="pc-form-group">
                <label className="pc-label">Loại phòng</label>
                <select
                  name="loai_phong"
                  value={formData.loai_phong}
                  onChange={handleInputChange}
                  className="pc-input"
                >
                  <option value="2D">2D</option>
                  <option value="3D">3D</option>
                  <option value="IMAX">IMAX</option>
                </select>
              </div>

              <div className="pc-modal-actions">
                <button type="submit" className="pc-btn-primary" style={{ flex: 1 }}>
                  {editId ? 'Lưu cập nhật' : 'Thêm mới'}
                </button>
                <button type="button" onClick={handleCancel} className="pc-btn-secondary">
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PhongChieu