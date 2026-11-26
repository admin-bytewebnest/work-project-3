;(() => {
  const basketContainer = document.querySelector(".basket-cards")
  const subtotalPrice = document.querySelector(".subtotal-price")

  // Этот скрипт нужен только на странице корзины
  if (!basketContainer || !subtotalPrice) return

  function getCart() {
    try {
      const cart = JSON.parse(localStorage.getItem("basket") || "[]")
      return Array.isArray(cart) ? cart : []
    } catch {
      return []
    }
  }

  function saveCart(cart) {
    localStorage.setItem("basket", JSON.stringify(cart))
  }

  function formatPrice(value) {
    return `${value.toLocaleString("uk-UA")} ₴`
  }

  // Создаём одну карточку товара
  function createCard(product, index) {
    const track = document.createElement("div")
    track.className = "basket-cards__track"
    track.dataset.index = index

    const imageColumn = document.createElement("div")
    imageColumn.className = "basket-cards__image"

    const imageCard = document.createElement("div")
    imageCard.className = "basket-cards__card"

    const image = document.createElement("img")
    image.className = "basket-cards__img"
    image.src = product.image
    image.alt = product.title
    image.dataset.images = product.image

    imageCard.append(image)
    imageColumn.append(imageCard)

    const title = document.createElement("h2")
    title.className = "basket-cards__title"
    title.textContent = product.title

    const unitPrice = document.createElement("p")
    unitPrice.className = "basket-cards__price"
    unitPrice.textContent = formatPrice(product.price)

    const quantityColumn = document.createElement("div")
    quantityColumn.className = "basket-cards__quantity"

    const calculator = document.createElement("div")
    calculator.className = "basket-cards__calc details-calc"

    const inputWrapper = document.createElement("div")
    inputWrapper.className = "details-calc__item"

    const input = document.createElement("input")
    input.className = "details-calc__number"
    input.type = "text"
    input.inputMode = "numeric"
    input.value = product.quantity
    input.setAttribute("aria-label", "Количество товара")

    inputWrapper.append(input)

    const minus = document.createElement("div")
    minus.className = "details-calc__item"
    minus.textContent = "−"
    minus.setAttribute("role", "button")
    minus.setAttribute("tabindex", "0")
    minus.setAttribute("aria-label", "Уменьшить количество")

    const plus = document.createElement("div")
    plus.className = "details-calc__item"
    plus.textContent = "+"
    plus.setAttribute("role", "button")
    plus.setAttribute("tabindex", "0")
    plus.setAttribute("aria-label", "Увеличить количество")

    calculator.append(inputWrapper, minus, plus)
    quantityColumn.append(calculator)

    const totalColumn = document.createElement("div")
    totalColumn.className = "basket-cards__total"

    const totalPrice = document.createElement("p")
    totalPrice.className = "basket-cards__price basket-cards__price--close"

    // Цена отображается только при ширине больше 640px
    if (window.matchMedia("(min-width: 641px)").matches) {
      totalPrice.append(document.createTextNode(formatPrice(product.price * product.quantity)))
    }

    const removeButton = document.createElement("span")
    removeButton.className = "basket-cards__close"
    removeButton.setAttribute("role", "button")
    removeButton.setAttribute("tabindex", "0")
    removeButton.setAttribute("aria-label", "Удалить товар")

    // Крестик удаления
    removeButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24"
                 fill="none" xmlns="http://www.w3.org/2000/svg"
                 aria-hidden="true">
                <path d="M6 6L18 18M18 6L6 18"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"/>
            </svg>
        `

    totalPrice.append(removeButton)
    totalColumn.append(totalPrice)

    track.append(imageColumn, title, unitPrice, quantityColumn, totalColumn)

    return track
  }

  // Рисуем всю корзину из сохранённых данных
  function renderBasket() {
    const cart = getCart()
    basketContainer.replaceChildren()

    if (cart.length === 0) {
      const emptyMessage = document.createElement("p")
      emptyMessage.classList.add("basket-empty")
      emptyMessage.textContent = "Your Next Favorite Starts Here."
      basketContainer.append(emptyMessage)
    } else {
      cart.forEach((product, index) => {
        basketContainer.append(createCard(product, index))
      })
    }

    const subtotal = cart.reduce((sum, product) => {
      return sum + product.price * product.quantity
    }, 0)

    subtotalPrice.textContent = formatPrice(subtotal)
  }

  // Нажатия на +, − и крестик
  basketContainer.addEventListener("click", event => {
    const track = event.target.closest(".basket-cards__track")
    if (!track) return

    const index = Number(track.dataset.index)
    const cart = getCart()
    const product = cart[index]

    if (!product) return

    if (event.target.closest(".basket-cards__close")) {
      // Удаляем только выбранный товар
      cart.splice(index, 1)
    } else {
      const items = [...track.querySelectorAll(".details-calc__item")]

      if (items[1]?.contains(event.target)) {
        product.quantity = Math.max(1, product.quantity - 1)
      } else if (items[2]?.contains(event.target)) {
        product.quantity += 1
      } else {
        return
      }
    }

    saveCart(cart)
    renderBasket()
  })

  // Поддержка Enter и пробела для кнопок +, − и крестика
  basketContainer.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return

    const control = event.target.closest(".basket-cards__close, .details-calc__item[role='button']")

    if (!control) return

    event.preventDefault()
    control.click()
  })

  // Разрешаем в поле вводить только цифры
  basketContainer.addEventListener("input", event => {
    if (!event.target.matches(".details-calc__number")) return

    // Удаляем буквы, пробелы, знаки и прочие символы
    event.target.value = event.target.value.replace(/\D/g, "")
  })

  // Сохраняем новое количество после завершения ввода
  basketContainer.addEventListener("change", event => {
    if (!event.target.matches(".details-calc__number")) return

    const track = event.target.closest(".basket-cards__track")
    if (!track) return

    const index = Number(track.dataset.index)
    const cart = getCart()

    if (!cart[index]) return

    const quantity = Number.parseInt(event.target.value, 10)

    cart[index].quantity = Number.isFinite(quantity) && quantity >= 1 ? quantity : 1

    saveCart(cart)
    renderBasket()
  })

  // Обновляем отображение при изменении ширины экрана
  const mediaQuery = window.matchMedia("(min-width: 641px)")

  mediaQuery.addEventListener("change", () => {
    renderBasket()
  })

  // Первоначальное отображение корзины
  renderBasket()
})()
