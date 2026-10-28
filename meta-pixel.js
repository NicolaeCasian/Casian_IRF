/* Casian IRF — Meta (Facebook/Instagram) Pixel, loaded only after the visitor accepts cookies.
   Events: PageView (every page), Lead (thank-you page = form sent), Contact (phone or WhatsApp tap).
   To switch on: paste the Pixel ID from Meta Events Manager below. Empty ID = nothing loads, no banner. */
(function () {
  var PIXEL_ID = ''; // e.g. '123456789012345'
  if (!PIXEL_ID) return;

  var KEY = 'cirf_cookie_consent';
  function getChoice() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setChoice(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var loaded = false;
  function loadPixel() {
    if (loaded) return; loaded = true;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
    if (/thank-you(\.html)?$/.test(location.pathname)) fbq('track', 'Lead');
  }

  // Taps on phone / WhatsApp links (only sent if the Pixel is loaded)
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href]');
    if (!a || !loaded || !window.fbq) return;
    var h = a.getAttribute('href');
    if (h.indexOf('tel:') === 0) fbq('track', 'Contact', { method: 'phone' });
    else if (h.indexOf('https://wa.me/') === 0) fbq('track', 'Contact', { method: 'whatsapp' });
  });

  function showBanner() {
    var css = document.createElement('style');
    css.textContent =
      '.cc-bar{position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;max-width:560px;margin:0 auto;background:#1f2d3a;color:#fff;' +
      'padding:16px 18px;border-radius:8px;box-shadow:0 6px 24px rgba(0,0,0,.25);font:15px/1.45 Roboto,Arial,sans-serif}' +
      '.cc-bar a{color:#f39c12}.cc-bar .cc-btns{display:flex;gap:10px;margin-top:12px}' +
      '.cc-bar button{flex:1;padding:10px;border-radius:6px;border:0;font:600 15px Montserrat,Arial,sans-serif;cursor:pointer}' +
      '.cc-yes{background:#f39c12;color:#1f2d3a}.cc-no{background:transparent;color:#fff;border:1px solid #fff !important}' +
      '@media (max-width:768px){.cc-bar{bottom:76px}}';
    document.head.appendChild(css);
    var bar = document.createElement('div');
    bar.className = 'cc-bar'; bar.setAttribute('role', 'dialog'); bar.setAttribute('aria-label', 'Cookie choice');
    bar.innerHTML = 'We use cookies to see which of our Facebook and Instagram ads bring enquiries. ' +
      '<a href="privacy.html">Privacy &amp; cookies</a>' +
      '<div class="cc-btns"><button type="button" class="cc-no">No thanks</button><button type="button" class="cc-yes">Accept</button></div>';
    document.body.appendChild(bar);
    bar.querySelector('.cc-yes').onclick = function () { setChoice('yes'); bar.remove(); loadPixel(); };
    bar.querySelector('.cc-no').onclick = function () { setChoice('no'); bar.remove(); };
  }

  var choice = getChoice();
  if (choice === 'yes') loadPixel();
  else if (choice !== 'no') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showBanner); else showBanner();
  }

  // Lets the privacy page reopen the choice
  window.cirfCookieChoice = function () { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); };
})();
