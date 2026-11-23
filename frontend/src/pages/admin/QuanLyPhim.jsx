import { useState, useEffect } from 'react'
import './QuanLyPhim.css'

const API_URL = import.meta.env.VITE_API_URL || 'https://ahcinema.click/public/api'

const TRANG_THAI_LABEL = {
  dang_chieu: 'Đang chiếu',
  sap_chieu: 'Sắp chiếu',
  ngung_chieu: 'Ngừng chiếu',
}

const INITIAL_FORM = {
  tieu_de: '',
  mo_ta: '',
  thoi_luong: 120,
  ngay_cong_chieu: '',
  link_trailer: '',
  trang_thai: 'dang_chieu',
}


function QuanLyPhim() {
const [posterFile, setPosterFile] = useState(null)
const [posterPreview, setPosterPreview] = useState('')
  const [dsPhim, setDsPhim] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [errorMsg, setErrorMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)


  const getTodayString = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const today = getTodayString()
  const fetchPhim = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/phim`)
      const data = await res.json()
      setDsPhim(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Lỗi tải danh sách phim:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPhim()
  }, [])

  const openAddModal = () => {
    setEditingId(null)
    setFormData(INITIAL_FORM)
    setPosterFile(null)
    setPosterPreview('')
    setErrorMsg('')
    setShowModal(true)
  }

  const openEditModal = (phim) => {
    setEditingId(phim.id)
    setFormData({
      tieu_de: phim.tieu_de || '',
      mo_ta: phim.mo_ta || '',
      thoi_luong: phim.thoi_luong || 120,
      ngay_cong_chieu: phim.ngay_cong_chieu || '',
      link_trailer: phim.link_trailer || '',
      trang_thai: phim.trang_thai || 'dang_chieu',
    })
    setPosterFile(null)
    setPosterPreview(phim.anh_poster || '')
    setErrorMsg('')
    setShowModal(true)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPosterFile(file)
      setPosterPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSubmitting(true)

    try {
      const payload = new FormData()
      payload.append('tieu_de', formData.tieu_de)
      payload.append('mo_ta', formData.mo_ta || '')
      payload.append('thoi_luong', formData.thoi_luong)
      payload.append('ngay_cong_chieu', formData.ngay_cong_chieu || '')
      payload.append('link_trailer', formData.link_trailer || '')
      payload.append('trang_thai', formData.trang_thai)

      if (posterFile) {
        payload.append('anh_poster', posterFile)
      }

      if (editingId) {
        payload.append('_method', 'PUT')
      }

      const url = editingId ? `${API_URL}/phim/${editingId}` : `${API_URL}/phim`

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: payload,
      })

      const data = await res.json()
      if (!res.ok) {
        const firstError = data.errors
          ? Object.values(data.errors)[0][0]
          : data.message || 'Có lỗi xảy ra khi lưu phim'
        setErrorMsg(firstError)
        return
      }

      setShowModal(false)
      fetchPhim()
    } catch (err) {
      setErrorMsg('Không thể kết nối tới máy chủ Backend')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (phim) => {
    if (!window.confirm(`Bạn có chắc muốn xóa phim "${phim.tieu_de}"?`)) return

    try {
      const res = await fetch(`${API_URL}/phim/${phim.id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setDsPhim((prev) => prev.filter((item) => item.id !== phim.id))
      }
    } catch (err) {
      alert('Lỗi khi xóa phim!')
    }
  }

  const filteredPhim = dsPhim.filter((p) => {
    const matchName = p.tieu_de.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus ? p.trang_thai === filterStatus : true
    return matchName && matchStatus
  })

  return (
    <div className="qlp-container">
      <div className="qlp-header">
        <div>
          <h1 className="qlp-title">Quản lý phim</h1>
          <p className="qlp-subtitle">Thêm, chỉnh sửa thông tin và trạng thái công chiếu</p>
        </div>
        <button className="qlp-btn-add" onClick={openAddModal}>
          + Thêm phim mới
        </button>
      </div>

      <div className="qlp-toolbar">
        <input
          type="text"
          className="qlp-search"
          placeholder="Tìm theo tên phim..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="qlp-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="dang_chieu">Đang chiếu</option>
          <option value="sap_chieu">Sắp chiếu</option>
          <option value="ngung_chieu">Ngừng chiếu</option>
        </select>
      </div>

      <div className="qlp-table-wrap">
        <table className="qlp-table">
          <thead>
            <tr>
              <th>Phim</th>
              <th>Thời lượng</th>
              <th>Ngày công chiếu</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="qlp-empty">
                  Đang tải danh sách phim...
                </td>
              </tr>
            ) : filteredPhim.length === 0 ? (
              <tr>
                <td colSpan="5" className="qlp-empty">
                  Chưa có phim nào. Bấm "+ Thêm phim mới" để tạo dữ liệu.
                </td>
              </tr>
            ) : (
              filteredPhim.map((phim) => (
                <tr key={phim.id}>
                  <td>
                    <div className="qlp-movie-cell">
                      <img
                        src={phim.anh_poster || '/images/godzilla.jpg'}
                        alt={phim.tieu_de}
                        className="qlp-poster-thumb"
                      />
                      <div>
                        <div className="qlp-movie-name">{phim.tieu_de}</div>
                        <div className="qlp-movie-desc">{phim.mo_ta || 'Chưa có mô tả'}</div>
                      </div>
                    </div>
                  </td>
                  <td>{phim.thoi_luong} phút</td>
                  <td>{phim.ngay_cong_chieu || '—'}</td>
                  <td>
                    <span className={`qlp-badge ${phim.trang_thai}`}>
                      {TRANG_THAI_LABEL[phim.trang_thai] || phim.trang_thai}
                    </span>
                  </td>
                  <td>
                    <div className="qlp-actions">
                      <button className="qlp-btn-edit" onClick={() => openEditModal(phim)}>
                        Sửa
                      </button>
                      <button className="qlp-btn-delete" onClick={() => handleDelete(phim)}>
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="qlp-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="qlp-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="qlp-modal-title">
              {editingId ? 'Chỉnh sửa phim' : 'Thêm phim mới'}
            </h2>

            {errorMsg && <div className="qlp-error">{errorMsg}</div>}

            <form onSubmit={handleSubmit}>
              <div className="qlp-form-group">
                <label>Tên phim *</label>
                <input
                  type="text"
                  required
                  value={formData.tieu_de}
                  onChange={(e) => setFormData({ ...formData, tieu_de: e.target.value })}
                  placeholder="Ví dụ: Godzilla Minus One"
                />
              </div>

              <div className="qlp-form-grid">
                <div className="qlp-form-group">
                  <label>Thời lượng (phút) *</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    required
                    value={formData.thoi_luong}
                    onChange={(e) => setFormData({ ...formData, thoi_luong: e.target.value })}
                  />
                </div>

                <div className="qlp-form-group">
                  <label>Ngày công chiếu</label>
                  <input
                    type="date"
                    min={!editingId ? today : undefined}
                    value={formData.ngay_cong_chieu}
                    onClick={(e) => e.target.showPicker?.()}
                    onChange={(e) =>
                      setFormData({ ...formData, ngay_cong_chieu: e.target.value })
                    }
                  />
                </div>
              </div>

             <div className="qlp-form-grid">
                <div className="qlp-form-group">
                  <label>Ảnh poster (JPG, PNG, WEBP ≤ 2MB)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="qlp-file-input"
                  />
                  {posterPreview && (
                    <div className="qlp-preview-wrap">
                      <img src={posterPreview} alt="Preview" className="qlp-preview-img" />
                    </div>
                  )}
                </div>

                <div className="qlp-form-group">
                  <label>Trạng thái *</label>
                  <select
                    value={formData.trang_thai}
                    onChange={(e) => setFormData({ ...formData, trang_thai: e.target.value })}
                  >
                    <option value="dang_chieu">Đang chiếu</option>
                    <option value="sap_chieu">Sắp chiếu</option>
                    <option value="ngung_chieu">Ngừng chiếu</option>
                  </select>
                </div>
              </div>

              <div className="qlp-form-group">
                <label>Link Trailer (YouTube)</label>
                <input
                  type="text"
                  value={formData.link_trailer}
                  onChange={(e) => setFormData({ ...formData, link_trailer: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div className="qlp-form-group">
                <label>Mô tả nội dung</label>
                <textarea
                  rows="3"
                  value={formData.mo_ta}
                  onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
                  placeholder="Tóm tắt nội dung phim..."
                />
              </div>

              <div className="qlp-modal-footer">
                <button
                  type="button"
                  className="qlp-btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="qlp-btn-save" disabled={submitting}>
                  {submitting ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Thêm phim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuanLyPhim