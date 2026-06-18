/* =============================================
   CONFIG.JS — Configuración centralizada
   Edita aquí todos los textos, imágenes y música
   ============================================= */
'use strict';

const CONFIG = {

  // ── Nombre de la persona destinataria ─────────────
  nombre: "May",

  // ── Textos de la pantalla de apertura ──────────────
  tituloApertura: "Para May, con todo mi amor",
  subtituloApertura: "Un regalo hecho con cada latido de mi corazón 💗",

  // ── Frases cortas que orbitan la galaxia ───────────
  // Al hacer clic se abre el mensaje largo correspondiente (ver mensajesLargos)
  frases: [
    "Eres mi universo, May",
    "Cada latido es por ti",
    "May, mi corazón baila contigo",
    "Eres la luz de mi galaxia",
    "Contigo, eternidad",
  ],

  // ── Mensajes largos (clave = frase corta exacta) ───
  mensajesLargos: {
    "Eres mi universo, May": "May, desde que llegaste a mi vida, mi mundo entero cambió de color. Eres el centro de todo lo que gira a mi alrededor, mi estrella más brillante, mi universo entero.",
    "Cada latido es por ti": "Cada vez que mi corazón late, lo hace pensando en ti. No hay un solo segundo del día en que no estés en mis pensamientos, May. Tú eres el ritmo de mi vida.",
    "May, mi corazón baila contigo": "Cuando estoy contigo siento que mi corazón baila al compás de una canción que solo nosotros conocemos. Cada momento juntos es una melodía inolvidable.",
    "Eres la luz de mi galaxia": "En medio de toda la oscuridad, tú siempre eres la luz que ilumina mi camino. Eres la estrella más brillante en mi pequeño universo, May.",
    "Contigo, eternidad": "No me imagino el tiempo sin ti. Contigo, cada segundo se siente como una eternidad hermosa que quiero vivir una y otra vez, para siempre.",
  },

  // ── Palabras clave interactivas (con su propio estilo) ──
  palabrasClave: {
    "Recuerdos":  "Nuestro primer viaje juntos, tus risas que no se callan nunca, tus abrazos que me hacen sentir en casa... cada recuerdo contigo es un tesoro que guardo en mi corazón.",
    "Promesas":   "Te prometo amarte siempre, en los días fáciles y en los difíciles. Te prometo ser tu compañero, tu refugio y tu mayor admirador por toda la vida.",
    "Futuro":     "Sueño con un futuro lleno de aventuras a tu lado, de risas compartidas, de metas alcanzadas juntos. Quiero construir contigo cada capítulo que viene.",
    "Eternidad":  "Si la eternidad existe, quiero pasarla completa a tu lado. Ningún tiempo es suficiente para amarte como mereces, así que elijo amarte para siempre.",
    "Aventura":   "Contigo cada día es una aventura nueva. Ya sea explorando lugares nuevos o simplemente quedándonos en casa, todo se vuelve especial cuando estás tú.",
  },

  // ── Colores pastel del corazón y partículas ────────
  colores: ["#FFB6C1", "#FF6B81", "#FFD1DC", "#FFDAB9", "#FF85A2"],

  // ── Canciones (solo nombres de archivo, carpeta assets/music/) ──
  canciones: [
    { nombre: "Nuestra Canción",   archivo: "cancion1.mp3" },
    { nombre: "Eres Tú",           archivo: "cancion2.mp3" },
    { nombre: "Amor Eterno",       archivo: "cancion3.mp3" },
  ],

  // ── Imágenes orbitando (carpeta assets/img/) ───────
  imagenes: ["foto1.jpg", "foto2.jpg", "foto3.jpg", "foto4.jpg"],

  // ── Frases cortas para partículas de clic ──────────
  frasesClicCorto: [
    "Te amo May", "Eres mi sol", "Siempre tú", "Mi alma", "Eres perfecta",
    "Mi todo", "Mi reina", "Para siempre", "Mi vida", "Eres mágica",
  ],

  // ── Emojis para partículas de clic ─────────────────
  emojisClick: ["💖","✨","🌸","🌹","💫","🌺","❤️‍🔥","💕"],

  // ── Mensaje al terminar la playlist completa ───────
  mensajeFinPlaylist: "May, esta canción termina, pero nuestro amor no 💗",

  // ── Parámetros de física / animación ───────────────
  velocidadOrbita: 0.0025,       // velocidad de rotación de la galaxia
  cantidadParticulas: 3500,      // partículas que forman el corazón central
  duracionCarga: 2.5,            // segundos que dura la pantalla de carga (sin acelerar)
  radioCorazon: 70,              // tamaño base del corazón de partículas
  windEffectRadius: 140,         // radio de "viento" alrededor del mouse (px en pantalla)
};
