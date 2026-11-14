/* Lead source: remembers where a visitor came from (for this visit only)
   and adds it to the quote form as a hidden "Source" field, so each
   Formspree email says Facebook/Instagram ad, Google Ads, Google search, etc.
   Uses sessionStorage only (cleared when the tab closes); no cookies. */
(function () {
  var KEY = 'cirf_lead_source';
  var store = null;
  try { store = window.sessionStorage; } catch (e) {}

  function detect() {
    var p = new URLSearchParams(location.search);
    var src = (p.get('utm_source') || '').toLowerCase();
    var content = p.get('utm_content');
    var ref = '';
    try { ref = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) {}
    if (ref === location.hostname) ref = '';
    var label;
    if (p.get('gclid') || p.get('gbraid') || p.get('wbraid') || (src === 'google' && p.get('utm_medium') === 'cpc')) {
      label = 'Google Ads';
    } else if (src === 'meta' || src === 'facebook' || src === 'instagram') {
      label = 'Facebook/Instagram ad' + (content ? ' (' + content + ')' : '');
    } else if (src) {
      label = src + (content ? ' (' + content + ')' : '');
    } else if (/google\./.test(ref)) {
      label = 'Google search (not an ad)';
    } else if (/bing\.|duckduckgo\.|yahoo\./.test(ref)) {
      label = 'Other search engine (' + ref + ')';
    } else if (/facebook\.|fb\.|instagram\./.test(ref) || p.get('fbclid')) {
      label = 'Facebook/Instagram (not an ad)';
    } else if (ref) {
      label = 'Link from ' + ref;
    } else {
      label = 'Direct (typed in, bookmark or WhatsApp/email link)';
    }
    return label + ' | landed on ' + (location.pathname || '/');
  }

  var source = store && store.getItem(KEY);
  if (!source) {
    source = detect();
    try { store && store.setItem(KEY, source); } catch (e) {}
  }

  function fill() {
    var forms = document.querySelectorAll('form.contact-form');
    for (var i = 0; i < forms.length; i++) {
      var f = forms[i].querySelector('input[name="Source"]');
      if (!f) {
        f = document.createElement('input');
        f.type = 'hidden';
        f.name = 'Source';
        forms[i].appendChild(f);
      }
      f.value = source;
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill);
  else fill();
})();
