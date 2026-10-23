// Demo-only behavior. Nothing is sent anywhere; in production the form and chat
// would post to the CRM (GoHighLevel) and trigger a text confirmation.

(function () {
  // Request form
  var form = document.getElementById('requestForm');
  var confirm = document.getElementById('confirm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      confirm.classList.remove('show');
      if (!name || !phone) {
        confirm.style.background = '#FBEAE6';
        confirm.style.color = '#8E3424';
        confirm.textContent = 'Add your name and a phone number so we can confirm the run.';
        confirm.classList.add('show');
        (!name ? form.name : form.phone).focus();
        return;
      }
      var first = name.split(' ')[0];
      confirm.style.background = '';
      confirm.style.color = '';
      confirm.textContent = 'Request sent. Thanks, ' + first + ' — you’ll get a text at ' + phone + ' with your run time and price.';
      confirm.classList.add('show');
      form.reset();
    });
  }

  // Chat
  var launch = document.getElementById('chatLaunch');
  var chat = document.getElementById('chat');
  var close = document.getElementById('chatClose');
  var body = document.getElementById('chatBody');
  var chatForm = document.getElementById('chatForm');
  var input = document.getElementById('chatIn');
  var chips = document.getElementById('chips');

  function setOpen(open) {
    chat.classList.toggle('open', open);
    launch.setAttribute('aria-expanded', String(open));
    launch.textContent = open ? 'Close chat' : 'Ask a question';
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
  }

  function ask(q) {
    q = q.trim();
    if (!q) return;
    add(q, 'me');
    var hit = replies.find(function (r) { return r[0].test(q); });
    setTimeout(function () {
      add(hit[1], 'bot');
      if (hit[2] === 'form') {
        setTimeout(function () {
          document.getElementById('request').scrollIntoView({ behavior: 'smooth' });
          document.getElementById('name').focus({ preventScroll: true });
        }, 600);
      }
    }, 450);
  }

  chatForm.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); input.value = ''; });
  chips.addEventListener('click', function (e) {
    if (e.target.tagName === 'BUTTON') ask(e.target.textContent);
  });
})();
