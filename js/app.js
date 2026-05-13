const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const state = {
  title: 'Cena con el grupo',
  type: 'Cena',
  note: 'Confirmen antes del jueves. Sin cuenta, solo voten.',
  days: ['Viernes', 'Sábado'],
  hours: ['7:00 PM', '8:30 PM'],
  anonymous: false,
  deadline: true,
  link: 'https://cuando.app/p/demo',
  participants: ['Yael', 'Ana', 'Luis', 'Carlos', 'Sofía', 'Mia'],
  votes: []
};

const planPresets = {
  Cena: {
    title: 'Cena con el grupo',
    note: 'Confirmen antes del jueves. Reservamos cuando salga el mejor horario.',
    days: ['Viernes', 'Sábado'],
    hours: ['7:00 PM', '8:30 PM', '9:30 PM']
  },
  Cine: {
    title: 'Cine esta semana',
    note: 'Voten rápido para comprar entradas juntos.',
    days: ['Viernes', 'Sábado', 'Domingo'],
    hours: ['7:00 PM', '8:30 PM', '10:00 PM']
  },
  Reunión: {
    title: 'Reunión rápida',
    note: 'Elijan las opciones que realmente puedan cumplir.',
    days: ['Lunes', 'Viernes'],
    hours: ['7:00 PM', '8:30 PM']
  },
  Cumpleaños: {
    title: 'Cumpleaños sorpresa',
    note: 'No escriban detalles en el grupo principal 👀',
    days: ['Viernes', 'Sábado'],
    hours: ['8:30 PM', '9:30 PM', '10:00 PM']
  },
  'Gaming night': {
    title: 'Gaming night',
    note: 'Voten horario para conectarnos todos.',
    days: ['Viernes', 'Sábado', 'Domingo'],
    hours: ['8:30 PM', '9:30 PM', '10:00 PM']
  },
  Trabajo: {
    title: 'Revisión de proyecto',
    note: 'Elijan horario disponible para cerrar pendientes.',
    days: ['Lunes', 'Viernes'],
    hours: ['7:00 PM', '8:30 PM']
  },
  'Viaje corto': {
    title: 'Plan de viaje corto',
    note: 'Elijan el mejor día para cuadrar transporte y presupuesto.',
    days: ['Sábado', 'Domingo'],
    hours: ['7:00 PM', '8:30 PM']
  }
};

function init() {
  window.addEventListener('load', () => {
    setTimeout(() => $('#preloader')?.classList.add('is-hidden'), 700);
  });

  initCursorGlow();
  initHeader();
  initParticles();
  initReveal();
  initTilt();
  initFaq();
  initMagneticButtons();
  initForm();
  generatePlan({ silent: true });
}

function initCursorGlow() {
  const glow = $('#cursorGlow');
  if (!glow) return;
  window.addEventListener('pointermove', (event) => {
    glow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
  }, { passive: true });
}

function initHeader() {
  const header = $('#siteHeader');
  const update = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initParticles() {
  const holder = $('#particles');
  if (!holder) return;
  const count = window.matchMedia('(max-width: 640px)').matches ? 24 : 46;
  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${12 + Math.random() * 18}s`;
    particle.style.animationDelay = `${Math.random() * -22}s`;
    particle.style.setProperty('--drift', `${-80 + Math.random() * 160}px`);
    holder.appendChild(particle);
  }
}

function initReveal() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  items.forEach((item) => observer.observe(item));
}

function initTilt() {
  $$('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const rotateX = ((y / bounds.height) - 0.5) * -8;
      const rotateY = ((x / bounds.width) - 0.5) * 8;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  });
}

function initFaq() {
  $$('#faqList .faq-item').forEach((item, index) => {
    if (index === 0) item.classList.add('is-open');
    item.addEventListener('click', () => {
      item.classList.toggle('is-open');
    });
  });
}

function initMagneticButtons() {
  $$('.magnetic').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const bounds = button.getBoundingClientRect();
      const x = event.clientX - bounds.left - bounds.width / 2;
      const y = event.clientY - bounds.top - bounds.height / 2;
      button.style.transform = `translate(${x * 0.08}px, ${y * 0.14}px)`;
    });
    button.addEventListener('pointerleave', () => {
      button.style.transform = 'translate(0, 0)';
    });
  });
}

function initForm() {
  const form = $('#planForm');
  const titleInput = $('#planTitle');
  const typeSelect = $('#planType');
  const noteInput = $('#planNote');
  const anonymousInput = $('#anonymousVotes');
  const deadlineInput = $('#deadline');

  $$('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      syncFormState();
      updatePreview();
    });
  });

  [titleInput, typeSelect, noteInput, anonymousInput, deadlineInput].forEach((input) => {
    input?.addEventListener('input', () => {
      syncFormState();
      updatePreview();
    });
    input?.addEventListener('change', () => {
      syncFormState();
      updatePreview();
    });
  });

  typeSelect?.addEventListener('change', () => {
    applyPreset(typeSelect.value, { soft: true });
  });

  $('#smartFillBtn')?.addEventListener('click', () => {
    applyPreset($('#planType')?.value || 'Cena');
    showToast('Plan inteligente aplicado ✨');
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    syncFormState();
    generatePlan();
  });

  $('#copyLinkBtn')?.addEventListener('click', copyPlanLink);
  $('#storyBtn')?.addEventListener('click', createStoryCard);
  $('#calendarBtn')?.addEventListener('click', exportCalendar);
}

function applyPreset(type, options = {}) {
  const preset = planPresets[type] || planPresets.Cena;
  const titleInput = $('#planTitle');
  const noteInput = $('#planNote');

  if (!options.soft || !titleInput.value.trim()) titleInput.value = preset.title;
  if (!options.soft || !noteInput.value.trim()) noteInput.value = preset.note;

  $$('.chip[data-day]').forEach((chip) => {
    chip.classList.toggle('active', preset.days.includes(chip.dataset.day));
  });
  $$('.chip[data-hour]').forEach((chip) => {
    chip.classList.toggle('active', preset.hours.includes(chip.dataset.hour));
  });

  syncFormState();
  updatePreview();
}

function syncFormState() {
  state.title = $('#planTitle')?.value.trim() || 'Plan sin nombre';
  state.type = $('#planType')?.value || 'Cena';
  state.note = $('#planNote')?.value.trim() || '';
  state.days = $$('.chip.active[data-day]').map((chip) => chip.dataset.day);
  state.hours = $$('.chip.active[data-hour]').map((chip) => chip.dataset.hour);
  state.anonymous = Boolean($('#anonymousVotes')?.checked);
  state.deadline = Boolean($('#deadline')?.checked);

  if (state.days.length === 0) state.days = ['Viernes'];
  if (state.hours.length === 0) state.hours = ['8:30 PM'];
}

function getSlots() {
  return state.days.flatMap((day) => state.hours.map((hour) => ({ day, hour, label: `${day} · ${hour}` })));
}

function generatePlan(options = {}) {
  syncFormState();
  const payload = encodeURIComponent(JSON.stringify({
    t: state.title,
    type: state.type,
    d: state.days,
    h: state.hours,
    v: 1
  }));

  state.link = `https://cuando.app/p/${makeSlug(state.title)}#${payload}`;
  state.votes = simulateVotes(getSlots());

  updatePreview();
  if (!options.silent) {
    showConfetti();
    showToast('Link premium generado');
  }
}

function simulateVotes(slots) {
  const favoriteIndex = Math.min(1, Math.max(0, slots.length - 1));
  return slots.map((slot, index) => {
    const voters = state.participants.filter((_, participantIndex) => {
      const base = index === favoriteIndex ? 0.86 : 0.58 - index * 0.08;
      const wave = ((participantIndex + 1) * (index + 2)) % 5 / 10;
      return Math.max(0.16, base + wave * 0.13) > 0.52;
    });
    return { ...slot, count: voters.length, voters };
  }).sort((a, b) => b.count - a.count);
}

function updatePreview() {
  const slots = getSlots();
  const votePreview = $('#votePreview');
  const link = $('#generatedLink');
  const whatsApp = $('#whatsappBtn');

  if (link) link.textContent = state.link;

  const message = `Hice un plan en CUÁNDO: ${state.title}. Voten aquí: ${state.link}`;
  if (whatsApp) whatsApp.href = `https://wa.me/?text=${encodeURIComponent(message)}`;

  if (votePreview) {
    votePreview.innerHTML = slots.slice(0, 5).map((slot) => `
      <div class="vote-card">
        <div>
          <strong>${escapeHtml(slot.day)} · ${escapeHtml(slot.hour)}</strong>
          <span>${escapeHtml(state.type)} · toca para votar</span>
        </div>
        <button type="button">Votar</button>
      </div>
    `).join('');
  }

  if (!state.votes.length) state.votes = simulateVotes(slots);
  renderResult();
}

function renderResult() {
  const ranking = $('#ranking');
  const bestSlot = $('#bestSlot');
  const bestMeta = $('#bestMeta');
  const finalMessage = $('#finalMessage');
  const votes = state.votes.length ? state.votes : simulateVotes(getSlots());
  const best = votes[0];
  const max = Math.max(...votes.map((vote) => vote.count), 1);

  if (bestSlot) bestSlot.textContent = `${best.day} · ${best.hour}`;
  if (bestMeta) bestMeta.textContent = `${best.count} de ${state.participants.length} personas disponibles`;
  if (finalMessage) {
    const names = state.anonymous ? 'el grupo' : best.voters.slice(0, 5).join(', ');
    finalMessage.textContent = `Listo, el mejor horario para “${state.title}” es ${best.day} a las ${best.hour}. Confirmados: ${names}.`;
  }

  if (ranking) {
    ranking.innerHTML = votes.slice(0, 5).map((vote, index) => {
      const width = Math.round((vote.count / max) * 100);
      return `
        <div class="rank-row">
          <div class="rank-row__top">
            <span>${index + 1}. ${escapeHtml(vote.day)} · ${escapeHtml(vote.hour)}</span>
            <small>${vote.count}/${state.participants.length}</small>
          </div>
          <div class="rank-bar"><span style="width:${width}%"></span></div>
        </div>
      `;
    }).join('');
  }
}

async function copyPlanLink() {
  try {
    await navigator.clipboard.writeText(state.link);
    showToast('Link copiado');
  } catch (error) {
    const temp = document.createElement('textarea');
    temp.value = state.link;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    temp.remove();
    showToast('Link copiado');
  }
}

function createStoryCard() {
  const canvas = $('#storyCanvas');
  const ctx = canvas.getContext('2d');
  const best = state.votes[0] || simulateVotes(getSlots())[0];

  const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
  gradient.addColorStop(0, '#07070E');
  gradient.addColorStop(0.55, '#101018');
  gradient.addColorStop(1, '#151026');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1920);

  drawOrb(ctx, 900, 180, 380, 'rgba(139,92,246,.32)');
  drawOrb(ctx, 140, 1520, 520, 'rgba(203,255,0,.20)');

  ctx.fillStyle = '#CBFF00';
  roundRect(ctx, 86, 96, 116, 116, 36);
  ctx.fill();
  ctx.fillStyle = '#07070E';
  ctx.font = '900 88px Inter, Arial';
  ctx.textAlign = 'center';
  ctx.fillText('?', 144, 181);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '900 76px Inter, Arial';
  ctx.fillText('CUÁNDO', 230, 172);
  ctx.fillStyle = '#A1A1AA';
  ctx.font = '500 32px Inter, Arial';
  ctx.fillText('Plan confirmado por Smart Match V1', 90, 310);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = '900 96px Inter, Arial';
  wrapCanvasText(ctx, state.title, 90, 520, 900, 105);

  ctx.fillStyle = 'rgba(255,255,255,.08)';
  roundRect(ctx, 90, 850, 900, 440, 48);
  ctx.fill();
  ctx.strokeStyle = 'rgba(203,255,0,.30)';
  ctx.lineWidth = 3;
  roundRect(ctx, 90, 850, 900, 440, 48);
  ctx.stroke();

  ctx.fillStyle = '#CBFF00';
  ctx.font = '900 42px Inter, Arial';
  ctx.fillText('MEJOR MOMENTO', 150, 950);
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '900 84px Inter, Arial';
  ctx.fillText(best.day, 150, 1066);
  ctx.font = '900 108px Inter, Arial';
  ctx.fillText(best.hour, 150, 1195);

  ctx.fillStyle = '#A1A1AA';
  ctx.font = '600 34px Inter, Arial';
  ctx.fillText(`${best.count} de ${state.participants.length} personas disponibles`, 150, 1370);
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '800 38px Inter, Arial';
  ctx.fillText('Menos mensajes. Más planes.', 90, 1700);
  ctx.fillStyle = '#CBFF00';
  ctx.font = '800 32px Inter, Arial';
  ctx.fillText('cuando.app', 90, 1760);

  downloadUrl(canvas.toDataURL('image/png'), `cuando-${makeSlug(state.title)}-story.png`);
  showToast('Story PNG creado');
}

function drawOrb(ctx, x, y, size, color) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = test;
    }
  });
  ctx.fillText(line, x, currentY);
}

function exportCalendar() {
  const best = state.votes[0] || simulateVotes(getSlots())[0];
  const start = nextDateForDay(best.day, best.hour);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CUANDO//Core V1//ES',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@cuando.app`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${escapeIcs(state.title)}`,
    `DESCRIPTION:${escapeIcs(state.note || 'Plan creado con CUÁNDO')}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  downloadUrl(URL.createObjectURL(blob), `cuando-${makeSlug(state.title)}.ics`);
  showToast('Calendario exportado');
}

function nextDateForDay(dayName, hourLabel) {
  const dayMap = { Domingo: 0, Lunes: 1, Martes: 2, Miércoles: 3, Miercoles: 3, Jueves: 4, Viernes: 5, Sábado: 6, Sabado: 6 };
  const now = new Date();
  const targetDay = dayMap[dayName] ?? 5;
  const date = new Date(now);
  let diff = targetDay - now.getDay();
  if (diff <= 0) diff += 7;
  date.setDate(now.getDate() + diff);

  const match = hourLabel.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (match) {
    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const meridiem = match[3].toUpperCase();
    if (meridiem === 'PM' && hour < 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;
    date.setHours(hour, minute, 0, 0);
  }
  return date;
}

function formatIcsDate(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}

function escapeIcs(value) {
  return String(value).replace(/[\\,;]/g, '\\$&').replace(/\n/g, '\\n');
}

function downloadUrl(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  if (url.startsWith('blob:')) setTimeout(() => URL.revokeObjectURL(url), 500);
}

function makeSlug(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 46) || 'plan';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (match) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
  }[match]));
}

function showToast(message) {
  let toast = $('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function showConfetti() {
  const colors = ['#CBFF00', '#8B5CF6', '#FFFFFF'];
  for (let index = 0; index < 34; index += 1) {
    const piece = document.createElement('span');
    piece.style.position = 'fixed';
    piece.style.zIndex = '180';
    piece.style.left = `${50 + (Math.random() * 28 - 14)}%`;
    piece.style.top = '42%';
    piece.style.width = `${6 + Math.random() * 9}px`;
    piece.style.height = `${9 + Math.random() * 16}px`;
    piece.style.borderRadius = '3px';
    piece.style.background = colors[index % colors.length];
    piece.style.pointerEvents = 'none';
    piece.style.boxShadow = '0 0 18px rgba(203,255,0,.22)';
    const x = Math.random() * 420 - 210;
    const y = Math.random() * 360 + 180;
    const rotate = Math.random() * 720;
    piece.animate([
      { transform: 'translate3d(0,0,0) rotate(0deg)', opacity: 1 },
      { transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg)`, opacity: 0 }
    ], { duration: 1000 + Math.random() * 700, easing: 'cubic-bezier(.2,.7,.2,1)' });
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 1800);
  }
}

init();
