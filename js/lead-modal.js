/* ================================================
   LEAD MODAL — rehabyou.site
   Форма заявки → Bitrix24 CRM (Лиды)
   ================================================ */
(function() {

  var BITRIX_WEBHOOK = 'https://rehabyou.bitrix24.ru/rest/41819/1eu77fq1ddmwfxd3/crm.deal.add.json';

  /* ---------- Инжектируем стили ---------- */
  var MODAL_CSS = '.lead-modal-overlay{display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);align-items:center;justify-content:center;padding:24px;}.lead-modal-overlay.open{display:flex;}.lead-modal{background:#fff;width:100%;max-width:460px;position:relative;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,0.35);}.lead-modal-close{position:absolute;top:16px;right:16px;width:32px;height:32px;background:rgba(255,255,255,0.12);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s;z-index:2;border-radius:0;}.lead-modal-close:hover{background:rgba(255,255,255,0.22);}.lead-modal-close svg{width:14px;height:14px;stroke:#fff;stroke-width:2;fill:none;}.lead-modal-header{background:#161616;padding:36px 40px 32px;position:relative;}.lead-modal-eyebrow{font-size:10px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:#C9A96E;margin-bottom:16px;font-family:"Inter",sans-serif;}.lead-modal-title{font-family:"Unbounded",sans-serif;font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;color:#fff;margin-bottom:10px;line-height:1.05;}.lead-modal-subtitle{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.6;font-family:"Inter",sans-serif;}.lead-modal-body{padding:32px 40px 36px;}.lead-modal-field{margin-bottom:16px;}.lead-modal-label{display:block;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#aaa;margin-bottom:8px;font-family:"Inter",sans-serif;}.lead-modal-input{width:100%;height:50px;border:1.5px solid #e5e5e5;border-radius:0;padding:0 16px;font-size:15px;font-family:"Inter",sans-serif;color:#1a1a1a;background:#fff;outline:none;transition:border-color 0.2s;box-sizing:border-box;}.lead-modal-input:focus{border-color:#161616;}.lead-modal-input.error{border-color:#e53e3e;}.lead-modal-input::placeholder{color:#ccc;}.lead-modal-submit{width:100%;height:52px;background:#C9A96E;color:#000;border:none;font-size:11px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;cursor:pointer;margin-top:8px;margin-bottom:14px;font-family:"Unbounded",sans-serif;transition:background 0.2s;}.lead-modal-submit:hover{background:#ff8c00;}.lead-modal-submit:disabled{background:#ccc;cursor:not-allowed;}.lead-modal-agree{font-size:11px;color:#ccc;line-height:1.5;font-family:"Inter",sans-serif;}.lead-modal-success{display:none;background:#161616;padding:48px 40px;text-align:center;}.lead-modal-success-icon{width:52px;height:52px;border:2px solid #C9A96E;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;}.lead-modal-success-icon svg{width:22px;height:22px;stroke:#C9A96E;stroke-width:2.5;fill:none;}.lead-modal-success-title{font-family:"Unbounded",sans-serif;font-size:18px;font-weight:900;text-transform:uppercase;color:#fff;margin-bottom:12px;letter-spacing:-0.01em;}.lead-modal-success-desc{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7;font-family:"Inter",sans-serif;}@media(max-width:600px){.lead-modal-header{padding:28px 28px 24px;}.lead-modal-body{padding:24px 28px 28px;}.lead-modal-title{font-size:18px;}}';

  var styleEl = document.createElement('style');
  styleEl.textContent = MODAL_CSS;
  document.head.appendChild(styleEl);

  /* ---------- HTML попапа ---------- */
  var MODAL_HTML = '<div class="lead-modal-overlay" id="leadModalOverlay"><div class="lead-modal" role="dialog" aria-modal="true" aria-label="Форма заявки"><button class="lead-modal-close" id="leadModalClose" aria-label="Закрыть"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button><div id="leadModalForm"><div class="lead-modal-header"><div class="lead-modal-eyebrow">Rehab.You · Москва</div><div class="lead-modal-title">Подберём<br>программу для вас</div><div class="lead-modal-subtitle">Перезвоним в течение 15 минут — расскажем о форматах, мастерах и ценах</div></div><div class="lead-modal-body"><div class="lead-modal-field"><label class="lead-modal-label" for="leadName">Ваше имя</label><input class="lead-modal-input" id="leadName" type="text" placeholder="Иван" autocomplete="given-name"></div><div class="lead-modal-field"><label class="lead-modal-label" for="leadPhone">Телефон</label><input class="lead-modal-input" id="leadPhone" type="tel" placeholder="+7 (___) ___-__-__" autocomplete="tel"></div><button class="lead-modal-submit" id="leadSubmit">Перезвоните мне</button><div class="lead-modal-agree">Нажимая кнопку, вы принимаете <a href=\"/privacy/\" style=\"color:#aaa;text-decoration:underline;\" target=\"_blank\">политику конфиденциальности</a> и <a href=\"/oferta/\" style=\"color:#aaa;text-decoration:underline;\" target=\"_blank\">публичную оферту</a></div></div></div><div class="lead-modal-success" id="leadModalSuccess"><div class="lead-modal-success-icon"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><div class="lead-modal-success-title">Ждите звонка</div><div class="lead-modal-success-desc">Свяжемся в течение 15 минут.<br>Если срочно — <a href="tel:+79255404060" style="color:#C9A96E;">+7 (925) 540-40-60</a></div></div></div></div>';

  /* ---------- Вставляем в DOM ---------- */
  document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

  var overlay  = document.getElementById('leadModalOverlay');
  var closeBtn = document.getElementById('leadModalClose');
  var nameInput  = document.getElementById('leadName');
  var phoneInput = document.getElementById('leadPhone');
  var submitBtn  = document.getElementById('leadSubmit');
  var formBlock  = document.getElementById('leadModalForm');
  var successBlock = document.getElementById('leadModalSuccess');

  /* ---------- Открытие / закрытие ---------- */
  function openModal() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function() { nameInput.focus(); }, 300);
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

  /* ---------- Открываем по всем кнопкам "Записаться" ---------- */
  function attachTriggers() {
    document.querySelectorAll('.nav-cta, .nav-mobile-cta').forEach(function(el) {
      if (el.href && el.href.indexOf('yclients') !== -1) {
        el.addEventListener('click', function(e) {
          e.preventDefault();
          openModal();
        });
      }
    });
  }

  window.openLeadModal = openModal;

  /* ---------- Телефон — маска ---------- */
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
  nameInput.addEventListener('input', function() {
    this.classList.remove('error');
  });

  /* ---------- Валидация ---------- */
  function validate() {
    var ok = true;
    if (!nameInput.value.trim()) {
      nameInput.classList.add('error');
      ok = false;
    }
    var phone = phoneInput.value.replace(/\D/g, '');
    if (phone.length < 11) {
      phoneInput.classList.add('error');
      ok = false;
    }
    return ok;
  }

  /* ---------- Отправка ---------- */
  submitBtn.addEventListener('click', function() {
    if (!validate()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем...';

    var name  = nameInput.value.trim();
    var phone = phoneInput.value.trim();

    var source = 'Форма сайта rehabyou.site';
    var path = window.location.pathname;
    if (path.indexOf('/certificates') !== -1) source += ' — Сертификаты';
    else if (path.indexOf('/subscriptions') !== -1) source += ' — Абонементы';
    else if (path.indexOf('/masters') !== -1) source += ' — Мастера';
    else if (path.indexOf('/massage') !== -1) source += ' — Услуги';

    var payload = {
      fields: {
        TITLE: 'Заявка с сайта: ' + name,
        CONTACT_ID: 0,
        SOURCE_ID: 'WEB',
        SOURCE_DESCRIPTION: source,
        COMMENTS: 'Заявка оставлена на сайте rehabyou.site\nСтраница: ' + window.location.href,
        OPENED: 'Y',
        STAGE_ID: 'NEW',
        CURRENCY_ID: 'RUB',
        OPPORTUNITY: 0,
        UF_CRM_CONTACT_NAME: name,
        UF_CRM_CONTACT_PHONE: phone
      },
      params: { REGISTER_SONET_EVENT: 'Y' }
    };
    // Параллельно создаём контакт и привязываем
    var contactPayload = {
      fields: {
        NAME: name,
        PHONE: [{ VALUE: phone, VALUE_TYPE: 'WORK' }],
        SOURCE_ID: 'WEB',
        COMMENTS: 'Создан автоматически с сайта rehabyou.site'
      }
    };

    var contactUrl = BITRIX_WEBHOOK.replace('crm.deal.add', 'crm.contact.add');
    fetch(contactUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactPayload)
    })
    .then(function(r) { return r.json(); })
    .then(function(contactData) {
      if (contactData.result) {
        payload.fields.CONTACT_ID = contactData.result;
      }
      return fetch(BITRIX_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.result) {
        formBlock.style.display = 'none';
        successBlock.style.display = 'block';
        setTimeout(function() {
          nameInput.value = '';
          phoneInput.value = '';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Перезвоните мне';
          formBlock.style.display = 'block';
          successBlock.style.display = 'none';
        }, 4000);
      } else {
        throw new Error('Bitrix error');
      }
    })
    .catch(function() {
      formBlock.style.display = 'none';
      successBlock.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Перезвоните мне';
    });
  });

  /* ---------- Enter в полях ---------- */
  [nameInput, phoneInput].forEach(function(el) {
    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') submitBtn.click();
    });
  });

  /* ---------- Цепляем триггеры после загрузки DOM ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachTriggers);
  } else {
    attachTriggers();
  }

})();
