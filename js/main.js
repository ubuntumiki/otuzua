// ===== Тема (light/dark) =====
const root = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
function applyTheme(v) {
  root.classList.toggle('light', v === 'light');
  themeBtn.textContent = v === 'light' ? '☀️' : '🌙';
  localStorage.setItem('theme', v);
}
applyTheme(localStorage.getItem('theme') || 'dark');
themeBtn.addEventListener('click', () => {
  applyTheme(root.classList.contains('light') ? 'dark' : 'light');
});

// ===== Мобільне меню =====
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn?.addEventListener('click', () => {
  const open = mobileMenu.hasAttribute('hidden');
  mobileMenu.toggleAttribute('hidden');
  menuBtn.setAttribute('aria-expanded', open);
});
function closeMenu() {
  mobileMenu.setAttribute('hidden', '');
  menuBtn.setAttribute('aria-expanded', 'false');
}
window.closeMenu = closeMenu;

// ===== Плавний скрол =====
function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
window.scrollToId = scrollToId;

// ===== Перемикач оплати (місяць/рік) =====
const toggle = document.getElementById('billingToggle');
toggle?.addEventListener('change', () => {
  document.querySelectorAll('.price-value').forEach(el => {
    const month = el.dataset.month,
      year = el.dataset.year;
    if (toggle.checked) {
      el.textContent = year + '₴';
      el.nextElementSibling?.replaceChildren(document.createTextNode(' / рік'));
    } else {
      el.textContent = month + '₴';
      el.nextElementSibling?.replaceChildren(document.createTextNode(' / міс'));
    }
  });
});

// ===== Покриття (демо логіка; змініть під ваші дані) =====
const streets = [
  'Котляревського', 'Собранецька', 'Легоцького', 'Минайська', 'Заньковецької',
  'Капушанська', '8 Березня', 'Гагаріна', 'Фединця', 'Швабська', 'Володимирська', 'Шумна'
];
function checkCoverage() {
  const addr = document.getElementById('addr').value.trim();
  const area = document.getElementById('area').value.trim().toLowerCase();
  const box = document.getElementById('coverageResult');
  box.innerHTML = '';
  if (!addr) {
    box.innerHTML = '<p class="muted">Вкажіть адресу.</p>';
    return;
  }
  const hit = streets.find(s => addr.toLowerCase().includes(s.toLowerCase()));
  if (hit && (!area || area.includes('уж') || area.includes('uzh'))) {
    box.innerHTML = `<div class="tag">✅ <b>Покриття знайдено</b></div>
      <p>На адресі <b>${addr}</b> доступні: <b>GPON</b>, <b>500 Мбіт</b>, <b>1 Гбіт</b>. Можлива підготовка до <b>XGS‑PON</b>.</p>
      <button class="btn btn-primary" onclick="scrollToId('contact')">Залишити заявку</button>`;
  } else {
    box.innerHTML = `<div class="tag">ℹ️ <b>Потрібна перевірка</b></div>
      <p>Залиште заявку — інженер перевірить можливість підключення протягом робочого дня.</p>
      <button class="btn btn-ghost" onclick="scrollToId('contact')">Залишити заявку</button>`;
  }
}
window.checkCoverage = checkCoverage;

// ===== Браузерні мережеві показники =====
function updateNetInfo() {
  const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  document.getElementById('downlink').textContent = c?.downlink ? c.downlink + ' Мбіт/с*' : 'Н/Д';
  document.getElementById('rtt').textContent = c?.rtt ? c.rtt + ' мс*' : 'Н/Д';
}
updateNetInfo();
(navigator.connection || {}).addEventListener?.('change', updateNetInfo);

// ===== Замовлення через модалку =====
const orderModal = document.getElementById('orderModal');
let selectedPlan = null;
function openOrder(btn) {
  const card = btn.closest('[data-plan]');
  selectedPlan = card?.dataset.plan || null;
  document.getElementById('modalPlan').textContent = selectedPlan || '—';
  orderModal.showModal();
}
function prefillPlan() {
  if (selectedPlan) {
    document.querySelector('select[name="plan"]').value = selectedPlan;
  }
}
window.openOrder = openOrder;
window.prefillPlan = prefillPlan;

// ===== Відправка форми (демо: відкриває e-mail клієнт) =====
function submitLead(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  // TODO: замініть на реальний бекенд або Formspree / API бота
  const subject = encodeURIComponent('Заявка з сайту — ' + (data.plan || ''));
  const body = encodeURIComponent(
    `Імʼя: ${data.name}\nТелефон: ${data.phone}\nАдреса: ${data.address}\nТариф: ${data.plan}\nКоментар: ${data.comment || ''}`
  );
  window.location.href = `mailto:support@onlinetelecom.uz.ua?subject=${subject}&body=${body}`;
}
window.submitLead = submitLead;

// ===== Рік у футері =====
document.getElementById('year').textContent = new Date().getFullYear();
