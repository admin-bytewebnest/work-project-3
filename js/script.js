const categoriesItem = document.querySelectorAll(".categories__item")
categoriesItem.forEach(box => {
  box.addEventListener("mouseenter", () => {
    void box.offsetWidth
    box.classList.add("active")
  })
})
categoriesItem.forEach(box => {
  box.addEventListener("mouseleave", () => {
    box.classList.remove("active")
  })
})
function initSlider(sliderSelector, slideSelector) {
  const sliders = document.querySelectorAll(sliderSelector)
  sliders.forEach(slider => {
    const track = slider.querySelector("[class$='__track']")
    const prevBtn = slider.querySelector("[class$='__btn-prevent']")
    const nextBtn = slider.querySelector("[class$='__btn-next']")

    if (!track || !prevBtn || !nextBtn) return
    const originalSlides = [...track.querySelectorAll(slideSelector)]

    if (originalSlides.length === 0) return
    const slidesCount = originalSlides.length
    const cloneSets = 2
    const positionsWrapper = slider.querySelector("[class$='__positions']")
    const positions = positionsWrapper ? [...positionsWrapper.querySelectorAll("[class$='__position']")] : []

    for (let i = 0; i < cloneSets; i++) {
      originalSlides
        .slice()
        .reverse()
        .forEach(slide => {
          track.prepend(slide.cloneNode(true))
        })
    }

    for (let i = 0; i < cloneSets; i++) {
      originalSlides.forEach(slide => {
        track.append(slide.cloneNode(true))
      })
    }

    const slides = [...track.querySelectorAll(slideSelector)]

    let currentIndex = slidesCount * cloneSets
    let isAnimating = false

    function updatePositions() {
      if (!positions.length) return
      const positionIndex = currentIndex % slidesCount
      positions.forEach(position => {
        position.classList.remove("active")
      })

      if (positions[positionIndex]) {
        positions[positionIndex].classList.add("active")
      }
    }

    function getSlideWidth() {
      const slideWidth = slides[0].getBoundingClientRect().width
      const styles = window.getComputedStyle(track)
      const gap = parseFloat(styles.columnGap) || parseFloat(styles.gap) || 0
      return slideWidth + gap
    }

    function updateSlider(animate = true) {
      track.style.transition = animate ? "transform .7s ease-in-out" : "none"
      track.style.transform = `translateX(-${currentIndex * getSlideWidth()}px)`
      updatePositions()
    }

    nextBtn.addEventListener("click", () => {
      if (isAnimating) return
      isAnimating = true
      currentIndex++
      updateSlider()
    })

    prevBtn.addEventListener("click", () => {
      if (isAnimating) return
      isAnimating = true
      currentIndex--
      updateSlider()
    })

    track.addEventListener("transitionend", () => {
      if (currentIndex >= slidesCount * (cloneSets + 1)) {
        currentIndex -= slidesCount
        updateSlider(false)
      }

      if (currentIndex < slidesCount * cloneSets) {
        currentIndex += slidesCount
        updateSlider(false)
      }
      isAnimating = false
    })

    updateSlider(false)

    window.addEventListener("resize", () => updateSlider(false))
  })
}
initSlider(".bestsellers-slider", ".bestsellers-cards")

initSlider(".categories-slider", ".categories__item")

initSlider(".blog-slider", ".blog__item")

initSlider(".hookahs-slider", ".hookahs-cards--tablet")

const paginationButtons = document.querySelectorAll(".pagination__item")
const hookahsSections = document.querySelectorAll(".hookahs")
paginationButtons.forEach(button => {
  button.addEventListener("click", () => {
    const page = button.dataset.page
    hookahsSections.forEach(section => {
      const desktopItems = section.querySelectorAll(".hookahs-cards--desktop .hookahs-cards__item")
      const mobileSlides = section.querySelectorAll(".hookahs-slider .hookahs-cards--tablet")
      const hookahsSlider = section.querySelector(".hookahs-slider")

      desktopItems.forEach(item => {
        if (item.dataset.page === page) {
          item.style.display = ""
        } else {
          item.style.display = "none"
        }
      })

      mobileSlides.forEach(slide => {
        const item = slide.querySelector(".hookahs-cards__item")
        if (item && item.dataset.page === page) {
          slide.style.display = ""
        } else {
          slide.style.display = "none"
        }
      })

      const hasDesktopCards = [...desktopItems].some(item => {
        return item.dataset.page === page
      })

      const hasMobileCards = [...mobileSlides].some(slide => {
        const item = slide.querySelector(".hookahs-cards__item")
        return item && item.dataset.page === page
      })

      const hasCards = hasDesktopCards || hasMobileCards
      if (hasCards) {
        section.style.display = ""
      } else {
        section.style.display = "none"
      }

      if (hookahsSlider) {
        const prevButton = hookahsSlider.querySelector(".hookahs-slider__btn-prevent")
        const nextButton = hookahsSlider.querySelector(".hookahs-slider__btn-next")
        const positions = hookahsSlider.querySelector(".hookahs-slider__positions")
        if (hasCards) {
          if (prevButton) {
            prevButton.style.display = ""
          }
          if (nextButton) {
            nextButton.style.display = ""
          }
          if (positions) {
            positions.style.display = ""
          }
        } else {
          if (prevButton) {
            prevButton.style.display = "none"
          }
          if (nextButton) {
            nextButton.style.display = "none"
          }
          if (positions) {
            positions.style.display = "none"
          }
        }
      }
    })

    paginationButtons.forEach(button => {
      button.classList.remove("active")
    })
    button.classList.add("active")

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })
})

const firstPageButton = document.querySelector('.pagination__item[data-page="1"]')
if (firstPageButton) {
  firstPageButton.click()
}

//Находим все карточки
const cards = document.querySelectorAll(".hookahs-cards__item, .bestsellers-cards__item")

//Раздел каталог
//Переберем все карточки

cards.forEach(card => {
  //Ждем пока кто-то нажмет кнопку по карточке
  card.addEventListener("click", () => {
    //Находим данные которые у карточек
    const title = card.querySelector("[data-title]")
    const price = card.querySelector("[data-price]")
    const image = card.querySelector("[data-images]")

    //Создаем объект с данными товара
    const product = {
      title: title.dataset.title,
      price: price.dataset.price,
      image: image.dataset.images,
    }

    //Сохраняем в sessionStorage
    sessionStorage.setItem("product", JSON.stringify(product))

    //Переход на страницу Товара
    window.location.href = "../html/product-details.html"
  })
})
;(() => {
  const settings = {
    ease: 0.075,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  }

  let currentScroll = window.scrollY
  let targetScroll = window.scrollY

  const clamp = (value, min, max) => {
    return Math.max(min, Math.min(value, max))
  }

  const getMaxScroll = () => {
    return document.documentElement.scrollHeight - window.innerHeight
  }

  window.addEventListener(
    "wheel",
    event => {
      event.preventDefault()

      targetScroll += event.deltaY * settings.wheelMultiplier

      targetScroll = clamp(targetScroll, 0, getMaxScroll())
    },
    {
      passive: false,
    },
  )

  const smoothScroll = () => {
    currentScroll += (targetScroll - currentScroll) * settings.ease

    if (Math.abs(targetScroll - currentScroll) < 0.05) {
      currentScroll = targetScroll
    }

    window.scrollTo(0, currentScroll)

    requestAnimationFrame(smoothScroll)
  }

  window.addEventListener("scroll", () => {
    if (Math.abs(window.scrollY - currentScroll) > 2) {
      currentScroll = window.scrollY
      targetScroll = window.scrollY
    }
  })

  window.addEventListener("resize", () => {
    targetScroll = clamp(targetScroll, 0, getMaxScroll())
  })

  smoothScroll();
})();

document.body.style.scrollbarWidth = 'none';

// Поставить видео на паузу, чтоб запустить убрать нижние строчки 2
const video = document.querySelector('video');
video.pause();
