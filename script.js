/* ============================================================
   Configuración — todo lo editable del sitio vive aquí
   ============================================================ */
const CONFIG = {
  // Formato internacional sin "+" ni espacios (Perú: 51 + número).
  whatsappNumber: '51950698621',
  defaultMessage: 'Hola, deseo consultar disponibilidad y precios para el Hotel Continental.',
};

/* Servicios comunes a todas las habitaciones (ids de AMENITY_ICONS). */
const ROOM_AMENITIES = [
  { icon: 'wifi',    label: 'Wi‑Fi de alta velocidad' },
  { icon: 'tv',      label: 'TV' },
  { icon: 'water',   label: 'Agua caliente' },
  { icon: 'laundry', label: 'Servicio de lavandería' },
  { icon: 'parking', label: 'Cochera privada' },
];

/* Fotos: una imagen por habitación en la carpeta raíz (<archivo>.jpg).
   Para añadir más fotos a una habitación, agrega más nombres al arreglo y se activa la galería. */
const photos = (file) => [`${file}.jpg`];
const ROOMS = [
  { id: 'individual',   name: 'Individual',          price: 60,  guests: 1, bed: '1 cama',             tone: '#d9b998', photos: photos('individual'),
    desc: 'Una habitación sencilla y silenciosa, ideal para viajeros solos y profesionales que buscan descansar bien.' },
  { id: 'matrimonial',  name: 'Matrimonial Simple',  price: 70,  guests: 2, bed: 'Cama matrimonial',   tone: '#e0b48f', photos: photos('matrimonial-simple'),
    desc: 'Cama matrimonial para una estadía tranquila en pareja, con todo lo necesario para sentirte en casa.' },
  { id: 'ejecutiva',    name: 'Ejecutiva',           price: 90,  guests: 2, bed: 'Cama matrimonial',   tone: '#c98a5e', photos: photos('ejecutiva'),
    desc: 'Más espacio y confort para viajes de trabajo, pensada para el personal de empresas.' },
  { id: 'doble',        name: 'Doble (2 camas)',     price: 110, guests: 2, bed: '2 camas',            tone: '#d8c3a5', photos: photos('doble'),
    desc: 'Dos camas independientes, perfecta para compañeros de viaje o para familias pequeñas.' },
  { id: 'premium',      name: 'Premium',             price: 140, guests: 2, bed: 'Cama matrimonial',   tone: '#b5683a', photos: photos('premium'),
    desc: 'Nuestra habitación de mayor comodidad, para quienes quieren una estadía más especial.' },
  { id: 'triple',       name: 'Triple (3 camas)',    price: 145, guests: 3, bed: '3 camas',            tone: '#a98467', photos: photos('triple'),
    desc: 'Tres camas para grupos pequeños o familias que prefieren estar juntos.' },
  { id: 'cuadruple',    name: 'Cuádruple (4 camas)', price: 170, guests: 4, bed: '4 camas',            tone: '#8f6a4f', photos: photos('cuadruple'),
    desc: 'Cuatro camas, ideal para equipos de trabajo y familias grandes.' },
];

const ICONS = {
  guests:  '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.300 2.700-6 6-6s6 2.700 6 6M16 5.500a3 3 0 0 1 0 5.500M18 14.500c2 .8 3.500 2.800 3.500 5.500"/>',
  bed:     '<path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="1.500"/>',
  wifi:    '<path d="M2 8.800a15 15 0 0 1 20 0M5 12.500a10 10 0 0 1 14 0M8.500 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.500" r="1" />',
  tv:      '<rect x="2.500" y="5" width="19" height="12" rx="2.500"/><path d="M8 21h8M12 17v4"/>',
  water:   '<path d="M12 3s6 6.500 6 11a6 6 0 0 1-12 0c0-4.500 6-11 6-11z"/>',
  laundry: '<path d="M8 3 3 6v4l3 1v10h12V11l3-1V6l-5-3a4 4 0 0 1-8 0z"/>',
  parking: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9.500 17V7h3.200a3 3 0 0 1 0 6H9.500"/>',
  camera:  '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.500"/>',
};
const icon = (name, attrs = '') => `<svg viewBox="0 0 24 24" aria-hidden="true" ${attrs}>${ICONS[name]}</svg>`;

/* ============================================================
   Canal de contacto (WhatsApp)
   Punto único de integración: para conectar un agente de IA,
   reemplaza `ContactChannel.send` por una llamada a tu backend
   (ver `aiAgentHook`). El resto del sitio no necesita cambios.
   ============================================================ */
const ContactChannel = {
  buildUrl(message = CONFIG.defaultMessage) {
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  },

  // `context`: { source, room, checkin, checkout, guests, name, company }
  async send(message, context = {}) {
    const finalMessage = (await aiAgentHook(message, context)) ?? message;
    window.open(this.buildUrl(finalMessage), '_blank', 'noopener');
  },
};

/**
 * Gancho para un futuro agente de IA con razonamiento.
 * Recibe el mensaje y el contexto estructurado; puede devolver un
 * mensaje mejorado o `null` para usar el original.
 * Ejemplo futuro:
 *   const r = await fetch('/api/agent', { method:'POST', body: JSON.stringify({ message, context }) });
 *   return (await r.json()).reply;
 */
async function aiAgentHook(message, context) {
  return null;
}

/* ============================================================
   Utilidades
   ============================================================ */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const fmtDate = (iso) => new Date(iso + 'T00:00').toLocaleDateString('es-PE', { day: 'numeric', month: 'long' });

/* ============================================================
   Habitaciones
   ============================================================ */
/* <img> con marcador si el archivo no existe */
const photoImg = (src, alt = '') =>
  `<img src="${src}" alt="${alt}" loading="lazy" onerror="this.parentElement.classList.add('missing');this.remove()">`;

const state = { room: 0, photo: 0 };

function renderTabs() {
  $('#room-tabs').innerHTML = ROOMS.map((r, i) => `
    <button class="room-tab" role="tab" id="tab-${r.id}" aria-selected="${i === state.room}" data-index="${i}">
      <span class="tab-thumb" style="--tone:${r.tone}">${photoImg(r.photos[0])}</span>${r.name}
    </button>`).join('');
}

function roomPanelHTML(r) {
  const phText = `<span class="ph">${icon('camera')}Foto próximamente</span>`;
  const multi = r.photos.length > 1;
  return `
    <div class="gallery" style="--tone:${r.tone}">
      <div class="g-main" id="g-main">
        ${phText}
        ${photoImg(r.photos[state.photo], `${r.name}, foto ${state.photo + 1}`)}
        ${multi ? `<button class="g-arrow g-prev" data-dir="-1" aria-label="Foto anterior">←</button>
        <button class="g-arrow g-next" data-dir="1" aria-label="Foto siguiente">→</button>
        <div class="g-dots">${r.photos.map((_, i) => `<button class="g-dot${i === state.photo ? ' on' : ''}" data-photo="${i}" aria-label="Foto ${i + 1}"></button>`).join('')}</div>` : ''}
      </div>
      ${multi ? `<div class="g-thumbs">
        ${r.photos.map((p, i) => `<button class="g-thumb${i === state.photo ? ' on' : ''}" data-photo="${i}" aria-label="Ver foto ${i + 1}">${photoImg(p)}</button>`).join('')}
      </div>` : ''}
    </div>
    <div class="room-info">
      <h3>${r.name}</h3>
      <p class="occupancy">Ocupación máxima: ${r.guests} ${r.guests === 1 ? 'persona' : 'personas'}</p>
      <p>${r.desc}</p>
      <div class="specs">
        <div class="spec">${icon('guests')}<small>Capacidad</small><strong>${r.guests} ${r.guests === 1 ? 'persona' : 'personas'}</strong></div>
        <div class="spec">${icon('bed')}<small>Tipo de cama</small><strong>${r.bed}</strong></div>
      </div>
      <h4>Servicios de la habitación</h4>
      <ul class="amenities">${ROOM_AMENITIES.map((a) => `<li>${icon(a.icon)}${a.label}</li>`).join('')}</ul>
      <div class="room-cta">
        <span class="price">S/ ${r.price} <small>por noche</small></span>
        <a href="#" class="btn btn-reserve" data-whatsapp data-room="${r.name}">Reservar</a>
      </div>
    </div>`;
}

function showPhoto(i) {
  const r = ROOMS[state.room];
  state.photo = (i + r.photos.length) % r.photos.length;
  const main = $('#g-main');
  main.classList.add('fading');
  setTimeout(() => {
    const old = $('img', main);
    main.classList.remove('missing', 'fading');
    if (old) old.remove();
    main.insertAdjacentHTML('afterbegin', photoImg(r.photos[state.photo], `${r.name}, foto ${state.photo + 1}`));
  }, 200);
  $$('.g-dot', main).forEach((d, n) => d.classList.toggle('on', n === state.photo));
  $$('.g-thumb').forEach((t, n) => t.classList.toggle('on', n === state.photo));
}

function selectRoom(i, animate = true) {
  state.room = i;
  state.photo = 0;
  const panel = $('#room-panel');
  const paint = () => {
    panel.innerHTML = roomPanelHTML(ROOMS[i]);
    panel.setAttribute('aria-labelledby', `tab-${ROOMS[i].id}`);
    panel.classList.remove('swap');
  };
  $$('.room-tab').forEach((t, n) => {
    t.setAttribute('aria-selected', n === i);
    if (n === i) t.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  });
  if (!animate) return paint();
  panel.classList.add('swap');
  setTimeout(paint, 250);
}

function renderRooms() {
  renderTabs();
  selectRoom(0, false);

  $('#room-tabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.room-tab');
    if (tab && +tab.dataset.index !== state.room) selectRoom(+tab.dataset.index);
  });
  $('#room-tabs').addEventListener('keydown', (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    const next = (state.room + step + ROOMS.length) % ROOMS.length;
    selectRoom(next);
    $$('.room-tab')[next].focus();
  });
  $('#room-panel').addEventListener('click', (e) => {
    const arrow = e.target.closest('.g-arrow');
    const pick = e.target.closest('[data-photo]');
    if (arrow) showPhoto(state.photo + +arrow.dataset.dir);
    else if (pick) showPhoto(+pick.dataset.photo);
  });
}

/* ============================================================
   Enlaces y formularios
   ============================================================ */
function bindWhatsAppLinks() {
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-whatsapp]');
    if (!el) return;
    e.preventDefault();
    const room = el.dataset.room;
    const source = el.dataset.whatsapp || 'general';
    let msg = CONFIG.defaultMessage;
    if (room) msg = `Hola, deseo consultar disponibilidad y precio de la habitación ${room} en el Hotel Continental.`;
    if (source === 'empresa') msg = 'Hola, represento a una empresa y deseo consultar tarifas y disponibilidad corporativa en el Hotel Continental.';
    ContactChannel.send(msg, { source, room });
  });
}

function bindBooking() {
  const form = $('#booking');
  const msg = $('#booking-msg');
  form.checkin.min = new Date().toISOString().split('T')[0];
  form.checkin.addEventListener('change', () => { form.checkout.min = form.checkin.value; });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { checkin, checkout, guests } = form;
    if (!checkin.value || !checkout.value || checkout.value <= checkin.value) {
      msg.textContent = 'Elige fechas válidas de llegada y salida.';
      return;
    }
    msg.textContent = '';
    ContactChannel.send(
      `Hola, deseo consultar disponibilidad y precios para el Hotel Continental. Llegada: ${fmtDate(checkin.value)}, salida: ${fmtDate(checkout.value)}, huéspedes: ${guests.value}.`,
      { source: 'booking', checkin: checkin.value, checkout: checkout.value, guests: guests.value }
    );
  });
}

function bindContact() {
  const form = $('#contact');
  const msg = $('#contact-msg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const empresa = form.empresa.value.trim();
    const mensaje = form.mensaje.value.trim();
    if (!nombre || !mensaje) {
      msg.textContent = 'Completa tu nombre y tu mensaje.';
      return;
    }
    msg.textContent = '';
    ContactChannel.send(
      `Hola, soy ${nombre}${empresa ? ` de ${empresa}` : ''}. ${mensaje}`,
      { source: 'contact', name: nombre, company: empresa }
    );
  });
}

/* ============================================================
   UI: nav y animaciones
   ============================================================ */
function bindUI() {
  $('#year').textContent = new Date().getFullYear();
  const nav = $('#nav');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20), { passive: true });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    io.observe(el);
  });
}

renderRooms();
bindWhatsAppLinks();
bindBooking();
bindContact();
bindUI();
