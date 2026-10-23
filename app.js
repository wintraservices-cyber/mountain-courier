// Demo-only behavior. Nothing is sent anywhere; in production the form and chat
// would post to the CRM (GoHighLevel) and trigger a text confirmation.

(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };

  requestAnimationFrame(function () { root.classList.add('loaded'); });

  /* ---------- Live status from Pacific time ---------- */
  function pacificNow() {
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(new Date());
    var map = {}; parts.forEach(function (p) { map[p.type] = p.value; });
    var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { day: days[map.weekday], hour: parseInt(map.hour, 10) % 24 };
  }
  function nextRun(t) {
    var names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = t.day, weekday = d >= 1 && d <= 5;
    if (weekday && t.hour < 8) return 'today at 8am';
    var n = d;
    do { n = (n + 1) % 7; } while (n === 0 || n === 6);
    return (n === (d + 1) % 7 ? 'tomorrow' : names[n]) + ' at 8am';
  }
  function updateStatus() {
    var t = pacificNow();
    var running = t.day >= 1 && t.day <= 5 && t.hour >= 8 && t.hour < 16;
    var pill = $('statusPill'), text = $('statusText');
    if (pill) {
      pill.classList.toggle('live', running);
      text.textContent = running ? 'On today’s run until 4pm' : 'Taking requests now. Next run ' + nextRun(t);
    }
    var week = $('week');
    if (week) {
      [].forEach.call(week.children, function (c) { c.classList.toggle('today', +c.dataset.d === t.day); });
      $('weekNote').textContent = running
        ? 'The truck is out now. Requests sent before 4pm can still make a run today if the route allows.'
        : 'The truck is parked right now, but requests are open. Yours will be confirmed before the next run, ' + nextRun(t) + '.';
    }
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ---------- Hero: van drives the road ---------- */
  var road = $('road'), van = $('van'), mbFlag = document.querySelector('.mb-flag');
  if (road && van) {
    var len = road.getTotalLength();
    var place = function (p, back) {
      var pt = road.getPointAtLength(p * len);
      var a = road.getPointAtLength(Math.min(len, p * len + 2));
      var b = road.getPointAtLength(Math.max(0, p * len - 2));
      var ang = Math.atan2(a.y - b.y, a.x - b.x) * 180 / Math.PI;
      var flip = back ? ' scale(-1,1)' : '';
      van.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ') rotate(' + (back ? ang + 180 : ang).toFixed(1) + ')' + flip);
    };
    if (reduce) {
      place(1, false);
      van.classList.add('empty');
      if (mbFlag) mbFlag.classList.add('up');
    } else {
      var ease = function (x) { return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
      var OUT = 7000, PAUSE = 1600, BACK = 5500, CYCLE = OUT + PAUSE + BACK + PAUSE;
      var start = performance.now();
      var tick = function (now) {
        var t = (now - start) % CYCLE;
        if (t < OUT) { place(ease(t / OUT), false); van.classList.remove('empty'); if (mbFlag) mbFlag.classList.remove('up'); }
        else if (t < OUT + PAUSE) { place(1, false); van.classList.add('empty'); if (mbFlag) mbFlag.classList.add('up'); }
        else if (t < OUT + PAUSE + BACK) { place(1 - ease((t - OUT - PAUSE) / BACK), true); }
        else { place(0, false); van.classList.remove('empty'); }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  /* ---------- Hero: parallax ---------- */
  var hero = document.querySelector('.hero-scene');
  var layers = document.querySelectorAll('.scene .layer');
  if (hero && layers.length && !reduce) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var dx = (e.clientX - r.left) / r.width - .5;
      [].forEach.call(layers, function (l) {
        var d = parseFloat(l.dataset.depth);
        l.style.transform = 'translateX(' + (-dx * d * 60).toFixed(1) + 'px)';
      });
    });
    hero.addEventListener('pointerleave', function () { [].forEach.call(layers, function (l) { l.style.transform = ''; }); });
  }

  /* ---------- Hero: snowfall ---------- */
  var canvas = $('snow'), toggle = $('snowToggle');
  if (canvas && !reduce) {
    var ctx = canvas.getContext('2d'), flakes = [], on = true, W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var size = function () {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(W / 14);
      flakes = [];
      for (var i = 0; i < n; i++) flakes.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2.2 + .8, s: Math.random() * .6 + .3, w: Math.random() * 2 * Math.PI });
    };
    size();
    window.addEventListener('resize', size);
    var fall = function () {
      ctx.clearRect(0, 0, W, H);
      if (on) {
        ctx.fillStyle = 'rgba(255,255,255,.9)';
        for (var i = 0; i < flakes.length; i++) {
          var f = flakes[i];
          f.y += f.s; f.w += .01; f.x += Math.sin(f.w) * .35;
          if (f.y > H + 4) { f.y = -4; f.x = Math.random() * W; }
          ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.283); ctx.fill();
        }
      }
      requestAnimationFrame(fall);
    };
    requestAnimationFrame(fall);
    toggle.addEventListener('click', function () {
      on = !on;
      toggle.setAttribute('aria-pressed', String(on));
      toggle.textContent = on ? 'Snow on' : 'Snow off';
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealables = document.querySelectorAll('.reveal, .stagger');
  [].forEach.call(document.querySelectorAll('.stagger li'), function (li, i) {
    li.style.transitionDelay = (i % 6) * 0.08 + 's';
  });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.15 });
    [].forEach.call(revealables, function (el) { io.observe(el); });
  } else {
    [].forEach.call(revealables, function (el) { el.classList.add('in'); });
  }

  /* ---------- How it works: scroll-driven route ---------- */
  var section = $('how'), draw = $('routeDraw'), path = $('routePath'), rvan = $('routeVan');
  var track = document.querySelector('.route-track');
  var steps = document.querySelectorAll('.route-steps li');
  if (section && draw && path && rvan) {
    var plen = path.getTotalLength();
    draw.style.strokeDasharray = plen;
    var setRoute = function (p) {
      draw.style.strokeDashoffset = plen * (1 - p);
      var pt = path.getPointAtLength(p * plen);
      var w = track.clientWidth, h = track.clientHeight;
      rvan.style.transform = 'translate(' + (pt.x / 1000 * w).toFixed(1) + 'px,' + (pt.y / 120 * h).toFixed(1) + 'px)';
      [].forEach.call(steps, function (s) { s.classList.toggle('on', p >= parseFloat(s.dataset.at)); });
    };
    if (reduce) { setRoute(1); }
    else {
      var onScroll = function () {
        var r = section.getBoundingClientRect();
        var total = section.offsetHeight - window.innerHeight;
        var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
        setRoute(p);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      onScroll();
    }
  }

  /* ---------- Request form ---------- */
  var form = $('requestForm'), confirm = $('confirm');
  if (form) {
    var btn = form.querySelector('.send-btn');
    var letter = $('flyingLetter'), mailbox = document.querySelector('.mailbox-art');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim(), phone = form.phone.value.trim();
      confirm.classList.remove('show');
      if (!name || !phone) {
        confirm.style.background = '#FBEAE6'; confirm.style.color = '#8E3424';
        confirm.textContent = 'Add your name and a phone number so we can confirm the run.';
        void confirm.offsetWidth; confirm.classList.add('show');
        (!name ? form.name : form.phone).focus();
        return;
      }
      var first = name.split(' ')[0];
      var done = function () {
        confirm.style.background = ''; confirm.style.color = '';
        confirm.textContent = 'Request sent. Thanks, ' + first + ' — you’ll get a text at ' + phone + ' with your run time and price.';
        confirm.classList.add('show');
        form.reset();
        btn.classList.remove('sending');
      };
      btn.classList.add('sending');
      var visible = mailbox && mailbox.offsetParent !== null;
      if (reduce || !visible) { setTimeout(done, reduce ? 0 : 450); return; }
      var b = btn.getBoundingClientRect(), m = letter.getBoundingClientRect();
      letter.style.setProperty('--fx', (b.left + b.width / 2 - m.left - 20) + 'px');
      letter.style.setProperty('--fy', (b.top - m.top) + 'px');
      letter.classList.remove('fly'); void letter.offsetWidth; letter.classList.add('fly');
      mailbox.classList.remove('got');
      setTimeout(function () { mailbox.classList.add('got'); done(); }, 950);
    });
  }

  /* ---------- Chat ---------- */
  var launch = $('chatLaunch'), chat = $('chat');
  if (!launch) return;
  var close = $('chatClose'), body = $('chatBody'), chatForm = $('chatForm'), input = $('chatIn'), chips = $('chips');

  function setOpen(open) {
    chat.classList.toggle('open', open);
    launch.setAttribute('aria-expanded', String(open));
    launch.lastChild.textContent = open ? 'Close chat' : 'Ask a question';
    if (open) input.focus();
  }
  launch.addEventListener('click', function () { setOpen(!chat.classList.contains('open')); });
  close.addEventListener('click', function () { setOpen(false); launch.focus(); });

  var replies = [
    [/hour|open|close|weekend|saturday|sunday/i, 'Requests are taken 24/7. Pickups and deliveries run Monday to Friday, 8am to 4pm. Anything sent after hours is confirmed the next business morning.'],
    [/price|cost|rate|how much|fee/i, 'Every run is quoted before it’s booked. Send your pickup and delivery address and you’ll get the exact price by text or email.'],
    [/p\.?\s?o\.?\s?box|post office/i, 'Yes, we pick up from P.O. Boxes. We’ll help you with the authorization the post office needs. Want to open the request form?'],
    [/return|sent back|tracking|delivered/i, 'That happens a lot on the mountain. Send the tracking number and we’ll pick it up from the post office before it’s returned.'],
    [/bank|deposit|change/i, 'Banking runs are available for local businesses on a set schedule. Tell me your business name and how often you need it.'],
    [/snow|weather|storm/i, 'In heavy weather we’ll text you if a run needs to move to the next safe day.'],
    [/town|area|where|crestline|blue jay|running springs|twin peaks|rimforest|skyforest|cedar/i, 'We cover Lake Arrowhead and surrounding mountain communities. Share your address and we’ll confirm it’s on the route.'],
    [/yes|form|request|pick ?up|deliver|package|mail/i, 'Great — I’ve opened the request form for you. Fill in the pickup and delivery address and we’ll confirm by text.', 'form'],
    [/.*/, 'Thanks! I’ve passed that along and someone will reply by text or email. You can also send a pickup request now.']
  ];

  function add(text, who) {
    var div = document.createElement('div');
    div.className = 'msg ' + who;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }

  function ask(q) {
    q = q.trim();
    if (!q) return;
    add(q, 'me');
    var hit = replies.find(function (r) { return r[0].test(q); });
    var typing = document.createElement('div');
    typing.className = 'msg bot typing';
    typing.setAttribute('aria-label', 'Typing');
    typing.innerHTML = '<i></i><i></i><i></i>';
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;
    setTimeout(function () {
      typing.remove();
      add(hit[1], 'bot');
      if (hit[2] === 'form') {
        setTimeout(function () {
          $('request').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
          $('name').focus({ preventScroll: true });
        }, 600);
      }
    }, reduce ? 0 : 800);
  }

  chatForm.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); input.value = ''; });
  chips.addEventListener('click', function (e) {
    if (e.target.tagName === 'BUTTON') ask(e.target.textContent);
  });
})();
