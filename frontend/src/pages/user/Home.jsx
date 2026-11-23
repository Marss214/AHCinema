import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const API_URL = import.meta.env.VITE_API_URL || 'https://ahcinema.click/public/api'

function Home() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(`${API_URL}/phim?trang_thai=dang_chieu`)
        const data = await res.json()
        setMovies(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Lỗi tải phim trang chủ:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMovies()
  }, [])

  const handlePrev = () => {
    if (movies.length === 0) return
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1))
  }

  const handleNext = () => {
    if (movies.length === 0) return
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1))
  }

  useEffect(() => {
    if (movies.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [currentIndex, movies.length])

  if (loading) {
    return (
      <div className="home-container" style={{ textAlign: 'center', padding: '80px 24px', color: '#94a3b8' }}>
        Đang tải danh sách phim...
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="home-container" style={{ textAlign: 'center', padding: '80px 24px', color: '#94a3b8' }}>
        <h2 style={{ color: '#f8fafc', marginBottom: '8px' }}>Chưa có phim đang chiếu</h2>
        <p>Hãy vào trang Admin → Quản lý phim để thêm phim mới.</p>
      </div>
    )
  }

  const featured = movies[currentIndex] || movies[0]

  return (
    <div className="home-container">
      {/* Banner phim nổi bật (Slider) */}
      <section className="home-hero">
        <img
          key={featured.id}
          src={featured.anh_poster || '/images/godzilla.jpg'}
          alt={featured.tieu_de}
          className="home-hero-bg"
        />
        <div className="home-hero-overlay" />

        {movies.length > 1 && (
          <>
            <button onClick={handlePrev} className="home-hero-nav prev" aria-label="Phim trước">
              ‹
            </button>
            <button onClick={handleNext} className="home-hero-nav next" aria-label="Phim tiếp theo">
              ›
            </button>
          </>
        )}

        <div className="home-hero-content">
          <span className="home-hero-tag">PHIM ĐANG CHIẾU • {featured.thoi_luong} PHÚT</span>
          <h1 className="home-hero-title">{featured.tieu_de}</h1>
          <p className="home-hero-desc">
            {featured.mo_ta ||
              'Đặt vé trực tuyến nhanh chóng, chọn ghế VIP theo thời gian thực tại AHCinema.'}
          </p>
          <div className="home-hero-actions">
            <Link to={`/phim/${featured.id}`} className="home-btn-book">
              Đặt vé ngay
            </Link>
            <Link to="/phim" className="home-btn-detail">
              Xem tất cả phim
            </Link>
          </div>
        </div>

        {movies.length > 1 && (
          <div className="home-hero-dots">
            {movies.map((phim, index) => (
              <button
                key={phim.id}
                onClick={() => setCurrentIndex(index)}
                className={`home-hero-dot ${index === currentIndex ? 'active' : ''}`}
                aria-label={`Chọn ${phim.tieu_de}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Danh sách phim đang chiếu */}
      <section>
        <div className="home-section-header">
          <h2 className="home-section-title">Phim đang chiếu</h2>
          <Link to="/phim" className="home-view-all">
            Xem thêm →
          </Link>
        </div>

        <div className="home-movie-grid">
          {movies.map((phim) => (
            <div key={phim.id} className="home-movie-card">
              <div className="home-poster-wrap">
                <img
                  src={phim.anh_poster || '/images/godzilla.jpg'}
                  alt={phim.tieu_de}
                  className="home-poster"
                />
                <span className="home-rating-badge">{phim.thoi_luong}p</span>
              </div>

              <div className="home-movie-info">
                <div>
                  <h3 className="home-movie-title">{phim.tieu_de}</h3>
                  <div className="home-movie-meta">
                    Khởi chiếu: {phim.ngay_cong_chieu || 'Đang cập nhật'}
                  </div>
                </div>

                <Link to={`/phim/${phim.id}`} style={{ textDecoration: 'none' }}>
                  <button className="home-card-btn">Đặt vé</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home