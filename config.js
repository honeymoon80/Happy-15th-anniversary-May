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

  // ── Pantalla de aniversario (opcional) ─────────────
  // Si activo=true, la apertura muestra esta imagen + texto en vez del título normal.
  // Si activo=false, se muestra tituloApertura/subtituloApertura como siempre.
  aniversario: {
    activo: true,
    imagen: "aniversario15.webp",
    texto: "15 años a tu lado 💗",
  },

  // ── Frases cortas que orbitan la galaxia ───────────
  // Al hacer clic se abre la carta polaroid con el mensaje largo (mensajesLargos)
  // y la foto correspondiente (fotosFrases). Deben tener la MISMA cantidad y orden.
  frases: [
    "Eres mi universo, May",
    "Cada latido es por ti",
    "May, mi corazón baila contigo",
    "Eres la luz de mi galaxia",
    "Contigo, eternidad",
    "Eres mi sueño hecho realidad",
    "Tu sonrisa ilumina mi mundo",
    "Eres mi razón de ser",
  ],

  // ── Mensajes largos (clave = frase corta exacta) ───
  mensajesLargos: {
    "Eres mi universo, May": "May, desde que llegaste a mi vida, mi mundo entero cambió de color. Eres el centro de todo lo que gira a mi alrededor, mi estrella más brillante, mi universo entero.",
    "Cada latido es por ti": "Cada vez que mi corazón late, lo hace pensando en ti. No hay un solo segundo del día en que no estés en mis pensamientos, May. Tú eres el ritmo de mi vida.",
    "May, mi corazón baila contigo": "Cuando estoy contigo siento que mi corazón baila al compás de una canción que solo nosotros conocemos. Cada momento juntos es una melodía inolvidable.",
    "Eres la luz de mi galaxia": "En medio de toda la oscuridad, tú siempre eres la luz que ilumina mi camino. Eres la estrella más brillante en mi pequeño universo, May.",
    "Contigo, eternidad": "No me imagino el tiempo sin ti. Contigo, cada segundo se siente como una eternidad hermosa que quiero vivir una y otra vez, para siempre.",
    "Eres mi sueño hecho realidad": "Hay sueños que nunca pensé que se cumplirían, y tú eres el más hermoso de todos. Cada día a tu lado confirmo que la realidad puede ser mejor que cualquier sueño.",
    "Tu sonrisa ilumina mi mundo": "Tu sonrisa tiene el poder de cambiar mi día entero. No importa qué tan difícil sea el momento, verte sonreír me recuerda por qué vale la pena todo.",
    "Eres mi razón de ser": "Antes de ti, mi vida tenía un rumbo. Contigo, encontré un propósito. Eres mi razón de ser, mi motivación de cada mañana y mi paz de cada noche.",
  },

  // ── Foto polaroid asociada a cada frase corta (mismo orden que `frases`) ──
  // Carpeta: assets/img/
  fotosFrases: {
    "Eres mi universo, May":         "msg_foto1.webp",
    "Cada latido es por ti":         "msg_foto2.webp",
    "May, mi corazón baila contigo": "msg_foto3.webp",
    "Eres la luz de mi galaxia":     "msg_foto4.webp",
    "Contigo, eternidad":            "msg_foto5.webp",
    "Eres mi sueño hecho realidad":  "msg_foto6.webp",
    "Tu sonrisa ilumina mi mundo":   "msg_foto7.webp",
    "Eres mi razón de ser":          "msg_foto8.webp",
  },

  // ── Palabras clave interactivas (con su propio estilo) ──
  palabrasClave: {
    "Recuerdos":  "Nuestro primer viaje juntos, tus risas que no se callan nunca, tus abrazos que me hacen sentir en casa... cada recuerdo contigo es un tesoro que guardo en mi corazón.",
    "Promesas":   "Te prometo amarte siempre, en los días fáciles y en los difíciles. Te prometo ser tu compañero, tu refugio y tu mayor admirador por toda la vida.",
    "Futuro":     "Sueño con un futuro lleno de aventuras a tu lado, de risas compartidas, de metas alcanzadas juntos. Quiero construir contigo cada capítulo que viene.",
    "Eternidad":  "Si la eternidad existe, quiero pasarla completa a tu lado. Ningún tiempo es suficiente para amarte como mereces, así que elijo amarte para siempre.",
    "Aventura":   "Contigo cada día es una aventura nueva. Ya sea explorando lugares nuevos o simplemente quedándonos en casa, todo se vuelve especial cuando estás tú.",
  },

  // ── Modal final espectacular (al completar las 8 frases) ──
  modalFinal: {
    titulo: "Cada palabra fue un latido, cada latido fue por ti",
    mensaje: "May, desde que llegaste a mi vida, cada palabra que te escribo se queda corta para describir lo que siento. Has leído cada una de mis frases, cada latido convertido en palabras, y eso para mí significa todo. Quiero que sepas que cada día a tu lado es un regalo, que tu amor es el motor de mi vida entera, y que no existe distancia, tiempo ni circunstancia que pueda apagar lo que siento por ti. Gracias por ser mi compañera, mi mejor amiga y el amor de mi vida. Esto apenas es el comienzo de todo lo que quiero vivir contigo, May. Te amo con todo lo que soy, hoy, mañana y siempre.",
    imagenes: ["final_foto1.webp", "final_foto2.webp", "final_foto3.webp", "final_foto4.webp"],
  },

  // ── Colores pastel del corazón y partículas ────────
  colores: ["#FFB6C1", "#FF6B81", "#FFD1DC", "#FFDAB9", "#FF85A2"],

  // ── Canciones (solo nombres de archivo, carpeta assets/music/) ──
  canciones: [
    { nombre: "Nuestra Canción",   archivo: "cancion1.mp3" },
    { nombre: "Eres Tú",           archivo: "cancion2.mp3" },
    { nombre: "Amor Eterno",       archivo: "cancion3.mp3" },
    { nombre: "Para Siempre",      archivo: "cancion4.mp3" },
  ],

  // ── Imágenes orbitando (carpeta assets/img/) ───────
  // 28 imágenes en formato WEBP, repartidas en 3 anillos (cerca/medio/lejos)
  imagenes: [
    "foto1.webp","foto2.webp","foto3.webp","foto4.webp",
    "foto5.webp","foto6.webp","foto7.webp","foto8.webp",
    "foto9.webp","foto10.webp","foto11.webp","foto12.webp",
    "foto13.webp","foto14.webp","foto15.webp","foto16.webp",
    "foto17.webp","foto18.webp","foto19.webp","foto20.webp",
    "foto21.webp","foto22.webp","foto23.webp","foto24.webp",
    "foto25.webp","foto26.webp","foto27.webp","foto28.webp",
  ],

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

  // ── Imágenes orbitando: tamaño variable (px) ───────
  imgOrbitMinSize: 80,
  imgOrbitMaxSize: 120,
};
