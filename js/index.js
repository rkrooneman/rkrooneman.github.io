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
     1. Greeting + typewriter intro
     ------------------------------------------------------------------------ */
  ready(function () {
    // Greeting (time-of-day)
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
        'I\u2019m Roderik, a Commercial Domain Lead.',
        'I think like a historian...',
        '...and build like a product manager.',
        'Big problems have long histories.',
        'Let\u2019s untangle some. Scroll down.'
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
    var darkSections = $all('.section--hello, .section--about, .section__dark, .section__dark2');
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
     3. Experience timeline - interactive, animated (any number of roles)
     ------------------------------------------------------------------------ */
  ready(function () {
    var track = $('#exp__track');
    var detail = $('#exp__detail');
    var timeline = $('#exp__timeline');
    if (!track || !detail) return;

    // Chronological order: oldest first, most recent last (rightmost node).
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
        body: 'Within the Commercial domain: define and own domain strategy &amp; target architecture, drive stakeholder engagement, translate business needs into functional designs, oversee solution delivery across cross-functional teams, and safeguard governance &amp; compliance. Pioneered AI-assisted ways of working in my own practice, using AI to turn raw business input into structured requirements, governance-grade briefs and consistent decisions, with the aim of onboarding fellow domain leads to the approach.'
      }
    ];

    // Pull a short year label out of each period string (e.g. "Sep 2025 - Present").
    function yearLabel(period) {
      if (/present/i.test(period)) return 'Now';
      var years = period.match(/\d{4}/g);
      return years ? years[years.length - 1] : period;
    }

    var nodes = [];
    var current = roles.length - 1; // open on the most recent role

    // Expose the count so the CSS line can span dot-centre to dot-centre.
    track.style.setProperty('--node-count', roles.length);

    roles.forEach(function (role, i) {
      var node = document.createElement('button');
      node.type = 'button';
      node.className = 'timeline__node';
      node.setAttribute('role', 'tab');
      node.setAttribute('aria-selected', i === current ? 'true' : 'false');
      node.setAttribute('aria-label', role.title + ', ' + role.period);
      node.style.setProperty('--delay', (i * 90) + 'ms');
      node.innerHTML =
        '<span class="timeline__year">' + yearLabel(role.period) + '</span>' +
        '<span class="timeline__dot"></span>';
      node.addEventListener('click', function () { goTo(i); });
      track.appendChild(node);
      nodes.push(node);
    });

    function renderDetail() {
      var role = roles[current];
      detail.innerHTML =
        '<div class="role">' +
        '<h2 class="role__title">' + role.title + '</h2>' +
        '<span class="role__period">' + role.period + '</span>' +
        '<p class="lead">' + role.body + '</p>' +
        '</div>';
    }

    function updateProgress() {
      // Fill the line from the start up to the active node.
      var pct = roles.length > 1 ? (current / (roles.length - 1)) * 100 : 0;
      track.style.setProperty('--progress', pct + '%');
    }

    function goTo(index) {
      current = (index + roles.length) % roles.length;
      nodes.forEach(function (n, i) {
        n.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });
      renderDetail();
      updateProgress();
    }

    // Keyboard: left/right arrows move between roles when a node has focus.
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); nodes[current].focus(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); nodes[current].focus(); }
    });

    // Swipe on the whole timeline (mobile).
    onSwipe(track, {
      left: function () { goTo(current + 1); },
      right: function () { goTo(current - 1); },
      min: 20
    });

    // Initial state
    renderDetail();
    updateProgress();

    // Entrance animation when the timeline scrolls into view (respect reduced-motion).
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      timeline.classList.add('is-visible');
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            timeline.classList.add('is-visible');
            io.disconnect();
          }
        });
      }, { threshold: 0.3 });
      io.observe(timeline);
    }
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
        title: 'BA American History @ Rijksuniversiteit Groningen',
        period: 'Grad. 2015',
        body: 'Foundations in American political history, grounded in archival research and manuscript study.'
      },
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
     5. Skills carousel - data-driven (any number of skills)
     ------------------------------------------------------------------------ */
  ready(function () {
    var dotsWrap = $('#skills__dots');
    var slidesWrap = $('#skills__slides');
    var chevL = $('#skillchevron__left'), chevR = $('#skillchevron__right');
    if (!dotsWrap || !slidesWrap) return;

    // Ordered from a Domain Lead / senior product perspective.
    var skills = [
      {
        title: 'Digital Strategy & AI',
        body: 'Setting domain vision, roadmap and target architecture, aligning a multi-market business around one commercial direction, and building AI into how strategy and delivery actually get done.'
      },
      {
        title: 'Stakeholder Management',
        body: 'Trusted advisor across operating companies, product & tech and back-office, translating business needs into shared, actionable direction.'
      },
      {
        title: 'User Centricity',
        body: 'Authentic user-centricity as the north star: if a change does not make things genuinely better for the end user, it has not earned its place.'
      },
      {
        title: 'Agile & Scrum',
        body: 'Certified Professional Scrum Product Owner, framing problems, prioritising backlogs and enabling teams to ship and iterate quickly.'
      },
      {
        title: 'Research & Learning Histories',
        body: 'A historian\u2019s discipline, tracing how today\u2019s challenges were built over time and designing evidence-based paths forward.'
      }
    ];

    var slides = [];
    var dots = [];
    var current = 0;

    skills.forEach(function (skill, i) {
      var isActive = i === current;
      var slide = document.createElement('div');
      slide.className = isActive ? 'exp__active' : 'exp__inactive';
      slide.innerHTML =
        '<h2>' + skill.title + '</h2>' +
        '<p class="lead">' + skill.body + '</p>';
      slidesWrap.appendChild(slide);
      slides.push(slide);

      var dot = document.createElement('span');
      dot.className = 'skill__dot control__dot ' + (isActive ? 'dot__active' : 'dot__inactive');
      dot.setAttribute('role', 'button');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', 'Show ' + skill.title);
      dotsWrap.appendChild(dot);
      dots.push(dot);

      dot.addEventListener('click', function () { goTo(i); });
      dot.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo(i); }
      });
    });

    function goTo(index) {
      current = (index + skills.length) % skills.length;
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

  /* ------------------------------------------------------------------------
     7. Easter eggs - console greeting + Konami "history mode" (opt-in only)
     ------------------------------------------------------------------------ */
  ready(function () {
    // Quiet greeting for the curious who open devtools.
    try {
      console.log(
        '%cRoderik Krooneman',
        'font-size:16px;font-weight:bold;color:#D65656;'
      );
      console.log('%cBig problems have long histories. Curious how this is built? github.com/rkrooneman', 'color:#5A6472;');
    } catch (e) { /* no-op */ }

    // Konami code: up up down down left right left right B A
    var seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    var pos = 0;
    document.addEventListener('keydown', function (e) {
      var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = (key === seq[pos]) ? pos + 1 : (key === seq[0] ? 1 : 0);
      if (pos === seq.length) {
        pos = 0;
        historyMode();
      }
    });

    function historyMode() {
      var root = document.documentElement;
      if (root.classList.contains('history-mode')) return; // already on
      root.classList.add('history-mode');
      console.log('%cHistory mode engaged. Big problems have long histories. (Refresh to return.)', 'color:#7a4a24;font-style:italic;');
    }
  });

})();
