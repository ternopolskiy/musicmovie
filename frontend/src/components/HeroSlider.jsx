import { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import './HeroSlider.css'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920',
    title: 'Музыка и кино в одном месте',
    subtitle: 'Откройте для себя саундтреки к любимым фильмам',
  },
  {
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920',
    title: 'Тысячи фильмов и треков',
    subtitle: 'Найдите то, что вдохновляет вас',
  },
  {
    image: 'https://images.unsplash.com/photo-1517604931442-71053e3e2c28?w=1920',
    title: 'Сообщество единомышленников',
    subtitle: 'Обсуждайте и делитесь своими впечатлениями',
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index) => setCurrent(index)

  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length)

  return (
    <div className="hero-slider">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`hero-slider__slide ${index === current ? 'hero-slider__slide--active' : ''}`}
        >
          <div className="hero-slider__image">
            <img src={slide.image} alt={slide.title} />
            <div className="hero-slider__overlay" />
          </div>
          <div className="hero-slider__content">
            <h1 className="hero-slider__title">{slide.title}</h1>
            <p className="hero-slider__subtitle">{slide.subtitle}</p>
          </div>
        </div>
      ))}

      <button className="hero-slider__nav hero-slider__nav--prev" onClick={prevSlide}>
        <FiChevronLeft size={32} />
      </button>
      <button className="hero-slider__nav hero-slider__nav--next" onClick={nextSlide}>
        <FiChevronRight size={32} />
      </button>

      <div className="hero-slider__dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-slider__dot ${index === current ? 'hero-slider__dot--active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
