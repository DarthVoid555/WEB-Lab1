/* ============================================================
   lab2-portfolio-jquery — динамическое поведение страницы
   ============================================================ */

   $(document).ready(function () {

    /* ============================================================
       1) ВЫПАДАЮЩЕЕ МЕНЮ (для мобильных)
       ============================================================ */
    $('.menu-toggle').on('click', function () {
      $('#main-nav').slideToggle(300);
    });
  
    // Закрываем меню при клике на ссылку (на мобильных)
    $('#main-nav a').on('click', function () {
      if ($(window).width() <= 767) {
        $('#main-nav').slideUp(300);
      }
    });
  
    /* ============================================================
       2) ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРНЫМ ССЫЛКАМ
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
      const $grid = $('#portfolio-grid');
      $grid.empty(); // убираем "Загрузка..."
  
      $.each(data, function (index, item) {
        const $card = $('<div>').addClass('portfolio-card');
  
        // Картинка
        $('<img>')
          .attr('src', item.image)
          .attr('alt', item.title)
          .appendTo($card);
  
        // Информация
        const $info = $('<div>').addClass('portfolio-info');
  
        $('<h3>').text(item.title).appendTo($info);
        $('<p>').text(item.description).appendTo($info);
  
        // Теги
        const $tags = $('<div>').addClass('portfolio-tags');
        $.each(item.tags, function (i, tag) {
          $('<span>').addClass('portfolio-tag').text(tag).appendTo($tags);
        });
        $tags.appendTo($info);
  
        $info.appendTo($card);
        $card.appendTo($grid);
  
        // Анимация появления (fadeIn с задержкой)
        $card.hide().delay(index * 150).fadeIn(500);
      });
    }).fail(function () {
      $('#portfolio-grid').html('<p class="error">Не удалось загрузить работы :(</p>');
    });
  
    /* ============================================================
       4) МОДАЛЬНОЕ ОКНО
       ============================================================ */
    $('#open-feedback').on('click', function () {
      $('#feedback-modal').fadeIn(300);
      $('body').css('overflow', 'hidden'); // блокируем скролл фона
    });
  
    // Закрытие по крестику
    $('.modal-close').on('click', function () {
      closeModal();
    });
  
    // Закрытие по клику на оверлей
    $('#feedback-modal').on('click', function (e) {
      if (e.target === this) {
        closeModal();
      }
    });
  
    // Закрытие по Escape
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') {
        closeModal();
      }
    });
  
    function closeModal() {
      $('#feedback-modal').fadeOut(200);
      $('body').css('overflow', '');
    }
  
    /* ============================================================
       5) ВАЛИДАЦИЯ ФОРМЫ + СИМУЛЯЦИЯ ОТПРАВКИ ЧЕРЕЗ $.AJAX
       ============================================================ */
    $('#feedback-form').on('submit', function (e) {
      e.preventDefault();
  
      let isValid = true;
  
      // Сброс ошибок
      $('.error-msg').text('');
      $('#form-status').removeClass('success error').text('');
  
      // Имя
      const name = $('#name').val().trim();
      if (name.length < 2) {
        $('#error-name').text('Введите имя (минимум 2 символа)');
        isValid = false;
      }
  
      // Email
      const email = $('#email').val().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        $('#error-email').text('Введите корректный email');
        isValid = false;
      }
  
      // Сообщение
      const message = $('#message').val().trim();
      if (message.length < 5) {
        $('#error-message').text('Сообщение слишком короткое');
        isValid = false;
      }
  
      if (!isValid) return;
  
      // СИМУЛЯЦИЯ ОТПРАВКИ через $.ajax
      $.ajax({
        url: 'https://jsonplaceholder.typicode.com/posts', // тестовый endpoint
        method: 'POST',
        data: {
          name: name,
          email: email,
          message: message
        },
        beforeSend: function () {
          $('.btn-submit').prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Отправка...');
        },
        success: function () {
          $('#form-status')
            .addClass('success')
            .text('Сообщение успешно отправлено! Я свяжусь с тобой в ближайшее время.');
          $('#feedback-form')[0].reset();
  
          setTimeout(function () {
            closeModal();
            $('.btn-submit').prop('disabled', false).html('<i class="fas fa-paper-plane"></i> Отправить');
          }, 2000);
        },
        error: function () {
          $('#form-status')
            .addClass('error')
            .text('Ошибка при отправке. Попробуй позже.');
          $('.btn-submit').prop('disabled', false).html('<i class="fas fa-paper-plane"></i> Отправить');
        }
      });
    });
  
    /* ============================================================
       6) КАРУСЕЛЬ НАВЫКОВ (кнопки + автопрокрутка)
       ============================================================ */
    const $track = $('#skills-track');
    const $cards = $track.children('.skill-card');
    const totalCards = $cards.length;
    const cardsToShow = 3; // сколько карточек видно одновременно
    const maxIndex = Math.max(0, totalCards - cardsToShow);
    let currentIndex = 0;
    let autoPlay;
  
    function updateCarousel() {
      const cardWidth = $cards.first().outerWidth(true);
      $track.css('transform', 'translateX(-' + (currentIndex * cardWidth) + 'px)');
    }
  
    $('.carousel .next').on('click', function () {
      currentIndex = (currentIndex >= maxIndex) ? 0 : currentIndex + 1;
      updateCarousel();
      resetAutoPlay();
    });
  
    $('.carousel .prev').on('click', function () {
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
  
    // Обновление при ресайзе
    $(window).on('resize', function () {
      updateCarousel();
    });
  
    /* ============================================================
       7) ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ ПРИ СКРОЛЛЕ
       ============================================================ */
    const $sections = $('section');
    const $navLinks = $('#main-nav a');
  
    $(window).on('scroll', function () {
      const scrollPos = $(this).scrollTop() + 100;
  
      $sections.each(function () {
        const $section = $(this);
        const top = $section.offset().top;
        const bottom = top + $section.outerHeight();
  
        if (scrollPos >= top && scrollPos < bottom) {
          const id = $section.attr('id');
          $navLinks.removeClass('active');
          $navLinks.filter('[href="#' + id + '"]').addClass('active');
        }
      });
  
      // Кнопка "Вверх"
      if ($(this).scrollTop() > 400) {
        $('#scroll-top').fadeIn(300);
      } else {
        $('#scroll-top').fadeOut(300);
      }
    });
  
    /* ============================================================
       8) КНОПКА "ВВЕРХ"
       ============================================================ */
    $('#scroll-top').on('click', function () {
      $('html, body').animate({ scrollTop: 0 }, 600);
    });
  
  });