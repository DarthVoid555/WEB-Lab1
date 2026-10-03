/* ============================================================
   lab-3-portfolio-jquery — ЛР №3
   ============================================================ */

   $(document).ready(function () {

    /* ============================================================
       0) ТЕМА: переключение + сохранение в localStorage
       ============================================================ */
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  
    applyTheme(initialTheme);
  
    function applyTheme(theme) {
      if (theme === 'dark') {
        $('html').attr('data-theme', 'dark');
        $('.js-theme-toggle i').removeClass('fa-moon').addClass('fa-sun');
      } else {
        $('html').removeAttr('data-theme');
        $('.js-theme-toggle i').removeClass('fa-sun').addClass('fa-moon');
      }
      localStorage.setItem('theme', theme);
    }
  
    $('.js-theme-toggle').on('click', function () {
      const current = $('html').attr('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  
    /* ============================================================
       1) ВЫПАДАЮЩЕЕ МЕНЮ
       ============================================================ */
    $('.js-menu-toggle').on('click', function () {
      $('.js-nav').slideToggle(300);
    });
  
    $('.js-nav a').on('click', function () {
      if ($(window).width() <= 767) {
        $('.js-nav').slideUp(300);
      }
    });
  
    /* ============================================================
       2) ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРЯМ
       ============================================================ */
    $('a[href^="#"]').on('click', function (e) {
      const target = $(this.hash);
      if (target.length) {
        e.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top - 70
        }, 600);
      }
    });
  
    /* ============================================================
       3) ДИНАМИЧЕСКАЯ ГАЛЕРЕЯ ИЗ JSON
       ============================================================ */
    $.getJSON('data/portfolio.json', function (data) {
      const $grid = $('.js-portfolio-grid');
      $grid.empty();
  
      $.each(data, function (index, item) {
        const $card = $('<div>').addClass('card js-card');
  
        $('<img>')
          .addClass('card__image')
          .attr('src', item.image)
          .attr('alt', item.title)
          .appendTo($card);
  
        const $info = $('<div>').addClass('card__info');
        $('<h3>').addClass('card__title').text(item.title).appendTo($info);
        $('<p>').addClass('card__text').text(item.description).appendTo($info);
  
        const $tags = $('<div>').addClass('card__tags');
        $.each(item.tags, function (i, tag) {
          $('<span>').addClass('card__tag').text(tag).appendTo($tags);
        });
        $tags.appendTo($info);
  
        $info.appendTo($card);
        $card.appendTo($grid);
  
        $card.hide().delay(index * 150).fadeIn(500);
      });
    }).fail(function (jqxhr, textStatus, error) {
      console.error('Ошибка загрузки JSON:', textStatus, error);
      $('.js-portfolio-grid').html(
        '<p class="portfolio__error">Не удалось загрузить работы :(</p>'
      );
    });
  
    /* ============================================================
       4) МОДАЛЬНОЕ ОКНО
       ============================================================ */
    $('.js-modal-open').on('click', function () {
      $('.js-modal').fadeIn(300).css('display', 'flex');
      $('body').css('overflow', 'hidden');
    });
  
    $('.js-modal-close').on('click', function () {
      closeModal();
    });
  
    $('.js-modal').on('click', function (e) {
      if (e.target === this) {
        closeModal();
      }
    });
  
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') {
        closeModal();
      }
    });
  
    function closeModal() {
      $('.js-modal').fadeOut(200);
      $('body').css('overflow', '');
    }
  
    /* ============================================================
       5) ВАЛИДАЦИЯ ФОРМЫ + СИМУЛЯЦИЯ ОТПРАВКИ
       ============================================================ */
    $('.js-feedback-form').on('submit', function (e) {
      e.preventDefault();
  
      let isValid = true;
      $('.js-error').text('');
      $('.js-form-status').removeClass('form__status--success form__status--error').text('');
      $('.js-field').removeClass('form__input--invalid');
  
      const name = $('#name').val().trim();
      if (name.length < 2) {
        $('#error-name').text('Введите имя (минимум 2 символа)');
        $('#name').addClass('form__input--invalid');
        isValid = false;
      }
  
      const email = $('#email').val().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        $('#error-email').text('Введите корректный email');
        $('#email').addClass('form__input--invalid');
        isValid = false;
      }
  
      const message = $('#message').val().trim();
      if (message.length < 5) {
        $('#error-message').text('Сообщение слишком короткое');
        $('#message').addClass('form__input--invalid');
        isValid = false;
      }
  
      if (!isValid) return;
  
      $.ajax({
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'POST',
        data: { name: name, email: email, message: message },
        beforeSend: function () {
          $('.js-submit').prop('disabled', true)
            .html('<i class="fas fa-spinner fa-spin"></i> Отправка...');
        },
        success: function () {
          $('.js-form-status')
            .addClass('form__status--success')
            .text('Сообщение успешно отправлено! Я свяжусь с тобой в ближайшее время.');
          $('.js-feedback-form')[0].reset();
  
          setTimeout(function () {
            closeModal();
            $('.js-submit').prop('disabled', false)
              .html('<i class="fas fa-paper-plane"></i> Отправить');
          }, 2000);
        },
        error: function () {
          $('.js-form-status')
            .addClass('form__status--error')
            .text('Ошибка при отправке. Попробуй позже.');
          $('.js-submit').prop('disabled', false)
            .html('<i class="fas fa-paper-plane"></i> Отправить');
        }
      });
    });
  
    /* ============================================================
       6) КАРУСЕЛЬ
       ============================================================ */
    const $track = $('.js-carousel-track');
    const $cards = $track.children('.skill-card');
    const totalCards = $cards.length;
    let currentIndex = 0;
    let autoPlay;
    let cardsToShow = getCardsToShow();
    let maxIndex = Math.max(0, totalCards - cardsToShow);
  
    function getCardsToShow() {
      const w = $(window).width();
      if (w <= 767) return 1;
      if (w <= 1023) return 2;
      return 3;
    }
  
    function updateCarousel() {
      const cardWidth = $cards.first().outerWidth(true);
      $track.css('transform', 'translateX(-' + (currentIndex * cardWidth) + 'px)');
    }
  
    $('.js-carousel-next').on('click', function () {
      currentIndex = (currentIndex >= maxIndex) ? 0 : currentIndex + 1;
      updateCarousel();
      resetAutoPlay();
    });
  
    $('.js-carousel-prev').on('click', function () {
      currentIndex = (currentIndex <= 0) ? maxIndex : currentIndex - 1;
      updateCarousel();
      resetAutoPlay();
    });
  
    function startAutoPlay() {
      autoPlay = setInterval(function () {
        currentIndex = (currentIndex >= maxIndex) ? 0 : currentIndex + 1;
        updateCarousel();
      }, 3500);
    }
  
    function resetAutoPlay() {
      clearInterval(autoPlay);
      startAutoPlay();
    }
  
    startAutoPlay();
  
    $(window).on('resize', function () {
      cardsToShow = getCardsToShow();
      maxIndex = Math.max(0, totalCards - cardsToShow);
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      updateCarousel();
    });
  
    /* ============================================================
       7) ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ
       ============================================================ */
    const $sections = $('section');
    const $navLinks = $('.js-nav a');
  
    $(window).on('scroll', function () {
      const scrollPos = $(this).scrollTop() + 100;
  
      $sections.each(function () {
        const $section = $(this);
        const top = $section.offset().top;
        const bottom = top + $section.outerHeight();
  
        if (scrollPos >= top && scrollPos < bottom) {
          const id = $section.attr('id');
          $navLinks.removeClass('nav__link--active');
          $navLinks.filter('[href="#' + id + '"]').addClass('nav__link--active');
        }
      });
  
      if ($(this).scrollTop() > 400) {
        $('.js-scroll-top').fadeIn(300);
      } else {
        $('.js-scroll-top').fadeOut(300);
      }
    });
  
    /* ============================================================
       8) КНОПКА "ВВЕРХ"
       ============================================================ */
    $('.js-scroll-top').on('click', function () {
      $('html, body').animate({ scrollTop: 0 }, 600);
    });
  
  });