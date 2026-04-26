document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────
     ACTIVE NAV LINK
  ───────────────────────────────────── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });


  /* ─────────────────────────────────────
     ANIMATED BLOB BACKGROUND (canvas)
     Four soft colour orbs drift slowly via
     sin/cos over time. Mouse gently pulls
     all orbs toward the cursor position.
  ───────────────────────────────────── */
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.insertAdjacentElement('afterbegin', canvas);
  const ctx = canvas.getContext('2d');

  let W, H;
  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  // Normalised mouse position (0-1), lazily lerped
  let mx = 0.5, my = 0.5;
  let tmx = 0.5, tmy = 0.5;

  if (window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', e => {
      tmx = e.clientX / window.innerWidth;
      tmy = e.clientY / window.innerHeight;
    });
  }

  // Blob descriptors: base position, orbit radii, colour, mouse weight
  const blobs = [
    {
      nx: 0.20, ny: 0.30, phase: 0,
      speed: 0.00038, rx: 0.18, ry: 0.13, r: 0.40, mw: 0.09,
      colors: ['rgba(113,180,110,0.14)', 'transparent'],
    },
    {
      nx: 0.78, ny: 0.68, phase: Math.PI * 0.75,
      speed: 0.00028, rx: 0.15, ry: 0.18, r: 0.32, mw: 0.06,
      colors: ['rgba(212,120,90,0.11)', 'transparent'],
    },
    {
      nx: 0.60, ny: 0.15, phase: Math.PI * 1.4,
      speed: 0.00022, rx: 0.20, ry: 0.10, r: 0.30, mw: 0.07,
      colors: ['rgba(74,168,192,0.10)', 'transparent'],
    },
    {
      nx: 0.35, ny: 0.80, phase: Math.PI * 2.2,
      speed: 0.00032, rx: 0.13, ry: 0.14, r: 0.26, mw: 0.05,
      colors: ['rgba(196,154,74,0.09)', 'transparent'],
    },
  ];

  let t = 0;
  let animPaused = false;
  document.addEventListener('visibilitychange', () => { animPaused = document.hidden; });

  const drawBg = () => {
    if (!animPaused) {
      mx += (tmx - mx) * 0.035;
      my += (tmy - my) * 0.035;

      ctx.fillStyle = '#111110';
      ctx.fillRect(0, 0, W, H);

      blobs.forEach(blob => {
        const ang = t * blob.speed + blob.phase;
        const bx  = (blob.nx + Math.cos(ang) * blob.rx + (mx - 0.5) * blob.mw) * W;
        const by  = (blob.ny + Math.sin(ang) * blob.ry + (my - 0.5) * blob.mw) * H;
        const rad = blob.r * Math.min(W, H);

        const g = ctx.createRadialGradient(bx, by, 0, bx, by, rad);
        g.addColorStop(0, blob.colors[0]);
        g.addColorStop(1, blob.colors[1]);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      });

      t++;
    }
    requestAnimationFrame(drawBg);
  };
  requestAnimationFrame(drawBg);


  /* ─────────────────────────────────────
     SCROLL PROGRESS BAR
  ───────────────────────────────────── */
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.insertAdjacentElement('afterbegin', progressBar);

  const updateProgress = () => {
    const max = document.body.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();


  /* ─────────────────────────────────────
     SCROLL REVEAL
  ───────────────────────────────────── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));


  /* ─────────────────────────────────────
     SKILL BARS + SHIMMER
  ───────────────────────────────────── */
  const barIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target;
        fill.style.width = fill.dataset.pct + '%';
        setTimeout(() => fill.classList.add('shimmer'), 150);
        barIO.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.skill-fill').forEach(el => barIO.observe(el));


  /* ─────────────────────────────────────
     STAT NUMBERS — count-up + pop
  ───────────────────────────────────── */
  const statIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const raw = el.textContent.trim();

      if (/^\d+$/.test(raw)) {
        const target  = parseInt(raw, 10);
        let   current = 0;
        const step    = Math.max(1, Math.round(target / 30));
        el.textContent = '0';
        el.classList.add('popped');
        const tick = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current;
          if (current >= target) clearInterval(tick);
        }, 40);
      } else {
        el.classList.add('popped');
      }
      statIO.unobserve(el);
    });
  }, { threshold: 0.7 });
  document.querySelectorAll('.stat-item-num').forEach(el => statIO.observe(el));


  /* ─────────────────────────────────────
     CARD GLOW (cursor position within card)
  ───────────────────────────────────── */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--glow-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--glow-y', (e.clientY - rect.top)  + 'px');
      });
    });
  }


  /* ─────────────────────────────────────
     BUTTON TILT + SHINE
  ───────────────────────────────────── */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.btn-primary').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = (e.clientX - cx) / (rect.width  / 2);
        const dy   = (e.clientY - cy) / (rect.height / 2);

        btn.style.transform = `perspective(400px) rotateX(${-dy * 14}deg) rotateY(${dx * 10}deg) translateY(-2px) scale(1.03)`;
        btn.style.setProperty('--shine-x', ((e.clientX - rect.left) / rect.width  * 100) + '%');
        btn.style.setProperty('--shine-y', ((e.clientY - rect.top)  / rect.height * 100) + '%');
      });

      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }


  /* ─────────────────────────────────────
     CONTACT FORM
  ───────────────────────────────────── */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type=submit]');
      const orig = btn.textContent;
      btn.textContent = 'Message sent!';
      btn.disabled = true;
      form.reset();
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 4000);
    });
  }


  /* ─────────────────────────────────────
     PROJECT FILTER
  ───────────────────────────────────── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('[data-cat]').forEach(card => {
        const show = f === 'all' || card.dataset.cat.includes(f);
        card.style.opacity    = show ? '1' : '0.25';
        card.style.transform  = show ? ''  : 'scale(0.97)';
        card.style.transition = 'opacity 0.3s, transform 0.3s';
      });
    });
  });


  /* ─────────────────────────────────────
     SCROLL-TO-TOP
  ───────────────────────────────────── */
  const st = document.getElementById('scroll-top');
  if (st) {
    window.addEventListener('scroll', () => st.classList.toggle('visible', scrollY > 500), { passive: true });
    st.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  }


  /* ─────────────────────────────────────
     NAVBAR SHRINK
  ───────────────────────────────────── */
  const nav = document.querySelector('.navbar');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.padding = scrollY > 40 ? '0.6rem 0' : '1rem 0';
    }, { passive: true });
  }

});