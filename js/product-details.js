
/* Информация об продукте */

// Получаем данные из памяти браузера
const savedProduct = sessionStorage.getItem("product");

// Проверка на пустоту объекта
if (savedProduct) {

    // Превращаем строку обратно в объект
    const product = JSON.parse(savedProduct);

    // Находим элементы
    const image = document.querySelector(".product-details__img");
    const title = document.querySelector(".product-details__title");
    const price = document.querySelector(".product-details__price");
    const position = document.querySelector(".information__position");

    const number = document.querySelector(".details-calc__number");
    const calcItems = document.querySelectorAll(".details-calc__item");

    const buyButton = document.querySelector(".product-details__btn");

    // Основная информация о товаре

    // Вставка картинки
    image.src = product.image;

    // Вставка названия
    title.textContent = product.title;

    // Вставка позиции
    position.textContent = product.title;

    // Цена за одну единицу товара
    const productPrice = Number.parseFloat(product.price);

    // Кнопки калькулятора
    const minus = calcItems[1]; // Минус
    const plus = calcItems[2];  // Плюс

    // Обновление цены
    function updatePrice() {

        // Получение количества
        let quantity = Number(number.value);

        // Проверка на корректность ввода
        if (!Number.isFinite(quantity) || quantity < 1) {
            quantity = 1;
            number.value = quantity;
        }

        // Считываем итоговую цену
        const totalPrice = productPrice * quantity;

        // Вывод результата пользователю
        price.textContent = `${totalPrice} ₴`;
    }

    // Кнопка -
    minus.addEventListener("click", () => {

        let quantity = Number(number.value);

        if (quantity > 1) {
            quantity--;

            number.value = quantity;

            updatePrice();
        }
    });

    // Кнопка +
    plus.addEventListener("click", () => {

        let quantity = Number(number.value);

        if (!Number.isFinite(quantity) || quantity < 1) {
            quantity = 1;
        }

        quantity++;

        number.value = quantity;

        updatePrice();
    });

    // Ручной ввод количества
    number.addEventListener("input", () => {
        updatePrice();
    });

    // Если пользователь вышел из поля ввода
    number.addEventListener("blur", () => {
        updatePrice();
    });

    // Добавление товара в корзину
    if (buyButton) {

        buyButton.addEventListener("click", (event) => {

            // Отменяем переход по ссылке href="#"
            event.preventDefault();

            // Получаем выбранное количество
            let quantity = Number.parseInt(number.value, 10);

            if (!Number.isFinite(quantity) || quantity < 1) {
                quantity = 1;
                number.value = quantity;
            }

            // Получаем существующую корзину
            let cart = [];

            try {
                cart = JSON.parse(localStorage.getItem("basket") || "[]");

                if (!Array.isArray(cart)) {
                    cart = [];
                }
            } catch (error) {
                cart = [];
            }

            // Ищем такой товар в корзине
            const existingProduct = cart.find(item =>
                item.title === product.title &&
                item.image === product.image
            );

            if (existingProduct) {

                // Если товар уже есть, прибавляем количество
                existingProduct.quantity += quantity;

            } else {

                // Если товара ещё нет, добавляем новую карточку
                cart.push({
                    title: product.title,
                    price: productPrice,
                    image: product.image,
                    quantity: quantity
                });
            }

            // Сохраняем корзину в памяти браузера
            localStorage.setItem("basket", JSON.stringify(cart));

            // Переходим на страницу корзины
            window.location.href = "../html/basket.html";
        });
    }

    // Первоначальный расчёт цены
    updatePrice();
}
