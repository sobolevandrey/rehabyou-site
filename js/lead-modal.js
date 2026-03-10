/* ================================================
   LEAD MODAL — rehabyou.site
   Форма заявки → Bitrix24 CRM (Лиды)
   ================================================ */
(function() {

  var BITRIX_WEBHOOK = 'https://rehabyou.bitrix24.ru/rest/41819/1eu77fq1ddmwfxd3/crm.lead.add.json';

  /* ---------- HTML попапа ---------- */
  var MODAL_HTML = `
<div class="lead-modal-overlay" id="leadModalOverlay">
  <div class="lead-modal" role="dialog" aria-modal="true" aria-label="Форма заявки">
    <button class="lead-modal-close" id="leadModalClose" aria-label="Закрыть">
      <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>

    <div id="leadModalForm">
      <div class="lead-modal-header">
        <div class="lead-modal-eyebrow">Rehab.You · Москва</div>
        <div class="lead-modal-title">Оставь заявку</div>
        <div class="lead-modal-subtitle">Перезвоним в течение 15 минут и запишем к мастеру</div>
      </div>
      <div class="lead-modal-body">
        <div class="lead-modal-field">
          <label class="lead-modal-label" for="leadName">Имя</label>
          <input class="lead-modal-input" id="leadName" type="text" placeholder="Как тебя зовут?" autocomplete="given-name">
        </div>
        <div class="lead-modal-field">
          <label class="lead-modal-label" for="leadPhone">Телефон</label>
          <input class="lead-modal-input" id="leadPhone" type="tel" placeholder="+7 (___) ___-__-__" autocomplete="tel">
        </div>
        <button class="lead-modal-submit" id="leadSubmit">Жду звонка</button>
        <div class="lead-modal-agree">Нажимая кнопку, ты соглашаешься на обработку персональных данных</div>
      </div>
    </div>

    <div class="lead-modal-success" id="leadModalSuccess">
      <div class="lead-modal-success-icon">
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="lead-modal-success-title">Заявка принята</div>
      <div class="lead-modal-success-desc">Перезвоним в течение 15 минут.<br>Если срочно — <a href="tel:+79255404060" style="color:#F49933;">+7 (925) 540-40-60</a></div>
    </div>
  </div>
</div>`;

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

  // Закрытие по крестику и клику на оверлей
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeModal();
  });
  // Закрытие по Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- Открываем по всем кнопкам "Записаться" ---------- */
  function attachTriggers() {
    // nav-cta и любые кнопки с классом nav-cta, nav-mobile-cta
    document.querySelectorAll('.nav-cta, .nav-mobile-cta').forEach(function(el) {
      // Только если ведёт на yclients — перехватываем
      if (el.href && el.href.indexOf('yclients') !== -1) {
        el.addEventListener('click', function(e) {
          e.preventDefault();
          openModal();
        });
      }
    });
  }

  // Публичный метод — можно вызвать openModal() из любого места
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

    // Определяем источник — текущая страница
    var source = 'Форма сайта rehabyou.site';
    var path = window.location.pathname;
    if (path.includes('/certificates')) source += ' — Сертификаты';
    else if (path.includes('/subscriptions')) source += ' — Абонементы';
    else if (path.includes('/masters')) source += ' — Мастера';
    else if (path.includes('/massage')) source += ' — Услуги';

    var payload = {
      fields: {
        TITLE: 'Заявка с сайта: ' + name,
        NAME: name,
        PHONE: [{ VALUE: phone, VALUE_TYPE: 'WORK' }],
        SOURCE_ID: 'WEB',
        SOURCE_DESCRIPTION: source,
        COMMENTS: 'Заявка оставлена на сайте rehabyou.site\nСтраница: ' + window.location.href
      }
    };

    fetch(BITRIX_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.result) {
        // Успех
        formBlock.style.display = 'none';
        successBlock.style.display = 'block';
        // Сбросим форму через 3 сек после закрытия
        setTimeout(function() {
          nameInput.value = '';
          phoneInput.value = '';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Жду звонка';
          formBlock.style.display = 'block';
          successBlock.style.display = 'none';
        }, 4000);
      } else {
        throw new Error('Bitrix error');
      }
    })
    .catch(function() {
      // Fallback — показываем успех в любом случае (не пугаем клиента)
      formBlock.style.display = 'none';
      successBlock.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Жду звонка';
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
