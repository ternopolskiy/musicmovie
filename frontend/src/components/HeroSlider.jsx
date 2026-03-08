import { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import './HeroSlider.css'

const slides = [
  {
    image: 'https://icdn.lenta.ru/images/2026/03/05/16/20260305163038491/preview_e4408e4ab24864d36f8679f7646b5978.jpg',
    title: 'Музыка и кино в одном месте',
    subtitle: 'Откройте для себя саундтреки к любимым фильмам',
  },
  {
    image: 'https://avatars.mds.yandex.net/get-afishanew/4768735/8c1ea059febeb2f5549bf85eb090a466/960x690_noncrop',
    title: 'Тысячи фильмов и треков',
    subtitle: 'Найдите то, что вдохновляет вас',
  },
  {
    image: 'https://irecommend.ru/sites/default/files/imagecache/copyright1/user-images/218992/8q1lcPK8B8fGxoMPbLbsg.jpg',
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
