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
    texto: "💗15 meses a tu lado mi niñita bem helmoshita de mi korashon<3💗",
  },

  // ── Frases cortas que orbitan la galaxia ───────────
  // Al hacer clic se abre la carta polaroid con el mensaje largo (mensajesLargos)
  // y la foto correspondiente (fotosFrases). Deben tener la MISMA cantidad y orden.
  frases: [
    "🌌💗eres todito mi UNIVERSO eterno May:3💗🌌",
    "toditosh mi LATIDITOSH son siempre para ti<3💗🫀",
    "eresh mi bellíshima y eterna MELODÍA de verano🥹💗🌅",
    "🍯💗eres mi dulshe y deliciosha terronshita de karamelito y miel(≧▽≦)💗🍯",
    "☀️💗siempre estaré a tu ladito infinitash eternidades forever my love baby;)💗☀️",
    "eresh mi preciosha angelita y eterna dueñita de toditosh mi sueñitos de miel(^ω^)💗💤✨️",
    "🌟💗tu bellíshima SONRISHITA siempre va embelleshel mi vidita entera🥹💗🌟",
   "siempre seras mi ETERNA e INFINITA razon de sel HEHE:3💗❤️‍🔥",
  ],

  // ── Mensajes largos (clave = frase corta exacta) ───
  mensajesLargos: {
    "🌌💗eres todito mi UNIVERSO eterno May:3💗🌌": "desde akella primera vesh k te konoci, pude vel entre tanta BELLESHA y TERNURITA natural tan TUYA, mi másh grande SUEÑITO a obra y gracia de tu maravillosha DEIDAD iluminando y embelleciendo mi vidita entera, desde aquel día... siempre ADORARÉ y rendiré CULTO y vasallaje a mi eterna y majestuosha precioshidad, a mi universo entero FOREVER HEHE;3💗🌌✨️",
    "toditosh mi LATIDITOSH son siempre para ti<3💗🫀": "Golpe trash golpe, me exhausta la excitante prepotencia y ARDE a fuego FLAMANTE mis deseitosh de POSEERTE y hacerte MIA en mi eterna íntimidad y desnudez romantika, ante TI desprendo ferviente organo de mi VIDA y te la koncedo TUYA mi bella mujelshita y dueña de toditito mi korashon:)💗🫀✨️",
    "eresh mi bellíshima y eterna MELODÍA de verano🥹💗🌅": "te koncedo nobles y apasionados pashitos de miel en cortecía y coqueteria de tu mayol y único ADORADOR, dichoso rey y principe eterno en máxima categoria de tus bendecidas y delicioshas fantasías de lujuria y café HEHE😸💗☕️",
    "🍯💗eres mi dulshe y deliciosha terronshita de karamelito y miel(≧▽≦)💗🍯": "3 decenash de infantil infinidad fueron kontaditash tan minuciosas, tan detalladash, esculpidash en perfección para podel trael al mundito a tan BELLÍSHIMA y DIVINITA bebeshita ETERNA, de kn idolatro y sobrexalto maravillash y milagritosh k koncede tu celestial narutaleza maternal ñejeje😸💗🎀✨️",
    "☀️💗siempre estaré a tu ladito infinitash eternidades forever my love baby;)💗☀️": "Riko bizkochito de madrugada, tus dulshe beshosh han de alimental mis hambrientos arrebatos de KOMERTE todita y servirte diaria y eterna en mis bokaditos de lujurias, en los k siempre vash a sel mi deliciosha komidita de a bokados y beshotesh te koncedo ñejeje🥺💗🎂",
    "eresh mi preciosha angelita y eterna dueñita de toditosh mi sueñitos de miel(^ω^)💗💤✨️": "promeshita de meñike he eternizado a titulo emblemátiko e intimo de mi inmortalidad, te recito en mi sensualidad lírica y consentida infinitosh "siempré te AMARÉ...." y te GLORIFICO komo eminencia misma de pura ADORACION hacía TI HEHE(≧▽≦)💗🌸🌟",
    "🌟💗tu bellíshima SONRISHITA siempre va embelleshel mi vidita entera🥹💗🌟": "Premicias kada idealizada mañanita kon tan dulshes rebotesh y meneos de tus pomposos glúteos, akomodandose en silueta PERFECTA, maravillante y decorosa de tal deliciosha FINURA de mujel, te completas DIVINIDAD absoluta y delikada kon tu eterna sonrishita al borde de precioshidad tan vuestra😸💗☀️✨️",
    "siempre seras mi ETERNA e INFINITA razon de sel HEHE:3💗❤️‍🔥": "romántikas dedikatorias te enaltecen a tan íntima plenitud y exaltacion de lo divino y lo eterno, te adornan puras vitalidades k konceden vida eterna a todito lo k te rodea, pues es natural en ti, es tan pura y sincera tu peshoshísima PERFECCIÓN femenina de mujel!! tan cristalina y cautivante tu sensual finura de sel pol siempre y para siempre mi ARDIENTE y DIVINA razón de sel HEHE🥺💗🌸✨️",
  },

  // ── Foto polaroid asociada a cada frase corta (mismo orden que frases) ──
  // Carpeta: assets/img/
  fotosFrases: {
    "🌌💗eres todito mi UNIVERSO eterno May:3💗🌌":         "msg_foto1.webp",
    "toditosh mi LATIDITOSH son siempre para ti<3💗🫀":         "msg_foto2.webp",
    "eresh mi bellíshima y eterna MELODÍA de verano🥹💗🌅": "msg_foto3.webp",
    "🍯💗eres mi dulshe y deliciosha terronshita de karamelito y miel(≧▽≦)💗🍯":     "msg_foto4.webp",
    "☀️💗siempre estaré a tu ladito infinitash eternidades forever my love baby;)💗☀️":            "msg_foto5.webp",
    "eresh mi preciosha angelita y eterna dueñita de toditosh mi sueñitos de miel(^ω^)💗💤✨️":  "msg_foto6.webp",
    "🌟💗tu bellíshima SONRISHITA siempre va embelleshel mi vidita entera🥹💗🌟":   "msg_foto7.webp",
    "siempre seras mi ETERNA e INFINITA razon de sel HEHE:3💗❤️‍🔥":          "msg_foto8.webp",
  },

  // ── Palabras clave interactivas (con su propio estilo) ──
  palabrasClave: {
    "Recuerdos":  "Nuestros infinitosh viajes bem juntitosh forever, tus dulshes rishitas que siempre rebolotean en mi kabeshita, tus grandesh abashitos que me hacen sentil en mi dulshe hogal... kada bellíshimo rekuerdo kontigo siempre será mi mash grande tesoro que gualdaré en lo mash profundo de mi korashon HEHE;3💗🫀💫",
    "Promesas":   "Te prometo amalte siempre, en las buenash y en las malas. Te prometo sel tu noble caballero, tu eterna zonita segura y tu mayol admiradol pol todita mi vidita entera mi my good baby May🥺💗🌸✨️",
    "Futuro":     "Toditash las noshes sueño con nuestro infinito y maravillosho futuro lleno de aventuras y deliciash a tu ladito pol siempre, de nuestrash rishas korrespondidas, de nuestras íntimash fantasíash k lograremosh bem juntitos. Kello forjal nuestra apasionada y eterna vidita bem abashaditosh y disfrutandl de nuestro kariñosho kalorshito😸💗🔥",
    "Eternidad":  "Hasta el fin del universo mismo, he ahii donde el juicio final se presencia kon benevolencia y misericordia ante infimidad de deseitos y ruegosh, y aún ashi, vos siempre seguirás siendo ETERNA y PERFECTA en todita tu deliciosha plenitud, siendo la veldadera SALVADORA de mi vidita entera grashash a tu delikadita sutileza de Dioshita bem magistral de todito mi korashon<3💗🌟",
    "Aventura":   "Noble navegadol de tus fertiles praderash, fiel adoradol de tus sensuales kaskadas, kariñosho protectol de tu mash intima y sabrosha PERFECCIÓN femenina de miel!! tan deliciosha y fulgurosa... siempre vamosh a paseal pol los largosh e infinitosh kaminitosh de nuestro atemporal y sintomátiko amol, siempre me ENKANTARÁ aprendel toditito de ti HEHE🥹💗💕✨️",
  },

  // ── Modal final espectacular (al completar las 8 frases) ──
  modalFinal: {
    titulo: "INFINITASH QUICEAÑERAS de nuestro FULGOROSO y ETERNO AMOL",
    mensaje "Pares de primaverash silban melódicas y risueñitash, congenian entusiastas tus majestuosos ojitos de algodón; vidita eterna y universo inmenso colisionan juntos en la gloriosha infinidad de tu bellishima ternurita de mujel; preciosho kuerpo y almita entera son las que, dichoshas y afortunadas, te komponen y te akompañan póstumas a tu veldadera y celestial paradisiaka de tus infinitash deidades y maravillas mueñeñe😸💗💐✨️ Llego el día, 15 fantasiosos e idílikos meseshitos en los que, a punta de cerezitas delicioshas y picaronshitos de colibri. punzaste tan feroz y apasionada mi vidita entera y total entregada a TI, que con tan solo tus noltálgicas melancolías, me enternizas noble dominancia absoluta a tu bíblica añorancia y a tu sensual majestuosidad de dedikalte pol siempre y kon máxima extaltación, mi almita kompleta en adoralte y cortejarte tan bellíshima damita siempre PERFECTA y tan maravillosho PARAISO eterno k siempre woa AMAL y FANTASEAL pol toditita mi almita entera FOREVER HEJE<3💗🌸🌟",
    imagenes: ["final_foto1.webp", "final_foto2.webp", "final_foto3.webp", "final_foto4.webp"],
  },

  // ── Colores pastel del corazón y partículas ────────
  colores: ["", "", "", "", ""],

  // ── Canciones (solo nombres de archivo, carpeta assets/music/) ──
  canciones: [
    { nombre: "Harvey hers for you<3💗🎵",   archivo: "cancion1.mp3" },
    { nombre: "Lovers rock forever🥺🎵🎶",           archivo: "cancion2.mp3" },
    { nombre: "Sweet dream with you😸💤🎶",       archivo: "cancion3.mp3" },
    { nombre: "Sweet Sweet marry me:)❤️‍🔥🎵",      archivo: "cancion4.mp3" },
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
  emojisClick: ["💗","✨","🌸","🌷","💫","💐","❤️‍🔥","💞"],

  // ── Mensaje al terminar la playlist completa ───────
  mensajeFinPlaylist: "SIEMPRE te dedikaré todititash nuestrash kancionesh de amol mi niñita peshoshita de mi korashon<3",

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
