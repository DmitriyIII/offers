ymaps.ready(init);

function init() {
    // Данные объектов
    const properties = [
        {
            id: 1,
            coordinates: [55.753134, 37.640255],
            title: "Хостел на Меркурии",
            description: "Хостел на Земле от Кленова Владислава",
            price: "6 000 ₽",
            reviews: "21 отзыв",
            features: "За 5 ночей и 2 гостя",
            image: "./img/images/image-1.png"
        },
        {
            id: 2,
            coordinates: [55.748, 37.655],
            title: "Высотка на Котельнической",
            description: "Апартаменты с видом на Москву",
            price: "12 000 ₽",
            reviews: "35 отзывов",
            features: "За 7 ночей и 4 гостя",
            image: "./img/images/image-2.png"
        }
    ];

    const icons = {
        normal: {
            href: './img/pin-normal.svg',
            size: [17, 17],
            offset: [-8, -4],
        },
        active: {
            href: './img/pin-active.svg',
            size: [17, 17],
            offset: [-8, -4],
        }
    };

    // Создаем карту
    const map = new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 12
    });

    // Глобальные переменные
    let activePlacemark = null;
    const placemarks = []; // Храним все созданные метки

    // Функция сброса активной метки
    function resetActivePlacemark() {
        if (activePlacemark) {
            // Полностью сбрасываем параметры иконки
            activePlacemark.options.set({
                iconImageHref: icons.normal.href,
                iconImageSize: icons.normal.size,
                iconImageOffset: icons.normal.offset,
            });
            activePlacemark.balloon.close();
            activePlacemark = null;
        }
    }

    // Обработчик клика по карте
    map.events.add('click', function () {
        resetActivePlacemark();
    });

    // Создаем все метки
    properties.forEach(property => {
        const placemark = new ymaps.Placemark(
            property.coordinates,
            {
                balloonContentBody: getBalloonContent(property),
            },
            {
                iconLayout: 'default#image',
                iconImageHref: icons.normal.href,
                iconImageSize: icons.normal.size,
                iconImageOffset: icons.normal.offset,
                hideIconOnBalloonOpen: false,
            }
        );

        // Добавляем метку на карту
        map.geoObjects.add(placemark);

        // Сохраняем метку в массив
        placemarks.push({
            id: property.id,
            placemark: placemark
        });

        // Обработчик клика по метке
        placemark.events.add('click', function (e) {
            e.stopPropagation();
            activatePlacemark(placemark);
        });
    });

    // Функция для активации метки
    function activatePlacemark(placemark) {
        // Сначала деактивируем текущую активную метку
        resetActivePlacemark()

        // Если кликнули по другой метке - активируем новую
        if (activePlacemark !== placemark) {
            placemark.options.set({
                iconImageHref: icons.active.href,
                iconImageSize: icons.active.size,
                iconImageOffset: icons.active.offset,
            });

            // Центрируем карту на метке
            placemark.balloon.open();
            activePlacemark = placemark;
            map.setCenter(placemark.geometry.getCoordinates());
        } else {
            // Если кликнули по уже активной метке - деактивируем
            activePlacemark = null;
        }
    }

    // Центрируем карту по первой точке и активируем первую метку
    if (properties.length > 0) {
        map.setCenter(properties[0].coordinates);
    }

    function getBalloonContent(property) {
        return `
            <div class="balloon" onclick="event.stopPropagation()">
                <img class="balloon__img" src="${property.image}">
                <div class="balloon__content">
                    <div class="balloon__title">${property.title}</div>
                    <div class="balloon__description">${property.description}</div>
                    <div class="balloon__reviews">${property.reviews}</div>
                    <div class="balloon__features">${property.features}</div>
                    <div class="balloon__price">${property.price}</div>
                </div>
            </div>
        `;
    }

    // Навешиваем обработчики на ссылки "Показать на карте"
    document.querySelectorAll('.show-on-map').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const adId = parseInt(this.getAttribute('data-id'));
            showOnMap(adId);
        });
    });

    // Функция для показа метки на карте
    function showOnMap(adId) {
        const found = placemarks.find(item => item.id === adId);
        if (found) {
            // Если кликаем на уже активную метку - сбрасываем
            if (activePlacemark && activePlacemark === found.placemark) {
                resetActivePlacemark();
                return;
            }

            // Активируем новую метку
            activatePlacemark(found.placemark);

            // Прокручиваем к карте
            document.getElementById('map').scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
}


// Слайдер
document.addEventListener('DOMContentLoaded', function () {
    const slider = document.getElementById('slider');
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('dots');

    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;
    let currentTranslate = 0;
    const swipeThreshold = 50;


    // Создаем точки навигации
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    // Функция для перехода к конкретному слайду
    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    // Обновление позиции слайдера и активной точки
    function updateSlider() {
        currentTranslate = currentIndex * -100;
        slider.style.transform = `translateX(${currentTranslate}%)`;
        slider.style.transition = 'transform 0.5s ease';

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Функция для перехода к следующему слайду с зацикливанием
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    }

    // Функция для перехода к предыдущему слайду с зацикливанием
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
    }

    // Общие функции для обработки свайпа
    function handleStart(clientX) {
        isDragging = true;
        startX = clientX;
        slider.style.transition = 'none';
    }

    function handleMove(clientX) {
        if (!isDragging) return;

        const diff = clientX - startX;
        const resistance = 0.3;
        const offset = diff * resistance;
        const maxOffset = 50;
        const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, offset));

        slider.style.transform = `translateX(calc(-${currentIndex * 100}% + ${clampedOffset}px))`;
    }

    function handleEnd(clientX) {
        if (!isDragging) return;
        isDragging = false;

        const diff = clientX - startX;

        if (diff > swipeThreshold) {
            prevSlide();
        } else if (diff < -swipeThreshold) {
            nextSlide();
        } else {
            slider.style.transition = 'transform 0.3s ease';
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    }

    // Десктопные обработчики
    slider.addEventListener('mousedown', (e) => {
        handleStart(e.clientX);
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        handleMove(e.clientX);
    });

    document.addEventListener('mouseup', (e) => {
        handleEnd(e.clientX);
    });

    // Сенсорные обработчики
    slider.addEventListener('touchstart', (e) => {
        handleStart(e.touches[0].clientX);
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        handleMove(e.touches[0].clientX);
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
        handleEnd(e.changedTouches[0].clientX);
    });


    // Запрещаем перетаскивание изображений и выделение текста
    document.querySelectorAll('.slide img, .slide').forEach(element => {
        element.addEventListener('dragstart', (e) => e.preventDefault());
        element.style.userSelect = 'none';
    });
});



document.addEventListener('DOMContentLoaded', function () {
    // Проверяем мобильное устройство
    if (window.innerWidth > 768) return;

    const panel = document.getElementById('mobilePanel');
    const header = document.getElementById('panelHeader');
    const content = document.getElementById('panelContent');
    const minPanelHeight = 70;
    const swipeThreshold = 50;

    // Клонируем предложения в панель
    const offers = document.querySelectorAll('.offer');
    offers.forEach(offer => {
        content.appendChild(offer.cloneNode(true));
    });

    let startY, currentY, isPanelExpanded = false;
    let isInteractingWithSlider = false;

    // Обработчики
    header.addEventListener('click', togglePanel);
    panel.addEventListener('touchstart', handleTouchStart, { passive: false });
    panel.addEventListener('touchmove', handleTouchMove, { passive: false });
    panel.addEventListener('touchend', handleTouchEnd);

    // Отслеживаем взаимодействие со слайдером
    content.addEventListener('touchstart', function (e) {
        if (e.target.closest('.slider, .dots, .slide')) {
            isInteractingWithSlider = true;
            return;
        }
        isInteractingWithSlider = false;
    });

    function togglePanel() {
        isPanelExpanded = !isPanelExpanded;
        panel.classList.toggle('expanded', isPanelExpanded);
        panel.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
        panel.style.transform = isPanelExpanded ? 'translateY(0)' : `translateY(calc(100% - ${minPanelHeight}px))`;
    }

    function handleTouchStart(e) {
        if (isInteractingWithSlider) return;
        startY = e.touches[0].clientY;
        currentY = startY;
        panel.style.transition = 'none';
    }

    function handleTouchMove(e) {
        if (!startY || isInteractingWithSlider) {
            e.preventDefault();
            return;
        }

        currentY = e.touches[0].clientY;
        const diff = startY - currentY;

        e.preventDefault();

        if (isPanelExpanded) {
            // Свайп вниз для закрытия
            if (diff < 0) {
                const moveY = Math.min(Math.abs(diff), panel.offsetHeight);
                panel.style.transform = `translateY(${moveY}px)`;
            }
        } else {
            // Свайп вверх для открытия
            if (diff > 0) {
                const moveY = Math.min(diff, panel.offsetHeight);
                panel.style.transform = `translateY(calc(100% - ${minPanelHeight}px - ${moveY}px))`;
            }
        }
    }

    function handleTouchEnd() {
        if (isInteractingWithSlider) {
            isInteractingWithSlider = false;
            return;
        }

        if (!startY) return;

        const diff = startY - currentY;
        panel.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';

        if (isPanelExpanded) {
            if (diff < -swipeThreshold) {
                isPanelExpanded = false;
                panel.style.transform = `translateY(calc(100% - ${minPanelHeight}px))`;
            } else {
                panel.style.transform = 'translateY(0)';
            }
        } else {
            if (diff > swipeThreshold) {
                isPanelExpanded = true;
                panel.style.transform = 'translateY(0)';
            } else {
                panel.style.transform = `translateY(calc(100% - ${minPanelHeight}px))`;
            }
        }

        startY = null;
        currentY = null;
    }
});
