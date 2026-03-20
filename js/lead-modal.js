/* ================================================
   LEAD MODAL — rehabyou.site
   Форма заявки → Bitrix24 CRM (Сделки, воронка 0)
   ================================================ */
(function() {

  var B24_DEAL    = 'https://rehabyou.bitrix24.ru/rest/41819/1eu77fq1ddmwfxd3/crm.deal.add.json';
  var B24_CONTACT = 'https://rehabyou.bitrix24.ru/rest/41819/1eu77fq1ddmwfxd3/crm.contact.add.json';

  /* ---------- UTM из URL ---------- */
  function getUtm() {
    var params = new URLSearchParams(window.location.search);
    return {
      source:   params.get('utm_source')   || '',
      medium:   params.get('utm_medium')   || '',
      campaign: params.get('utm_campaign') || '',
      term:     params.get('utm_term')     || '',
      content:  params.get('utm_content')  || ''
    };
  }

  /* ---------- Метка страницы ---------- */
  function getPageLabel() {
    var path = window.location.pathname;
    if (path.indexOf('/certificates')  !== -1) return 'Сертификаты';
    if (path.indexOf('/subscriptions') !== -1) return 'Абонементы';
    if (path.indexOf('/masters')       !== -1) return 'Мастера';
    if (path.indexOf('/massage')       !== -1) return 'Услуги';
    return 'Главная';
  }

  /* ---------- Стили ---------- */
  var MODAL_CSS = '.lead-modal-overlay{display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);align-items:center;justify-content:center;padding:24px;}.lead-modal-overlay.open{display:flex;}.lead-modal{background:#fff;width:100%;max-width:460px;position:relative;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,0.35);}.lead-modal-close{position:absolute;top:16px;right:16px;width:32px;height:32px;background:rgba(255,255,255,0.12);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s;z-index:2;border-radius:0;}.lead-modal-close:hover{background:rgba(255,255,255,0.22);}.lead-modal-close svg{width:14px;height:14px;stroke:#fff;stroke-width:2;fill:none;}.lead-modal-header{background:#161616;padding:36px 40px 32px;position:relative;}.lead-modal-eyebrow{font-size:10px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:#C9A96E;margin-bottom:16px;font-family:"Inter",sans-serif;}.lead-modal-title{font-family:"Unbounded",sans-serif;font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;color:#fff;margin-bottom:10px;line-height:1.05;}.lead-modal-subtitle{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.6;font-family:"Inter",sans-serif;}.lead-modal-body{padding:32px 40px 36px;}.lead-modal-field{margin-bottom:16px;}.lead-modal-label{display:block;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#aaa;margin-bottom:8px;font-family:"Inter",sans-serif;}.lead-modal-input{width:100%;height:50px;border:1.5px solid #e5e5e5;border-radius:0;padding:0 16px;font-size:15px;font-family:"Inter",sans-serif;color:#1a1a1a;background:#fff;outline:none;transition:border-color 0.2s;box-sizing:border-box;}.lead-modal-input:focus{border-color:#161616;}.lead-modal-input.error{border-color:#e53e3e;}.lead-modal-input::placeholder{color:#ccc;}.lead-modal-submit{width:100%;height:52px;background:#F49933;color:#000;border:none;font-size:11px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;cursor:pointer;margin-top:8px;margin-bottom:14px;font-family:"Unbounded",sans-serif;transition:background 0.2s;}.lead-modal-submit:hover{background:#ff8c00;}.lead-modal-submit:disabled{background:#ccc;cursor:not-allowed;}.lead-modal-agree{font-size:11px;color:#ccc;line-height:1.5;font-family:"Inter",sans-serif;}.lead-modal-success{display:none;background:#161616;padding:48px 40px;text-align:center;}.lead-modal-success-icon{width:52px;height:52px;border:2px solid #C9A96E;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;}.lead-modal-success-icon svg{width:22px;height:22px;stroke:#C9A96E;stroke-width:2.5;fill:none;}.lead-modal-success-title{font-family:"Unbounded",sans-serif;font-size:18px;font-weight:900;text-transform:uppercase;color:#fff;margin-bottom:12px;letter-spacing:-0.01em;}.lead-modal-success-desc{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7;font-family:"Inter",sans-serif;}@media(max-width:600px){.lead-modal-header{padding:28px 28px 24px;}.lead-modal-body{padding:24px 28px 28px;}.lead-modal-title{font-size:18px;}}';

  var styleEl = document.createElement('style');
  styleEl.textContent = MODAL_CSS;
  document.head.appendChild(styleEl);

  /* ---------- HTML ---------- */
  var MODAL_HTML = '<div class="lead-modal-overlay" id="leadModalOverlay"><div class="lead-modal" role="dialog" aria-modal="true" aria-label="Форма заявки"><button class="lead-modal-close" id="leadModalClose" aria-label="Закрыть"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button><div id="leadModalForm"><div class="lead-modal-header"><div class="lead-modal-eyebrow">Rehab.You</div><div class="lead-modal-title">Подберём<br>программу для вас</div><div class="lead-modal-subtitle">Перезвоним в течение 15 минут — расскажем о форматах, мастерах и ценах</div></div><div class="lead-modal-body"><div class="lead-modal-field"><label class="lead-modal-label" for="leadName">Ваше имя</label><input class="lead-modal-input" id="leadName" type="text" placeholder="Александра" autocomplete="given-name"></div><div class="lead-modal-field"><label class="lead-modal-label" for="leadPhone">Телефон</label><input class="lead-modal-input" id="leadPhone" type="tel" placeholder="+7 (___) ___-__-__" autocomplete="tel"></div><button class="lead-modal-submit" id="leadSubmit">Перезвоните мне</button><div class="lead-modal-agree">Нажимая кнопку, вы принимаете <a href="/privacy/" style="color:#aaa;text-decoration:underline;" target="_blank">политику конфиденциальности</a> и <a href="/oferta/" style="color:#aaa;text-decoration:underline;" target="_blank">публичную оферту</a></div></div></div><div class="lead-modal-success" id="leadModalSuccess"><div class="lead-modal-success-icon"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><div class="lead-modal-success-title">Ждите звонка</div><div class="lead-modal-success-desc">Свяжемся в течение 15 минут.<br>Если срочно — <a href="tel:+79255404060" style="color:#C9A96E;">+7 (925) 540-40-60</a></div></div></div></div>';

  document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

  var overlay      = document.getElementById('leadModalOverlay');
  var closeBtn     = document.getElementById('leadModalClose');
  var nameInput    = document.getElementById('leadName');
  var phoneInput   = document.getElementById('leadPhone');
  var submitBtn    = document.getElementById('leadSubmit');
  var formBlock    = document.getElementById('leadModalForm');
  var successBlock = document.getElementById('leadModalSuccess');

  /* ---------- Открытие / закрытие ---------- */
  function openModal(context) {
    overlay.dataset.context = context || '';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function() { if (nameInput) nameInput.focus(); }, 300);
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- Глобальные хуки ---------- */
  window.openLeadModal = openModal;
  window.openModal = function() { openModal('cta'); };

  /* ---------- Маска телефона ---------- */
  phoneInput.addEventListener('input', function() {
    var val = this.value.replace(/\D/g, '');
    if (val.startsWith('8')) val = '7' + val.slice(1);
    if (val.startsWith('7')) {
      val = val.slice(0, 11);
      var m = val.match(/^7(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
      if (m) {
        this.value = '+7'
          + (m[1] ? ' (' + m[1] : '')
          + (m[1].length === 3 ? ') ' : '')
          + m[2]
          + (m[2].length === 3 ? '-' : '')
          + m[3]
          + (m[3].length === 2 ? '-' : '')
          + m[4];
      }
    } else {
      this.value = val ? '+' + val : '';
    }
    this.classList.remove('error');
  });
  nameInput.addEventListener('input', function() { this.classList.remove('error'); });

  /* ---------- Валидация ---------- */
  function validate() {
    var ok = true;
    if (!nameInput.value.trim()) { nameInput.classList.add('error'); ok = false; }
    if (phoneInput.value.replace(/\D/g, '').length < 11) { phoneInput.classList.add('error'); ok = false; }
    return ok;
  }

  /* ---------- Создать контакт + сделку ---------- */
  function sendToBitrix(name, phone, context, callback) {
    var utm = getUtm();
    var url  = window.location.href;
    var page = getPageLabel();

    var sourceDesc = 'Сайт rehabyou.site — ' + page;
    if (context) sourceDesc += ' (' + context + ')';
    if (utm.source)   sourceDesc += ' | ' + utm.source;
    if (utm.campaign) sourceDesc += ' / ' + utm.campaign;

    var nameParts = (name || 'Заявка').split(' ');
    var contactPayload = {
      fields: {
        NAME:      nameParts[0] || name,
        LAST_NAME: nameParts[1] || '',
        PHONE:     [{ VALUE: phone, VALUE_TYPE: 'WORK' }],
        SOURCE_ID: 'WEB',
        COMMENTS:  'Автосоздан с сайта rehabyou.site\nСтраница: ' + url
      }
    };
    if (utm.source)   contactPayload.fields.UTM_SOURCE   = utm.source;
    if (utm.medium)   contactPayload.fields.UTM_MEDIUM   = utm.medium;
    if (utm.campaign) contactPayload.fields.UTM_CAMPAIGN = utm.campaign;
    if (utm.term)     contactPayload.fields.UTM_TERM     = utm.term;
    if (utm.content)  contactPayload.fields.UTM_CONTENT  = utm.content;

    fetch(B24_CONTACT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactPayload)
    })
    .then(function(r) { return r.json(); })
    .then(function(cd) {
      var dealPayload = {
        fields: {
          TITLE:              'Заявка с сайта: ' + (name || phone),
          CATEGORY_ID:        0,
          STAGE_ID:           'NEW',
          CONTACT_ID:         cd.result || 0,
          SOURCE_ID:          'WEB',
          SOURCE_DESCRIPTION: sourceDesc,
          COMMENTS:           'Имя: ' + (name || '') + '\nТелефон: ' + phone + '\nСтраница: ' + url,
          OPENED:             'Y',
          CURRENCY_ID:        'RUB',
          UF_CRM_RECORD_SOURCE:     'Сайт',
          UF_CRM_RECORD_SOURCE_URL: url
        },
        params: { REGISTER_SONET_EVENT: 'Y' }
      };
      if (utm.source)   dealPayload.fields.UTM_SOURCE   = utm.source;
      if (utm.medium)   dealPayload.fields.UTM_MEDIUM   = utm.medium;
      if (utm.campaign) dealPayload.fields.UTM_CAMPAIGN = utm.campaign;
      if (utm.term)     dealPayload.fields.UTM_TERM     = utm.term;
      if (utm.content)  dealPayload.fields.UTM_CONTENT  = utm.content;
      return fetch(B24_DEAL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealPayload)
      });
    })
    .then(function() { if (callback) callback(true); })
    .catch(function() { if (callback) callback(false); });
  }

  /* ---------- Отправка модального попапа ---------- */
  submitBtn.addEventListener('click', function() {
    if (!validate()) return;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем...';
    var name  = nameInput.value.trim();
    var phone = phoneInput.value.trim();
    var ctx   = overlay.dataset.context || 'modal';
    sendToBitrix(name, phone, ctx, function() { showSuccess(); });
  });

  function showSuccess() {
    formBlock.style.display = 'none';
    successBlock.style.display = 'block';
    setTimeout(function() {
      nameInput.value = '';
      phoneInput.value = '';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Перезвоните мне';
      formBlock.style.display = 'block';
      successBlock.style.display = 'none';
      closeModal();
    }, 4000);
  }

  /* ---------- Enter в полях ---------- */
  [nameInput, phoneInput].forEach(function(el) {
    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') submitBtn.click();
    });
  });

  /* ---------- CTA-форма (инлайн в секции) ---------- */
  document.addEventListener('DOMContentLoaded', function() {
    var ctaInput  = document.querySelector('.cta-input');
    var ctaSubmit = document.querySelector('.cta-submit');
    if (ctaInput && ctaSubmit) {
      ctaSubmit.onclick = function(e) {
        e.preventDefault();
        var phone = ctaInput.value.trim();
        if (!phone || phone.replace(/\D/g,'').length < 6) {
          /* Телефон не введён — открываем модал */
          openModal('cta-section');
          return;
        }
        ctaSubmit.disabled = true;
        ctaSubmit.textContent = 'Отправляем...';
        sendToBitrix('', phone, 'cta-section', function() {
          ctaInput.value = '';
          ctaSubmit.textContent = 'Перезвоним \u2713';
          setTimeout(function() {
            ctaSubmit.disabled = false;
            ctaSubmit.textContent = 'Перезвоните';
          }, 3000);
        });
      };
    }
  });

})();
