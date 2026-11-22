import { Link } from 'react-router-dom'
import './Home.css'
import { useState, useEffect } from 'react'

// Dữ liệu mẫu tạm thời (sau khi làm xong API /phim bên Laravel sẽ fetch thay vào đây)
const MOCK_MOVIES = [
  {
    id: 1,
    ten_phim: 'Godzilla Minus One',
    the_loai: 'Hành động • Khoa học viễn tưởng',
    thoi_luong: 125,
    danh_gia: 8.9,
    poster: '/images/Godzilla.jpg',
  },
  {
    id: 2,
    ten_phim: 'Dune: Hành Tinh Cát 2',
    the_loai: 'Phiêu lưu • Viễn tưởng',
    thoi_luong: 166,
    danh_gia: 8.8,
    poster: '/images/Dune2.jpg',
  },
  {
    id: 3,
    ten_phim: 'The Odyssey',
    the_loai: 'Phiêu lưu • Hành động',
    thoi_luong: 180,
    danh_gia: 8.7,
    poster: '/images/Odyssey.jpg',
  },
  {
    id: 4,
    ten_phim: 'Spider-Man: Across the Spider-Verse',
    the_loai: 'Hoạt hình • Hành động',
    thoi_luong: 140,
    danh_gia: 9.0,
    poster: '/images/SpiderVerse.jpg',
  },
  {
    id: 5,
    ten_phim: 'Interstellar',
    the_loai: 'Khoa học viễn tưởng',
    thoi_luong: 169,
    danh_gia: 9.1,
    poster: '/images/Interstellar.jpg',
  },
]

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? MOCK_MOVIES.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === MOCK_MOVIES.length - 1 ? 0 : prev + 1))
  }

  // Tự động chuyển poster mỗi 5 giây (reset lại bộ đếm mỗi khi bạn bấm nút)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === MOCK_MOVIES.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(timer)
  }, [currentIndex])

  const featured = MOCK_MOVIES[currentIndex]

  return (
    <div className="home-container">
      {/* Banner phim nổi bật (Slider) */}
      <section className="home-hero">
        <img
          key={featured.id}
          src={featured.poster}
          alt={featured.ten_phim}
          className="home-hero-bg"
        />
        <div className="home-hero-overlay" />

        {/* Nút chuyển trái / phải */}
        <button
          onClick={handlePrev}
          className="home-hero-nav prev"
          aria-label="Phim trước"
        >
          ‹
        </button>
        <button
          onClick={handleNext}
          className="home-hero-nav next"
          aria-label="Phim tiếp theo"
        >
          ›
        </button>

        <div className="home-hero-content">
          <span className="home-hero-tag">PHIM NỔI BẬT • IMAX / 2D</span>
          <h1 className="home-hero-title">{featured.ten_phim}</h1>
          <p className="home-hero-desc">
            {featured.the_loai} • {featured.thoi_luong} phút. Đặt vé trực tuyến nhanh chóng, chọn ghế
            VIP theo thời gian thực tại AHCinema.
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

        {/* Chấm chỉ báo (Dots) ở góc dưới */}
        <div className="home-hero-dots">
          {MOCK_MOVIES.map((phim, index) => (
            <button
              key={phim.id}
              onClick={() => setCurrentIndex(index)}
              className={`home-hero-dot ${index === currentIndex ? 'active' : ''}`}
              aria-label={`Chọn ${phim.ten_phim}`}
            />
          ))}
        </div>
      </section>

      {/* Danh sách phim đang chiếu (giữ nguyên) */}
      <section>
        <div className="home-section-header">
          <h2 className="home-section-title">Phim đang chiếu</h2>
          <Link to="/phim" className="home-view-all">
            Xem thêm →
          </Link>
        </div>

        <div className="home-movie-grid">
          {MOCK_MOVIES.map((phim) => (
            <div key={phim.id} className="home-movie-card">
              <div className="home-poster-wrap">
                <img src={phim.poster} alt={phim.ten_phim} className="home-poster" />
                <span className="home-rating-badge">★ {phim.danh_gia}</span>
              </div>

              <div className="home-movie-info">
                <div>
                  <h3 className="home-movie-title">{phim.ten_phim}</h3>
                  <div className="home-movie-meta">
                    {phim.the_loai} • {phim.thoi_luong}p
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