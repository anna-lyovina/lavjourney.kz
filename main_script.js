

const testimonialData = [
        { img: 'testimonial-full1.webp', client: '' },
        { img: 'testimonial-full2.webp', client: '' },
        { img: 'testimonial-full3.webp', client: '' },
        { img: 'testimonial-full4.webp', client: '' },
        { img: 'testimonial-full5.webp', client: '' },
        { img: 'testimonial-full6.webp', client: '' },
        { img: 'testimonial-full7.webp', client: '' }
    ];

function setupHamburgerMenuLogic(document) {
    // Hamburger menu logic
    const hamburgerBtn = document.getElementById('hamburgerOpen');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuCloseBtn = document.getElementById('hamburgerClose');
    const menuLinks = document.querySelectorAll('.menu-link');

    function openMenu(e) {
        e.stopPropagation(); // Prevent event bubbling
        menuOverlay.classList.add('active');
        hamburgerBtn.classList.add('hide');
        document.body.style.overflow = 'hidden';
        // Hide announcement text when menu opens
        window.announcement_text_marquee_paused = true; // Pause marquee
        var announcement = document.querySelector('.announcement-text');
        if (announcement) announcement.style.visibility = 'hidden';
    }

    function closeMenu() {
        menuOverlay.classList.remove('active');
        hamburgerBtn.classList.remove('hide');
        document.body.style.overflow = '';
        // Restore announcement text visibility when menu closes
        window.announcement_text_marquee_paused = false; // Resume marquee
        var announcement = document.querySelector('.announcement-text');
        if (announcement) announcement.style.visibility = '';
    }

    hamburgerBtn.addEventListener('click', openMenu);

    menuCloseBtn.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', function(e) {
        if (e.target === menuOverlay) closeMenu();
    });
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    // Accessibility: close on Escape
    document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menuOverlay.classList.contains('active')) closeMenu();
    });
}

function setupTestimonialsScrollButtonLogic(document) {
    const board = document.querySelector('.testimonials-board');
    const btnLeft = document.querySelector('.testimonial-scroll-btn.left');
    const btnRight = document.querySelector('.testimonial-scroll-btn.right');
    const testimonialCards = Array.from(document.querySelectorAll('.testimonial-card'));
    const dotsContainer = document.querySelector('.testimonial-dots');

    let currentMobileIndex = 0;

    function isMobile() {
        return window.innerWidth <= 767;
    }


    function updateMobileCarousel(index) {
        testimonialCards.forEach((card, i) => {
        if (isMobile()) {
            card.classList.toggle('active', i === index);
            card.style.display = i === index ? 'flex' : 'none';
        } else {
            card.classList.remove('active');
            card.style.display = '';
        }
        });
        // Update dots
        if (dotsContainer) {
        dotsContainer.innerHTML = '';
        testimonialCards.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'testimonial-dot' + (i === index ? ' active' : '');
            dot.setAttribute('aria-label', 'Показать отзыв ' + (i+1));
            dot.tabIndex = 0;
            dot.addEventListener('click', function(e) {
            e.stopPropagation();
            currentMobileIndex = i;
            updateMobileCarousel(currentMobileIndex);
            });
            dot.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                currentMobileIndex = i;
                updateMobileCarousel(currentMobileIndex);
            }
            });
            dotsContainer.appendChild(dot);
        });
        dotsContainer.style.display = isMobile() ? 'flex' : 'none';
        }
    }

    // Swipe gesture support for mobile carousel
    let swipeStartX = null;
    let swipeEndX = null;
    function handleTouchStart(e) {
        if (!isMobile()) return;
        if (e.touches.length === 1) {
        swipeStartX = e.touches[0].clientX;
        swipeEndX = null;
        }
    }
    function handleTouchMove(e) {
        if (!isMobile()) return;
        if (e.touches.length === 1) {
        swipeEndX = e.touches[0].clientX;
        }
    }
    function handleTouchEnd(e) {
        if (!isMobile()) return;
        if (swipeStartX !== null && swipeEndX !== null) {
        const dx = swipeEndX - swipeStartX;
        if (Math.abs(dx) > 40) { // threshold for swipe
            if (dx < 0) {
            // swipe left, next
            currentMobileIndex = (currentMobileIndex + 1) % testimonialCards.length;
            updateMobileCarousel(currentMobileIndex);
            } else {
            // swipe right, prev
            currentMobileIndex = (currentMobileIndex - 1 + testimonialCards.length) % testimonialCards.length;
            updateMobileCarousel(currentMobileIndex);
            }
        }
        }
        swipeStartX = null;
        swipeEndX = null;
    }

    // Attach swipe listeners to the testimonials board (mobile only)
    if (board) {
        board.addEventListener('touchstart', handleTouchStart, {passive: true});
        board.addEventListener('touchmove', handleTouchMove, {passive: true});
        board.addEventListener('touchend', handleTouchEnd);
    }

    function handleLeft() {
        if (isMobile()) {
        currentMobileIndex = (currentMobileIndex - 1 + testimonialCards.length) % testimonialCards.length;
        updateMobileCarousel(currentMobileIndex);
    } else {
        board.scrollBy({left: -400, behavior: 'smooth'});
        }
    }
    function handleRight() {
        if (isMobile()) {
        currentMobileIndex = (currentMobileIndex + 1) % testimonialCards.length;
        updateMobileCarousel(currentMobileIndex);
    } else {
        board.scrollBy({left: 400, behavior: 'smooth'});
        }
    }

    if (btnLeft && btnRight) {
        btnLeft.addEventListener('click', handleLeft);
        btnRight.addEventListener('click', handleRight);
    }

    // Only enable drag-to-scroll on desktop
    if (board) {
        let isDown = false, startX, scrollLeft;
        board.addEventListener('mousedown', (e) => {
        if (isMobile()) return; // Disable on mobile

        isDown = true;
        board.classList.add('dragging');
        board._dragStartTime = Date.now();
        startX = e.pageX - board.offsetLeft;
        scrollLeft = board.scrollLeft;
        e.preventDefault();
        });
        board.addEventListener('mouseleave', () => {
        isDown = false;
        board.classList.remove('dragging');
        });
        board.addEventListener('mouseup', (e) => {
        isDown = false;
        board.classList.remove('dragging');
        });
        board.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - board.offsetLeft;
        const walk = (x - startX) * 1.2;
        board.scrollBy({left: (scrollLeft - walk) - board.scrollLeft, behavior: 'instant'});
        });
        // Touch support: drag-to-scroll by touching any card
        let touchStartX = 0, touchScrollLeft = 0, touchActive = false;
        board.addEventListener('touchstart', (e) => {
        if (!e.target.closest('.testimonial-card')) return;
        touchActive = true;
        touchStartX = e.touches[0].pageX;
        touchScrollLeft = board.scrollLeft;
        });
        board.addEventListener('touchend', () => {
        touchActive = false;
        });
        board.addEventListener('touchmove', (e) => {
        if (!touchActive) return;
        const x = e.touches[0].pageX;
        const walk = (x - touchStartX) * 1.2;
        board.scrollBy({left: (touchScrollLeft - walk) - board.scrollLeft, behavior: 'instant'});
        });
        // Prevent image drag ghost
        board.querySelectorAll('img').forEach(img => {
        img.setAttribute('draggable', 'false');
        });
    }


    let currentTestimonialIndex = 0;

    
 
    function navigateTestimonial(offset) {
        currentTestimonialIndex = (currentTestimonialIndex + offset + testimonialData.length) % testimonialData.length;
        const data = testimonialData[currentTestimonialIndex];
        document.getElementById('testimonialLightboxImg').src = data.img;
    }

    document.querySelector('.nav.prev').addEventListener('click', function(event) { event.stopPropagation(); navigateTestimonial(-1); });
    document.querySelector('.nav.next').addEventListener('click', function(event) { event.stopPropagation(); navigateTestimonial(1); });

    function closeTestimonialLightbox() {
        document.getElementById('testimonialLightbox').style.display = 'none';
        document.body.style.overflow = '';
        window.announcement_text_marquee_paused = false;

        // Remove touch event listeners for swipe navigation
        const lightbox = document.getElementById('testimonialLightbox');
        if (lightbox._swipeHandlers) {
            lightbox.removeEventListener('touchstart', lightbox._swipeHandlers.handleTouchStart);
            lightbox.removeEventListener('touchmove', lightbox._swipeHandlers.handleTouchMove);
            lightbox.removeEventListener('touchend', lightbox._swipeHandlers.handleTouchEnd);
            lightbox._swipeHandlers = null;
        }
    }

    function testimonialLightboxKeyHandler(e) {
        if (document.getElementById('testimonialLightbox').style.display !== 'flex') return;
        if (e.key === 'ArrowLeft') {
            navigateTestimonial(-1);
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            navigateTestimonial(1);
            e.preventDefault();
        } else if (e.key === 'Escape') {
            closeTestimonialLightbox();
            e.preventDefault();
        }
    }

    document.getElementById('testimonialLightbox').addEventListener('click', closeTestimonialLightbox);
    document.addEventListener('keydown', testimonialLightboxKeyHandler);

    function openTestimonialLightbox(index) {
        currentTestimonialIndex = index;
        const data = testimonialData[index];
        document.getElementById('testimonialLightboxImg').src = data.img;
        // document.getElementById('testimonialLightboxClient').textContent = data.client;
        document.getElementById('testimonialLightbox').style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        window.announcement_text_marquee_paused = true;
        document.addEventListener('keydown',  function(e) { testimonialLightboxKeyHandler(document, e); });
        // Add click event to image for next navigation
        const img = document.getElementById('testimonialLightboxImg');
        if (img) {
            img.onclick = function(event) {
            event.stopPropagation();
            navigateTestimonial(1);
            };
        }
        // Add touch event listeners for swipe navigation
        const lightbox = document.getElementById('testimonialLightbox');
        let touchStartX = null;
        let touchEndX = null;
        function handleTouchStart(e) {
            if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchEndX = null;
            }
        }
        function handleTouchMove(e) {
            if (e.touches.length === 1) {
            touchEndX = e.touches[0].clientX;
            }
        }
        function handleTouchEnd(e) {
            if (touchStartX !== null && touchEndX !== null) {
            const dx = touchEndX - touchStartX;
            if (Math.abs(dx) > 50) { // threshold for swipe
                if (dx < 0) {
                navigateTestimonial(1); // swipe left, next
                } else {
                navigateTestimonial(-1); // swipe right, prev
                }
            }
            }
            touchStartX = null;
            touchEndX = null;
        }
        // Attach listeners
        lightbox.addEventListener('touchstart', handleTouchStart);
        lightbox.addEventListener('touchmove', handleTouchMove);
        lightbox.addEventListener('touchend', handleTouchEnd);
        // Store for removal
        lightbox._swipeHandlers = { handleTouchStart, handleTouchMove, handleTouchEnd };
    }


    // Set different background for even-indexed testimonial cards
    testimonialCards.forEach((card, i) => {
        if (i % 2 === 1) {
        card.classList.add('shifted');
        }
        else {
        //card.style.background = 'linear-gradient(135deg, rgba(238,226,231,0.95) 80%, rgba(254,251,251,0.95) 100%)';
        }
        // Add click event for lightbox only to the image

        card.style.cursor = 'pointer';
        card.addEventListener('click', function(e) {
            // Prevent accidental click after drag: only allow if not just dragged
            const board = document.querySelector('.testimonials-board');
            const now = Date.now();
            const should_ignore_click = board && board._dragStartTime && (now - board._dragStartTime > 200);
            board._dragStartTime = null;
            if (should_ignore_click) {
            e.stopPropagation();
            return;
            }
            openTestimonialLightbox(i);
        });
    });


    // Responsive: update carousel on resize
    function handleResize() {
        if (isMobile()) {
        updateMobileCarousel(currentMobileIndex);
        } else {
        testimonialCards.forEach(card => {
            card.classList.remove('active');
            card.style.display = '';
        });
        if (dotsContainer) dotsContainer.style.display = 'none';
        }
    }
    window.addEventListener('resize', handleResize);
    // Initial state
    handleResize();

}

function charCodesToUtf8String(input) {
    // Split the input by whitespace and filter out any empty strings
    const charCodes = input.split(/\s+/).filter(code => code.trim() !== '');
    
    // Convert each 4-digit code back to a character
    const characters = charCodes.map(code => String.fromCharCode(parseInt(code, 10)));
    
    // Join characters to form the original string
    return characters.join('');
}

function setupCertificationScrollLogic(document) {
    const certImages = [
    "diploma1.jpg",
    "diploma2.jpg",
    "diploma3.jpg",
    "diploma4.jpg"
    ];

    let currentCertIndex = 0;

    function navigate(offset) {
        currentCertIndex = (currentCertIndex + offset + certImages.length) % certImages.length;
        document.getElementById('lightbox-img').src = certImages[currentCertIndex];
    }
    document.getElementById('lightbox-prev').addEventListener('click', function(event) {
        event.preventDefault();
        navigate(-1);
        event.stopPropagation(); // Prevent closing lightbox on click
    });
    document.getElementById('lightbox-next').addEventListener('click', function(event) {
        event.preventDefault();
        navigate(1);
        event.stopPropagation(); // Prevent closing lightbox on click
    });
    document.getElementById('lightbox').addEventListener('click', closeLightbox);

    function closeLightbox() {
        document.getElementById('lightbox').style.display = 'none';
        document.body.style.overflow = '';
        window.announcement_text_marquee_paused = false;
        // Remove keyboard event listener when closing
        document.removeEventListener('keydown', lightboxKeyHandler);
        // Remove touch event listeners for swipe navigation
        const lightbox = document.getElementById('lightbox');
        if (lightbox._swipeHandlers) {
            lightbox.removeEventListener('touchstart', lightbox._swipeHandlers.handleTouchStart);
            lightbox.removeEventListener('touchmove', lightbox._swipeHandlers.handleTouchMove);
            lightbox.removeEventListener('touchend', lightbox._swipeHandlers.handleTouchEnd);
            lightbox._swipeHandlers = null;
        }
    }

    function lightboxKeyHandler(e) {
        if (document.getElementById('lightbox').style.display !== 'flex') return;
        if (e.key === 'ArrowLeft') {
            navigate(-1);
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            navigate(1);
            e.preventDefault();
        } else if (e.key === 'Escape') {
            closeLightbox();
            e.preventDefault();
        }
    }

    function openLightbox(index) {
        currentCertIndex = index;
        document.getElementById('lightbox-img').src = certImages[index];
        document.getElementById('lightbox').style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        window.announcement_text_marquee_paused = true;
        // Add keyboard event listener for navigation
        document.addEventListener('keydown', lightboxKeyHandler);
        // Add click event to image for next navigation
        const img = document.getElementById('lightbox-img');
        if (img) {
            img.onclick = function(event) {
            event.stopPropagation();
            navigate(1);
            };
        }
        // Add touch event listeners for swipe navigation
        const lightbox = document.getElementById('lightbox');
        let touchStartX = null;
        let touchEndX = null;
        function handleTouchStart(e) {
            if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchEndX = null;
            }
        }
        function handleTouchMove(e) {
            if (e.touches.length === 1) {
            touchEndX = e.touches[0].clientX;
            }
        }
        function handleTouchEnd(e) {
            if (touchStartX !== null && touchEndX !== null) {
            const dx = touchEndX - touchStartX;
            if (Math.abs(dx) > 50) { // threshold for swipe
                if (dx < 0) {
                navigate(1); // swipe left, next
                } else {
                navigate(-1); // swipe right, prev
                }
            }
            }
            touchStartX = null;
            touchEndX = null;
        }
        // Attach listeners
        lightbox.addEventListener('touchstart', handleTouchStart);
        lightbox.addEventListener('touchmove', handleTouchMove);
        lightbox.addEventListener('touchend', handleTouchEnd);
        // Store for removal
        lightbox._swipeHandlers = { handleTouchStart, handleTouchMove, handleTouchEnd };
    }

    const gallery = document.querySelector('.cert-gallery-strip');
    if (gallery) {
        const images = gallery.querySelectorAll('img');
        images.forEach((img, idx) => {
            img.addEventListener('click', function(e) {
                e.preventDefault();
                openLightbox(idx);
            });
        });
    }
}

async function loadEditables()
{
    const CONTENT_SERVICE = `0104 0116 0116 0112 0115 0058 0047 0047 0097 0112 0105 0046 0108 0097 0118 0106 0111 0117 0114 0110 0101 0121 0046 0107 0122 0058 0052 0052 0051 0047
0108 0097 0118 0106 0111 0117 0114 0110 0101 0121 0045 0099 0111 0110 0116 0101 0110 0116 0047 0103 0101 0116`;

    const result = await fetch(charCodesToUtf8String(CONTENT_SERVICE), {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                });

    if (!result.ok) {
        return {};
    }

    return await result.json();
}

const SPECIAL_ANNOUNCEMENT_VISIBILITY_EDICONTENT_ID = 'announcement_visibility_edicontent_id';
const SPECIAL_ANNOUNCEMENT_TEXT_EDICONTENT_ID = 'announcement';

function updateEditablesContents(document, container, filter_edi = null) {
    const editables = container.querySelectorAll('[edicontent_id]');

    if (!document.editables_dict) {
        document.editables_dict = {};
    }

    if (document.editables_dict.hasOwnProperty(SPECIAL_ANNOUNCEMENT_VISIBILITY_EDICONTENT_ID)) {
        const announcementContentWidget = document.getElementById('announcement-content-widget');
        if (announcementContentWidget) {
            const visible = !!document.editables_dict[SPECIAL_ANNOUNCEMENT_VISIBILITY_EDICONTENT_ID];
            announcementContentWidget.style.display = visible ? 'block' : 'none';
        }

        const displayAnnouncementCheckbox = document.getElementById('display-announcement');
        if (displayAnnouncementCheckbox) {
            displayAnnouncementCheckbox.checked = !!document.editables_dict[SPECIAL_ANNOUNCEMENT_VISIBILITY_EDICONTENT_ID];
        }
    }

    if (document.editables_dict.hasOwnProperty(SPECIAL_ANNOUNCEMENT_TEXT_EDICONTENT_ID)) {
        const announcementTextarea = document.getElementById('announcement-textarea');
        if (announcementTextarea) {
            announcementTextarea.value = document.editables_dict[SPECIAL_ANNOUNCEMENT_TEXT_EDICONTENT_ID];
        }
    }

    editables.forEach(function(el) {
        const id = el.getAttribute('edicontent_id');
        // Restore content if exists in editables_dict
        if (document.editables_dict.hasOwnProperty(id) && (filter_edi === null || filter_edi === id)) {
            if (id !== SPECIAL_ANNOUNCEMENT_VISIBILITY_EDICONTENT_ID) {
                el.innerHTML = document.editables_dict[id];
            }
        }
        });
}

function locateEditablesAndSetThemAsContentEditable(document, container) {
    updateEditablesContents(document, container);
    if (document.edit_mode !== true) return;

    const editables = container.querySelectorAll('[edicontent_id]');

    editables.forEach(function(el) {
        const id = el.getAttribute('edicontent_id');
        if (!el.hasAttribute('href') && el.tagName.toLowerCase() !== 'a') {
            el.setAttribute('contenteditable', 'true');
        }
        // Listen for changes
        el.addEventListener('blur', function() {
            if (id !== SPECIAL_ANNOUNCEMENT_VISIBILITY_EDICONTENT_ID) {
                document.editables_dict[id] = el.innerHTML;
                updateEditablesContents(document, container, id);
            }

        });
    });

    const displayAnnouncementCheckbox = document.getElementById('display-announcement');
    if (displayAnnouncementCheckbox) {
        displayAnnouncementCheckbox.addEventListener('click', function() {
            document.editables_dict[SPECIAL_ANNOUNCEMENT_VISIBILITY_EDICONTENT_ID] = displayAnnouncementCheckbox.checked;
            updateEditablesContents(document, container, SPECIAL_ANNOUNCEMENT_VISIBILITY_EDICONTENT_ID);
        });
    }

    const announcementTextarea = document.getElementById('announcement-textarea');
    if (announcementTextarea) {
        announcementTextarea.addEventListener('input', function() {
            document.editables_dict[SPECIAL_ANNOUNCEMENT_TEXT_EDICONTENT_ID] = announcementTextarea.value;
            updateEditablesContents(document, container, SPECIAL_ANNOUNCEMENT_TEXT_EDICONTENT_ID);
        });
    }
}

async function setupEditables(document) {
    document.editables_dict = await loadEditables();
    locateEditablesAndSetThemAsContentEditable(document, document);
}

function setupConsentModalLogic(document) {
    const SIGNEE_SERVICE = `0104 0116 0116 0112 0115 0058 0047 0047 0097 0112 0105 0046 0108 0097 0118 0106 0111 0117 0114 0110 0101 0121 0046 0107 0122 0058 0052 0052 0051 0047
0108 0097 0118 0106 0111 0117 0114 0110 0101 0121 0045 0115 0105 0103 0110 0101 0101 0115 0047 0097 0100 0100 0095 0115 0105 0103 0110 0101 0101`;

    const SIGNEE_SERVICE_S = `0049 0067 0100 0103 0088 0045 0074 0053 0099 0120 0076 0066 0078 0119 0105 0117 0070 0070 0101 0081 0068 0110 0055 0045 0048 0080 0089 0110 0088 0066
    0120 0107`;

    function dateToString(date)
    {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    }

    function closeConsentModal() {
        // Save current values before closing
        const nameInput = document.getElementById('consentName');
        const surnameInput = document.getElementById('consentSurname');
        const checkbox = document.getElementById('consentCheckbox');
        if (nameInput) document._consentNameValue = nameInput.value;
        if (surnameInput) document._consentSurnameValue = surnameInput.value;
        if (checkbox) document._consentCheckboxChecked = checkbox.checked;
        document.getElementById('consentModalOverlay').style.display = 'none';
        document.body.style.overflow = '';
        document.announcement_text_marquee_paused = false;

        if (document.edit_mode) {
             updateEditablesContents(document, document);
        }
    }
    document.getElementById('consentModalOverlay').addEventListener('click', closeConsentModal);
    document.getElementById('consentModalCloseBtn').addEventListener('click', closeConsentModal);

    // Add Escape key handler to close consent modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const overlay = document.getElementById('consentModalOverlay');
            if (overlay && overlay.style.display !== 'none') {
                closeConsentModal();
            }
        }
    });

    function openConsentModal() {
        // Retrieve previous values from window-scoped variables or set defaults
        const prevName = document._consentNameValue || '';
        const prevSurname = document._consentSurnameValue || '';
        const prevChecked = document._consentCheckboxChecked || false;

        const consentContent = document.getElementById('consentModalContent');
        consentContent.innerHTML = `
            <h3 edicontent_id="soglashenie">Соглашение</h3>
            <p edicontent_id="1-harakter-raboty-psihologicheskaya-" style="text-align: justify;hyphens: auto;">
            <strong>1.&nbsp;&nbsp;&nbsp;&nbsp;Характер работы</strong><br>Психологическая работа не является медицинской или психиатрической помощью. Я не ставлю диагнозов и не назначаю медикаментозного лечения. Моя задача — это сопровождение, исследование внутренних процессов и поддержка в поиске смысла, ясности и новых стратегий поведения.<br><br>
            <strong>2.&nbsp;&nbsp;&nbsp;&nbsp;Ощущения в процессе</strong><br>Наша совместная работа может вызывать разные переживания — облегчение, тревогу, раздражение, сомнение, усталость, внутренние открытия. Это естественно, особенно если затрагиваются глубинные темы. Всё это — часть живого процесса изменений.<br><br>
            <strong>3.&nbsp;&nbsp;&nbsp;&nbsp;Ответственность</strong><br>Каждый человек сам несёт ответственность за свою жизнь, принятые решения и поступки. Моя задача — быть рядом, чтобы вместе прояснять и осознавать, а не давать советы или готовые решения.<br><br>
            <strong>4.&nbsp;&nbsp;&nbsp;&nbsp;Конфиденциальность</strong><br>Всё, что происходит в процессе работы, остаётся конфиденциальным. Исключение — ситуации, когда есть прямая угроза жизни или здоровью — Вашему или других людей. В таких случаях я обязана действовать в рамках закона.<br><br>
            <strong>5.&nbsp;&nbsp;&nbsp;&nbsp;Условия для индивидуальных форматов</strong><br>
            5.1.&nbsp;&nbsp;&nbsp;&nbsp;Сессия бронируется по предварительной записи.
            <br>5.2.&nbsp;&nbsp;&nbsp;&nbsp;Оплата производится в течение 12 часов после встречи. В случае систематического несоблюдения этого условия может быть введена предоплата.
            <br>5.3.&nbsp;&nbsp;&nbsp;&nbsp;Если Вам нужно отменить или перенести встречу, пожалуйста, предупредите не менее чем за 24 часа. При неоднократном несоблюдении данного условия может быть введена невозвратная предоплата.
            <br>5.4.&nbsp;&nbsp;&nbsp;&nbsp;Если я отменяю или переношу встречу и не предупреждаю об этом за 24 часа, за Вами сохраняется право на бесплатную сессию.
            <br>5.5.&nbsp;&nbsp;&nbsp;&nbsp;Эти правила — про взаимное уважение к нашему времени и совместной работе.
            <br><br>
            <strong>6.&nbsp;&nbsp;&nbsp;&nbsp;Условия для групповых форматов</strong><br>Для участия в трансформационных играх и групповых практиках предусмотрена предварительная регистрация и предоплата. В случае отмены участия менее чем за 24 часа до проведения мероприятия предоплата не возвращается.<br><br>
            <strong>7.&nbsp;&nbsp;&nbsp;&nbsp;Согласие с условиями</strong><br>Записываясь на индивидуальную или групповую работу, Вы подтверждаете, что ознакомлены с этими условиями и согласны с ними.<br><br>

            <div style="background:rgba(43,156,153,0.07); border-radius:10px; padding:1.2rem 1rem; margin-bottom:1.2rem; display:flex; align-items:center; gap:0.8rem;">
            <i class="fas fa-info-circle" style="color:var(--accent-color); font-size:1.5rem;"></i>
            <span style="text-align: justify;hyphens: auto;" edicontent_id="esli-u-vas-est-voprosy-po-dannomu-razdelu" style="font-size:1.08rem; color:var(--primary-color); font-weight:500;">
                Если у Вас есть вопросы по данному разделу, пожалуйста, задайте их до начала работы.
            </span>
            </div>
            <div style="text-align:center; margin-bottom:1.2rem;">
            <button type="button" id="consentModalContactCloseBtn" class="cta-button" style="font-size:1.08rem; padding:0.5rem 2rem;">
                Задать вопрос
            </button>
            </div>
            <p style="text-align: justify;hyphens: auto;" edicontent_id="esli-voprosov-net" > Если вопросов нет, пожалуйста, заполните поля и нажмите на кнопку ниже. </p>
            <form id="consentForm" autocomplete="off" style="margin-top: 1.5rem; text-align: center;">
            <div style="display: flex; flex-direction: column; gap: 0.7rem; align-items: center;">
                <input type="text" id="consentName" placeholder="Имя" value="${prevName.replace(/"/g, '&quot;')}" style="width: 80%; max-width: 320px; padding: 0.5em; border-radius: 6px; border: 1px solid #ccc; font-size: 1rem;">
                <div class="custom-placeholder-wrapper" style="position:relative;width:80%;max-width:320px;">
                <input type="text" id="consentSurname" value="${prevSurname.replace(/\"/g, '&quot;')}" style="width:100%;padding:0.5em; border-radius:6px; border:1px solid #ccc; font-size:1rem; position:relative; z-index:1;" autocomplete="off">
                <span id="consentSurnamePlaceholder" class="custom-placeholder" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none;color:gray;transition:0.2s;font-size:1rem;z-index:2;">
                    Фамилия <span>(можно не полностью)</span>
                </span>
                </div>
            </div>
            <div style="margin-top: 1.2rem;">
                <label id="consentCheckboxLabel" style="display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                <input type="checkbox" id="consentCheckbox" style="width: 1.2em; height: 1.2em; accent-color: var(--accent-color);" ${prevChecked ? 'checked' : ''}>
                <span edicontent_id="ya-prinimayu-usloviya-soglasheniya">Я принимаю условия соглашения</span>
                </label>
            </div>
            <button type="button" id="consentProceedBtn" class="cta-button" style="font-size: 1.1rem; padding: 0.5rem 2rem; margin-top: 1.2rem;">Подписать</button>
            </form>
        `;

        document.getElementById('consentModalContactCloseBtn').addEventListener('click', function() {
            window.open('https://bit.ly/lavjourney-contact-wa', '_blank');
        });

        const input = document.getElementById('consentSurname');
        var placeholder = document.getElementById('consentSurnamePlaceholder');
        function togglePlaceholder() {
            if (input.value.length > 0) {
            placeholder.style.opacity = '0';
            } else {
            placeholder.style.opacity = '1';
            }
        }
        input.addEventListener('input', togglePlaceholder);
        // Initial state
        togglePlaceholder();

        locateEditablesAndSetThemAsContentEditable(document, consentContent);
        document.getElementById('consentModalOverlay').style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        window.announcement_text_marquee_paused = true;
        setTimeout(() => {
            const btn = document.getElementById('consentProceedBtn');
            const checkbox = document.getElementById('consentCheckbox');
            const label = document.getElementById('consentCheckboxLabel');
            const nameInput = document.getElementById('consentName');
            const surnameInput = document.getElementById('consentSurname');

            if (document.edit_mode)
            {
            btn.disabled = true;
            checkbox.disabled = true;
            nameInput.disabled = true;
            surnameInput.disabled = true;
            }
            else if (btn && checkbox && label && nameInput && surnameInput) {
            // Save values on input/change
            nameInput.addEventListener('input', () => { document._consentNameValue = nameInput.value; });
            surnameInput.addEventListener('input', () => { document._consentSurnameValue = surnameInput.value; });
            checkbox.addEventListener('change', () => { document._consentCheckboxChecked = checkbox.checked; });
            // Button click logic
            btn.onclick = function() {
                let valid = true;
                if (!checkbox.checked) {
                label.animate([
                    { boxShadow: '0 0 0 0px red', borderColor: 'red' },
                    { boxShadow: '0 0 0 4px red', borderColor: 'red' },
                    { boxShadow: '0 0 0 0px red', borderColor: 'red' }
                ], {
                    duration: 600,
                    iterations: 1
                });
                valid = false;
                }
                [nameInput, surnameInput].forEach(input => {
                if (!input.value.trim()) {
                    input.animate([
                    { boxShadow: '0 0 0 0px red', borderColor: 'red' },
                    { boxShadow: '0 0 0 4px red', borderColor: 'red' },
                    { boxShadow: '0 0 0 0px red', borderColor: 'red' }
                    ], {
                    duration: 600,
                    iterations: 1
                    });
                    valid = false;
                }
                });
                if (valid) {
                const payload = JSON.stringify({
                    secret: charCodesToUtf8String(SIGNEE_SERVICE_S),
                    name: nameInput.value,
                    surname: surnameInput.value,
                    datetime: dateToString(new Date(Date.now()))
                    })

                fetch(charCodesToUtf8String(SIGNEE_SERVICE), {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: payload
                })
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json().catch(() => ({}));
                })
                .then(data => {
                    // Optionally handle response data
                    closeConsentModal();
                })
                .catch(error => {
                    // Animate all fields in red on error
                    [nameInput, surnameInput].forEach(input => {
                    input.animate([
                        { boxShadow: '0 0 0 0px red', borderColor: 'red' },
                        { boxShadow: '0 0 0 4px red', borderColor: 'red' },
                        { boxShadow: '0 0 0 0px red', borderColor: 'red' }
                    ], {
                        duration: 600,
                        iterations: 1
                    });
                    });
                    label.animate([
                    { boxShadow: '0 0 0 0px red', borderColor: 'red' },
                    { boxShadow: '0 0 0 4px red', borderColor: 'red' },
                    { boxShadow: '0 0 0 0px red', borderColor: 'red' }
                    ], {
                    duration: 600,
                    iterations: 1
                    });
                });
                }
            };
            }
        }, 0);
    }

    const consent_links = document.querySelectorAll('.consent-link');
    consent_links.forEach(link => {
        link.addEventListener('click', openConsentModal);
    });
}

function setupServicesModalLogic(document) {
    const serviceCards = document.querySelectorAll('.card.service-card.fancy-service');

    const services = [
        {
            title: "Сессия",
            title_edicontent_id: "sessiya",
            icon: "fas fa-user",
            short_description: "Индивидуальная психологическая терапия",
            short_description_edicontent_id: "short_individualnaya-psikhologicheskaya-terapiya",
            description: "Индивидуальная терапевтическая работа с использованием психологических техник.",
            description_edicontent_id: "individualnaya-terapevticheskaya-rab",
            format: "Онлайн в GoogleMeet, регулярные встречи один раз в неделю. Продолжительность терапии (количество сессий) зависит от запроса: до достижения желаемого результата или по договорённости.",
            format_edicontent_id: "onlayn-v-googlemeet-regulyarnye-vstrechi-odin-raz-v-nedelyu",
            short_format: "Онлайн, 45–60 минут, количество сессий – по запросу",
            short_format_edicontent_id: "onlayn-45-60-minut-kolichestvo-sessiy-po-zaprosu",
            duration: "45-60 минут",
            duration_edicontent_id: "45-60-minut",
            short_price: "25 000 ₸",
            short_price_edicontent_id: "short_sessiya_25-000-teng",
            price: "25 000 ₸ (каждая 10-я сессия бесплатно)",
            price_edicontent_id: "sessiya-25-000-teng"
        },
        {
            title: "Разбор по пирамиде логических уровней",
            title_edicontent_id: "razbor-po-piramide-logicheskih-urovney",
            icon: "fas fa-brain",
            short_description: "Один сеанс для быстрого прояснения ситуации — без длительной терапии",
            short_description_edicontent_id: "odin-seans-dlya-bystrogo-proyasneniya",
            description: "Быстрая и эффективная техника для работы с конкретной проблемой. После встречи необходима  самостоятельная практика для закрепления результата.",
            description_edicontent_id: "bystraya-i-effektivnaya-tehnika-dlya-raboty-s-konkretnoy-problemoj",
            format: "Онлайн в GoogleMeet, один интенсивный сеанс  по конкретному вопросу.",
            format_edicontent_id: "onlayn-v-googlemeet-odin-intensivnyy-seans-po-konkretnomu-voprosu",
            short_format: "Онлайн, 90–120 минут, одна встреча",
            short_format_edicontent_id: "onlayn-90-120-minut-odna-vstrecha",
            duration: "90-120 минут",
            duration_edicontent_id: "90-120-minut",
            short_price: "45 000 ₸",
            short_price_edicontent_id: "short_razbor-po-piramide-logicheskih-urovney-45-000-teng",
            price: "45 000 ₸",
            price_edicontent_id: "razbor-po-piramide-logicheskih-urovney-45-000-teng"
        },
        {
            title: "Трансформационная игра Лила",
            title_edicontent_id: "transformacionnaya-igra-lila",
            icon: "fas fa-dice-d20",
            short_description: "Духовное путешествие по игровому полю, где каждый ход — шаг к пониманию себя и своей жизни — для ищущих",
            short_description_edicontent_id: "duhovnoe-puteshestvie-po-igrovomu-polyu",
            description: "Духовная настольная игра, которая помогает  понять состояние, осознать глубинные причины, прояснить внутренние процессы и найти новые смыслы.",
            description_edicontent_id: "duhovnaya-nastolnaya-igra-kotoraya-pomogaet-ponyat-sostoyanie-osoznat-glubinnyye-prichiny",
            format: "Офлайн в г. Алматы, индивидуально или в группе (2-4 человека).",
            format_edicontent_id: "oflayn-v-g-almaty-individualno-ili-v-gruppe-2-4-cheloveka",
            short_format: "Офлайн в г. Алматы, индивидуально или в группе, 1–5 часов",
            short_format_edicontent_id: "oflayn-v-g-almaty-individualno-ili-v-gruppe-1-5-chasov",
            duration: "1-5 часов",
            duration_edicontent_id: "1-5-chasa",
            short_price: "от 40 000 ₸",
            short_price_edicontent_id: "short_transformacionnaya-igra-lila-ot-40-000-teng",
            price: "50 000 ₸ — индивидуальная <br> 40 000 ₸ / чел — групповая <br> Предоплата 50%",
            price_edicontent_id: "transformacionnaya-igra-lila-50-000-teng-individualnaya-40-000-teng-chelovek-gruppovaya"
        },
        {
            title: "Расстановка Телесные шахматы",
            title_edicontent_id: "telesnye-shakhmaty",
            icon: "fas fa-chess",
            short_description: "Глубокая работа в группе, где Ваша история предстает под другим углом и открывает новые возможности и решения",
            short_description_edicontent_id: "glubokaya-rabota-v-gruppe-gde-vasha-istoriya-prestoit-pod-drugim-uglom",
            description: "Интересная и мощная психологическая практика, в которой человек при помощи других участников разыгрывает свою жизненную ситуацию. Здесь становятся видимыми скрытые роли, внутренние конфликты и стратегии поведения. Расстановка помогает осознать, что происходит на самом деле, и открывает новые пути решения.",
            description_edicontent_id: "interesnaya-i-moschnaya-psihologicheskaya-praktika-v-kotoroy-chelovek-pri-pomoshchi-drugih-uchastnikov",
            format: "Офлайн в г. Алматы, в группе (5-6 человек).",
            format_edicontent_id: "oflayn-v-g-almaty-v-gruppe-5-6-chelovek",
            short_format: "Офлайн в г. Алматы, группа, 6–8 часов",
            short_format_edicontent_id: "oflayn-v-g-almaty-gruppa-6-8-chasov",
            duration: "6-8 часов",
            duration_edicontent_id: "6-8-chasov",
            short_price: "25 000 ₸",
            short_price_edicontent_id: "short_telesnye-shakhmaty-25-000-teng",
            price: "25 000 ₸ / чел <br> Предоплата 50%",
            price_edicontent_id: "telesnye-shakhmaty-25-000-teng-chelovek-predoplata-50"
        }
        ];

    function closeServiceModal() {
        document.getElementById('serviceModalOverlay').style.display = 'none';
        document.body.style.overflow = '';
        document.announcement_text_marquee_paused = false;
        if (document.edit_mode) {
            updateEditablesContents(document, document);
        }
    }

    serviceCards.forEach((card, i) => {
        if (services[i]) {
        card.innerHTML = `
    <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between;">
        <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 0.5rem;">
            <i class="${services[i].icon}" style="font-size: 2.2rem; color: var(--accent-color);"></i>
        </div>
        <h4 style="text-align: center;" edicontent_id="${services[i].title_edicontent_id}">${services[i].title}</h4>
        <p style="text-align: center;" edicontent_id="${services[i].short_description_edicontent_id}">${services[i].short_description}</p>
        <div class="service-format" style="margin: 0.5em auto 0.2em auto; display: inline-block; font-style: italic; border-radius: 8px; padding: 0.35em 1em; text-align: center;">
            <span edicontent_id="${services[i].short_format_edicontent_id}">${services[i].short_format}</span>
        </div>
        <div style="margin-top: 0.2em; display: flex; justify-content: flex-start; align-items: flex-start;">
            <a href="#" class="service-details-link service-details-size" style=" font-weight: 600; text-decoration: underline; display: inline-block; font-family: 'Poppins', sans-serif; font-size: var(--fs14);">Подробнее</a>
        </div>
        <div style="margin-top: 0.7em; display: flex; justify-content: flex-end; align-items: flex-end;">
            <div style="display: flex; justify-content: center; align-items: center;">
            <span edicontent_id="${services[i].short_price_edicontent_id}" class="service-price" style="font-size: var(--fs16); display: inline-block; background: #fff; color: var(--accent-color); font-weight: 700; border-radius: 999px; padding: 0.45em 1.2em; box-shadow: 0 2px 12px rgba(43,156,153,0.10); letter-spacing: 0.5px; min-width: 90px; margin-right: 0.5rem;">
                ${services[i].short_price}
            </span>
            <a href="#contact" class="cta-button" href="#contact" onclick="event.stopPropagation()" style="font-size: var(--fs16); margin-top: 0; background: var(--accent-color); color: #fff; font-weight: 700; padding: 0.6em 2em; box-shadow: 0 2px 12px rgba(43,156,153,0.15); border: none; text-align: center; font-family: 'Poppins', sans-serif; transition: background 0.2s, box-shadow 0.2s;">Написать</a>
            </div>
        </div>

    </div>
`;
        }
    });

    for (let serviceCard of serviceCards) {
        locateEditablesAndSetThemAsContentEditable(document, serviceCard);
    }
    
    // Add Escape key handler to close service modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const overlay = document.getElementById('serviceModalOverlay');
            if (overlay && overlay.style.display !== 'none') {
                closeServiceModal();
            }
        }
    });

    const serviceCardsInfoLinks = document.querySelectorAll('.card.service-card.fancy-service .service-details-link');
    let linkables = document.edit_mode ? serviceCardsInfoLinks : serviceCards;

    linkables.forEach((card, idx) => {
        card.addEventListener('click', function(event) {
            event.preventDefault(); 
            openServiceModal(idx);
        });
    });

    

    function openServiceModal(index) {
        const modalContent = document.getElementById('serviceModalContent');
        modalContent.innerHTML = `
            <h3><i class="${services[index].icon}" style="margin-right: 0.5rem;"></i><em edicontent_id="${services[index].title_edicontent_id}" style="font-style: normal">${services[index].title}</em></h3>
            <p edicontent_id="${services[index].description_edicontent_id}" style="text-align: justify;hyphens: auto;">${services[index].description}</p>
            <h3>Формат</h3>
            <p edicontent_id="${services[index].format_edicontent_id}" style="text-align: justify;hyphens: auto;">${services[index].format}</p>
            <h3>Длительность</h3>
            <p edicontent_id="${services[index].duration_edicontent_id}" style="text-align: justify;hyphens: auto;">${services[index].duration}</p>
            <h3>Стоимость, тенге</h3>
            <p edicontent_id="${services[index].price_edicontent_id}" style="text-align: justify;hyphens: auto;">${services[index].price}</p>
            <div style="text-align: center; margin-top: 0.3rem;">
            <a href="#contact" class="cta-button" id="serviceModalContactCloseBtn" style="font-size: 1.2rem; padding: 0.6rem 2rem;" >Написать</a>
            </div>
        `;
        locateEditablesAndSetThemAsContentEditable(document, modalContent);
        

        document.getElementById('serviceModalContactCloseBtn').addEventListener('click', closeServiceModal);
        document.getElementById('serviceModalOverlay').style.display = 'flex';
        document.body.style.overflow = 'hidden';
        document.announcement_text_marquee_paused = true;
    }
    
    document.getElementById('serviceModalOverlay').addEventListener('click', closeServiceModal);
    document.getElementById('serviceModalCloseBtn').addEventListener('click', closeServiceModal);
}

function setupMarqueeLogic(document) {
    const marquee = document.querySelector('.announcement-marquee');
    const container = marquee.parentElement;
    let reqId;
    let speed = 100; // pixels per second
    document.announcement_text_marquee_paused = false;
    let startOffset = document.edit_mode ? 0.0 : 0.5; // 0.0 = fully hidden, 1.0 = fully visible, 0.5 = half visible

    function getWidths() {
        // Use the width of the actual text node inside the marquee
        const textNode = marquee.querySelector('.announcement-text');
        return {
            container: container.offsetWidth,
            text: textNode ? textNode.offsetWidth : marquee.offsetWidth
        };
    }

    function animateMarquee() {
        // Flag for mobile/desktop mode
        const isMobile = window.innerWidth < 768;
        animateMarquee.isMobile = isMobile;
        let { container, text } = getWidths();
        let x = container * startOffset;
        const end = -text - 200;
        const textNode = marquee.querySelector('.announcement-text');

        function step(ts) {
        if (document.announcement_text_marquee_paused !== true) {
            if (document.edit_mode)
            {
                container = getWidths().container;
            }
        
            x -= speed / 60; // 60fps

            bounding_rect = textNode.getBoundingClientRect();
            if (bounding_rect.right < 0) {
            x = isMobile ? container : container;
            }
            marquee.style.transform = `translateX(${x}px)`;
        }
        reqId = requestAnimationFrame(step);
        }
        reqId = requestAnimationFrame(step);
    }

    function start() {
        marquee.style.willChange = 'transform';
        marquee.style.position = 'relative';
        marquee.style.left = '0';

        marquee.style.transform = `translateX(${container.offsetWidth * startOffset}px)`;
        animateMarquee();
    }

    marquee.addEventListener('mouseenter', function() { document.announcement_text_marquee_paused = true; });
    marquee.addEventListener('mouseleave', function() { document.announcement_text_marquee_paused = false; });
    start();
}

function setupMenuReactions(document) {
    if (document.edit_mode) return;

    const menuLinks = document.querySelectorAll('.menu a[href^="#"], .footer-right a[href^="#"], .menu-overlay .menu-link[href^="#"]');
    menuLinks.forEach(link => {
        link.addEventListener('click', async function(e) {
            // Ignore links with custom onclick (e.g. consent modal)
            if (this.hasAttribute('onclick')) return;
            e.preventDefault();
            
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
            section.classList.add('visible');
            section.style.transform = 'none';
            section.style.transition = 'none';
            });

            const targetId = this.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            const header = document.querySelector('header');

            if (targetSection && header) {
            const sectionRect = targetSection.getBoundingClientRect();
            const headerRect = header.getBoundingClientRect();

            window.scrollBy({
                top: sectionRect.top - headerRect.bottom,
                behavior: 'smooth'
            });
            // Optionally update hash for deep linking
            history.replaceState(null, '', '#' + targetId);
            }
        });
    });
}

function setupIntersectionObservers(document) {
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.001 });

    sections.forEach(section => {
      observer.observe(section);
    });
}

function setupReactions(document) {

    setupMenuReactions(document);
    setupIntersectionObservers(document);
}

async function loadFullTestimonials() {
    return new Promise((resolve) => {
        let loadedCount = 0;
        const totalImages = testimonialData.length;
        
        if (totalImages === 0) {
            resolve();
            return;
        }
        
        testimonialData.forEach((testimonial, index) => {
            const img = new Image();
            
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    resolve();
                }
            };
            
            img.onerror = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    resolve();
                }
            };
            
            img.src = testimonial.img;
        });
    });
};


function applyForcedJustifications(document) {
    const justifiedElements = document.querySelectorAll('.force-justify');
    justifiedElements.forEach(element => {
    // Apply enhanced justification styles
    element.style.textAlign = 'justify';
    element.style.wordSpacing = '0.05em';
    element.style.letterSpacing = '0.01em';
    element.style.lineHeight = '1.6';

    // Add soft hyphens for better breaking
    const text = element.innerHTML;
    const enhancedText = text.replace(/(\w{6,})/g, (match) => {
      // Add soft hyphens to long words
      return match.replace(/(.{3})/g, '$1­'); // ­ is a soft hyphen
    });
    element.innerHTML = enhancedText;
  });
}

async function setupMain(document)
{
    setupMarqueeLogic(document);
    applyForcedJustifications(document);

    setupHamburgerMenuLogic(document);
    setupTestimonialsScrollButtonLogic(document);
    setupCertificationScrollLogic(document);
    setupConsentModalLogic(document);
    setupServicesModalLogic(document);
    
    setupReactions(document);
    await loadFullTestimonials();

    await setupEditables(document);
}