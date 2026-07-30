/* ==========================================================================
   Roderik Krooneman - Online Profile
   Vanilla JS (no jQuery). Handles: greeting + clock, typewriter intro,
   scroll-driven nav colouring, Experience & Skills carousels, touch swipe.
   ========================================================================== */

(function () {
  'use strict';

  /* Small helpers ---------------------------------------------------------- */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $all = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  /* rAF-throttled scroll listener ----------------------------------------- */
  function onScroll(handler) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        handler();
        ticking = false;
      });
    }, { passive: true });
    handler(); // run once on load
  }

  /* Simple fade-in (replaces jQuery fadeTo("slow", 1)) --------------------- */
  function showFade(el) {
    if (!el) return;
    el.style.display = 'block';
    el.style.opacity = '0';
    // next frame so the transition applies
    window.requestAnimationFrame(function () {
      el.style.transition = 'opacity 0.4s ease';
      el.style.opacity = '1';
    });
  }

  function hide(el) {
    if (!el) return;
    el.style.display = 'none';
    el.style.opacity = '0';
  }

  /* Native left/right swipe (replaces jquery.touchwipe) -------------------- */
  function onSwipe(el, opts) {
    if (!el) return;
    var startX = 0, startY = 0, threshold = opts.min || 20;
    el.addEventListener('touchstart', function (e) {
      var t = e.changedTouches[0];
      startX = t.clientX;
      startY = t.clientY;
    }, { passive: true });
    el.addEventListener('touchend', function (e) {
      var t = e.changedTouches[0];
      var dx = t.clientX - startX;
      var dy = t.clientY - startY;
      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0 && opts.left) opts.left();
      else if (dx > 0 && opts.right) opts.right();
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     1. Random interests + greeting/clock + typewriter intro
     ------------------------------------------------------------------------ */
  ready(function () {
    var interests = [
      '\uD83D\uDD79\uD83C\uDFFF', '\uD83C\uDFC2', '\uD83C\uDFCB\uFE0F\u200D\u2642\uFE0F',
      '\uD83C\uDFD1', '\uD83C\uDFAC', '\uD83D\uDEEB', '\u26F5\uFE0F', '\uD83C\uDFC4',
      '\uD83D\uDC68\u200D\uD83C\uDF73', '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66',
      '\uD83D\uDC68\uD83C\uDFFC\u200D\uD83D\uDCBB', '\uD83C\uDFA7', '\uD83C\uDF63'
    ];

    // pick 3 distinct interests
    var picks = [];
    while (picks.length < 3) {
      var r = Math.floor(Math.random() * interests.length);
      if (picks.indexOf(r) === -1) picks.push(r);
    }

    // Continuously fill any interest spans the typewriter creates.
    setInterval(function () {
      var slots = ['.interest1', '.interest2', '.interest3'];
      for (var i = 0; i < slots.length; i++) {
        var node = $(slots[i]);
        if (node) node.textContent = interests[picks[i]];
      }
    }, 500);

    // Greeting + running clock
    function updateGreeting() {
      var now = new Date();
      var hr = now.getHours();
      var greet;
      var format = '';

      if (hr < 12) { greet = 'Goodmorning'; format = 'AM'; }
      else if (hr <= 17) { greet = 'Good afternoon'; format = 'PM'; }
      else { greet = 'Good evening'; format = 'PM'; }

      var h = hr % 12;
      var m = now.getMinutes();
      var s = now.getSeconds();
      var hh = h < 10 ? '0' + h : '' + h;
      var mm = m < 10 ? '0' + m : '' + m;
      var ss = s < 10 ? '0' + s : '' + s;

      var greetEl = $('.day__greet');
      if (greetEl) greetEl.innerHTML = greet;

      var dateEl = $('.date');
      if (dateEl) dateEl.innerHTML = hh + ':' + mm + ':' + ss + format;
    }
    setInterval(updateGreeting, 1000);
    updateGreeting();

    // Typewriter intro - tiny vanilla implementation (no external library).
    // Each phrase may contain an interest <span> that the interval above fills.
    var app = document.getElementById('app');
    if (app) {
      var phrases = [
        'Hello there...',
        'How are you doing?',
        'you could scroll down...',
        'or just stay here...',
        'did you know I love <span class="interest1"></span>?',
        '...and I really enjoy <span class="interest2"></span>',
        '...and ofcourse <span class="interest3"></span>',
        'how about a cup of \u2615?'
      ];

      // Respect reduced-motion: skip the animation, show the last line.
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        app.innerHTML = phrases[phrases.length - 1];
      } else {
        runTypewriter(app, phrases, { typeDelay: 75, deleteDelay: 40, pause: 1500 });
      }
    }
  });

  /* Minimal typewriter: types each phrase, pauses, deletes, moves on, loops once.
     Splits a phrase into character/markup tokens so inline <span> tags stay intact. */
  function runTypewriter(el, phrases, opts) {
    var pi = 0;

    function tokenize(str) {
      var tokens = [], i = 0;
      while (i < str.length) {
        if (str[i] === '<') {
          var close = str.indexOf('>', i);
          tokens.push(str.slice(i, close + 1)); // whole tag as one token
          i = close + 1;
        } else {
          tokens.push(str[i]); i++;
        }
      }
      return tokens;
    }

    function typePhrase() {
      var tokens = tokenize(phrases[pi]);
      var out = '', n = 0;
      (function type() {
        if (n < tokens.length) {
          out += tokens[n++];
          el.innerHTML = out;
          setTimeout(type, opts.typeDelay);
        } else if (pi === phrases.length - 1) {
          // Last phrase: leave it on screen instead of deleting.
        } else {
          setTimeout(deletePhrase, opts.pause);
        }
      })();
    }

    function deletePhrase() {
      // Delete by rebuilding the plain text length down to zero.
      var text = phrases[pi];
      var tokens = tokenize(text);
      (function del() {
        if (tokens.length > 0) {
          tokens.pop();
          el.innerHTML = tokens.join('');
          setTimeout(del, opts.deleteDelay);
        } else {
          pi++;
          if (pi < phrases.length) typePhrase();
        }
      })();
    }

    typePhrase();
  }

  /* ------------------------------------------------------------------------
     2. Scroll-driven nav colouring (dark sections -> white nav)
     ------------------------------------------------------------------------ */
  ready(function () {
    var top = $('.top');
    var bottom = $('.bottom');
    var logo = $('#krooneman__logo');
    var sideIcons = $all('.side__icon');
    // Every dark/coloured-background section the nav should turn white over.
    var darkSections = $all('.section--about, .section__dark, .section__dark2');
    if (!top || !bottom) return;

    // Is the given viewport Y coordinate currently inside a dark section?
    function overDark(viewportY) {
      for (var i = 0; i < darkSections.length; i++) {
        var r = darkSections[i].getBoundingClientRect();
        if (viewportY >= r.top && viewportY <= r.bottom) return true;
      }
      return false;
    }

    onScroll(function () {
      // Vertical centre of each nav element, in viewport coordinates.
      var topRect = top.getBoundingClientRect();
      var bottomRect = bottom.getBoundingClientRect();
      var topWhite = overDark(topRect.top + topRect.height / 2);
      var bottomWhite = overDark(bottomRect.top + bottomRect.height / 2);

      top.classList.toggle('nav__white', topWhite);
      top.classList.toggle('nav__black', !topWhite);
      if (logo) logo.setAttribute('class', topWhite ? 'nav__black nav__white' : 'nav__black');

      bottom.classList.toggle('nav__white', bottomWhite);
      bottom.classList.toggle('nav__black', !bottomWhite);
      sideIcons.forEach(function (icon) {
        icon.classList.toggle('nav__white', bottomWhite);
        icon.classList.toggle('nav__black', !bottomWhite);
      });
    });
  });

  /* ------------------------------------------------------------------------
     3. Experience carousel - data-driven (any number of roles)
     ------------------------------------------------------------------------ */
  ready(function () {
    var dotsWrap = $('#exp__dots');
    var slidesWrap = $('#exp__slides');
    var chevL = $('#chevron__left'), chevR = $('#chevron__right');
    if (!dotsWrap || !slidesWrap) return;

    // Chronological order: oldest first, most recent last (rightmost dot).
    // Edit here to add/remove/reorder roles.
    var roles = [
      {
        title: 'Digital Marketeer @ Noordhoff',
        period: 'Dec 2016 \u2013 May 2020',
        body: 'Operational management of the webshop and responsible for digital marketing, e-commerce and social media. Front-end development (HTML/CSS/Sass/JavaScript/React), CRO, UX/UI/CX design and customer-journey mapping to grow satisfaction, leads and conversions.'
      },
      {
        title: 'CX Manager @ Noordhoff',
        period: 'May 2020 \u2013 Jan 2021',
        body: 'Managed and continuously improved all marketing portals, webshops, websites and digital channels for user satisfaction and conversion. Business owner for the commercial systems, linking technology, data, digital marketing and sales.'
      },
      {
        title: 'E-commerce Business Manager @ Noordhoff',
        period: 'Jan 2021 \u2013 Jan 2022',
        body: 'Business owner of the e-commerce platform and advocate of customer interests within the product vision. Owned user stories, roadmap and delivery, aligning capacity, priorities and resources for continuous improvement, the linking pin between Noordhoff and international partners.'
      },
      {
        title: 'Lead Product Manager @ Infinitas Learning',
        period: 'Jan 2022 \u2013 Sep 2025',
        body: 'Identify the most valuable problems to solve, enable teams to ship and iterate high-quality solutions quickly, and validate market impact across Noordhoff.nl, Plantyn.com and Liber.se, coordinating roadmaps and go-to-market across departments and countries.'
      },
      {
        title: 'Domain Lead @ Infinitas Learning',
        period: 'Sep 2025 \u2013 Present',
        body: 'Within the Commercial domain: define and own domain strategy &amp; target architecture, drive stakeholder engagement, translate business needs into functional designs, oversee solution delivery across cross-functional teams, and safeguard governance &amp; compliance.'
      }
    ];

    var slides = [];
    var dots = [];
    // Open on the most recent role (last item in chronological order).
    var current = roles.length - 1;

    roles.forEach(function (role, i) {
      var isActive = i === current;
      var slide = document.createElement('div');
      slide.className = isActive ? 'exp__active' : 'exp__inactive';
      slide.innerHTML =
        '<h2>' + role.title + '</h2>' +
        '<p class="lead"><i>' + role.period + '</i><br />' + role.body + '</p>';
      slidesWrap.appendChild(slide);
      slides.push(slide);

      var dot = document.createElement('span');
      dot.className = 'exp__dot control__dot ' + (isActive ? 'dot__active' : 'dot__inactive');
      dot.setAttribute('role', 'button');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', 'Show ' + role.title);
      dotsWrap.appendChild(dot);
      dots.push(dot);

      dot.addEventListener('click', function () { goTo(i); });
      dot.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo(i); }
      });
    });

    function goTo(index) {
      current = (index + roles.length) % roles.length;
      slides.forEach(function (s, i) { if (i === current) showFade(s); else hide(s); });
      dots.forEach(function (d, i) {
        d.classList.toggle('dot__active', i === current);
        d.classList.toggle('dot__inactive', i !== current);
      });
    }

    if (chevL) chevL.addEventListener('click', function () { goTo(current - 1); });
    if (chevR) chevR.addEventListener('click', function () { goTo(current + 1); });

    onSwipe(slidesWrap, {
      left: function () { goTo(current + 1); },
      right: function () { goTo(current - 1); },
      min: 20
    });
  });

  /* ------------------------------------------------------------------------
     4. Education carousel - data-driven (any number of items)
     ------------------------------------------------------------------------ */
  ready(function () {
    var dotsWrap = $('#edu__dots');
    var slidesWrap = $('#edu__slides');
    var chevL = $('#educhevron__left'), chevR = $('#educhevron__right');
    if (!dotsWrap || !slidesWrap) return;

    // Chronological order: oldest first, most recent last (rightmost dot).
    var items = [
      {
        title: 'MA History Today @ Rijksuniversiteit Groningen',
        period: 'Grad. 2016',
        body: 'Master focussed on Politics, Organizations and Learning Histories, using a historical perspective to provide practical insight into current issues at an academic level.'
      },
      {
        title: 'Professional Scrum Product Owner I @ Scrum.org',
        period: '2023',
        body: 'Certified in the fundamentals of Scrum and the Product Owner role, maximising product value through effective backlog management and stakeholder alignment.'
      },
      {
        title: 'AI for Product Management @ Pendo.io',
        period: '2023',
        body: 'Applying artificial intelligence to product management, using data and AI-driven insight to prioritise, build and validate better products.'
      },
      {
        title: 'Cybersecurity Fundamentals @ IBM',
        period: '2024',
        body: 'Foundations of cybersecurity, core principles of security, threats and risk management across modern digital systems.'
      }
    ];

    var slides = [];
    var dots = [];
    // Open on the most recent item (last in chronological order).
    var current = items.length - 1;

    items.forEach(function (item, i) {
      var isActive = i === current;
      var slide = document.createElement('div');
      slide.className = isActive ? 'exp__active' : 'exp__inactive';
      slide.innerHTML =
        '<h2>' + item.title + '</h2>' +
        '<p class="lead"><i>' + item.period + '</i><br />' + item.body + '</p>';
      slidesWrap.appendChild(slide);
      slides.push(slide);

      var dot = document.createElement('span');
      dot.className = 'exp__dot control__dot ' + (isActive ? 'dot__active' : 'dot__inactive');
      dot.setAttribute('role', 'button');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', 'Show ' + item.title);
      dotsWrap.appendChild(dot);
      dots.push(dot);

      dot.addEventListener('click', function () { goTo(i); });
      dot.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo(i); }
      });
    });

    function goTo(index) {
      current = (index + items.length) % items.length;
      slides.forEach(function (s, i) { if (i === current) showFade(s); else hide(s); });
      dots.forEach(function (d, i) {
        d.classList.toggle('dot__active', i === current);
        d.classList.toggle('dot__inactive', i !== current);
      });
    }

    if (chevL) chevL.addEventListener('click', function () { goTo(current - 1); });
    if (chevR) chevR.addEventListener('click', function () { goTo(current + 1); });

    onSwipe(slidesWrap, {
      left: function () { goTo(current + 1); },
      right: function () { goTo(current - 1); },
      min: 20
    });
  });

  /* ------------------------------------------------------------------------
     5. Skills carousel (2 slides, 2 dots, chevrons, swipe)
     ------------------------------------------------------------------------ */
  ready(function () {
    var a = $('#skills__a'), b = $('#skills__b');
    var s1 = $('#skills__1'), s2 = $('#skills__2');
    var chevL = $('#skillchevron__left'), chevR = $('#skillchevron__right');
    if (!a || !b) return;

    function go1() {
      showFade(s1); hide(s2);
      a.classList.add('dot__active'); a.classList.remove('dot__inactive');
      b.classList.add('dot__inactive'); b.classList.remove('dot__active');
    }
    function go2() {
      hide(s1); showFade(s2);
      b.classList.add('dot__active'); b.classList.remove('dot__inactive');
      a.classList.add('dot__inactive'); a.classList.remove('dot__active');
    }
    function toggle() {
      if (b.classList.contains('dot__active')) go1(); else go2();
    }

    a.addEventListener('click', go1);
    b.addEventListener('click', go2);

    if (chevL) chevL.addEventListener('click', toggle);
    if (chevR) chevR.addEventListener('click', toggle);

    onSwipe(s1, { left: go2, right: go2, min: 20 });
    onSwipe(s2, { left: go1, right: go1, min: 20 });
  });

  /* ------------------------------------------------------------------------
     6. Back-to-top button - appears after scrolling, smooth-scrolls to top
     ------------------------------------------------------------------------ */
  ready(function () {
    var btn = $('#back-to-top');
    if (!btn) return;
    btn.removeAttribute('hidden');

    onScroll(function () {
      btn.classList.toggle('is-visible', window.pageYOffset > 400);
    });

    btn.addEventListener('click', function () {
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

})();
