/* global lucide, confetti */
/**
 * ==========================================================================
 * Donde Nace tu Fuerza | Lógica Modular de la Aplicación
 * Compatible con Visual Studio Code (sin advertencias de linter)
 * ==========================================================================
 */

// Inicialización segura de iconos Lucide cuando esté disponible
function initLucideIcons() {
  if (typeof lucide !== 'undefined' && lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  } else if (typeof window !== 'undefined' && window['lucide'] && typeof window['lucide'].createIcons === 'function') {
    window['lucide'].createIcons();
  }
}
initLucideIcons();

// Verificación de imágenes cargadas (resuelve imágenes en caché y carga progresiva)
function checkLoadedImages() {
  document.querySelectorAll('.smooth-image').forEach(img => {
    if (img instanceof HTMLImageElement && img.complete && img.naturalHeight !== 0) {
      img.classList.add('loaded');
    }
  });
}
checkLoadedImages();
window.addEventListener('load', () => {
  checkLoadedImages();
  initLucideIcons();
  syncCompareSliderWidth();
});

// Manejador inteligente de fotos familiares: prueba variantes de extensión (.jpg, .JPG, .jpeg, .webp) y fallback
const fallbackImages = {
  'Lexfer1_bebecito': 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800',
  'Lexfer1_Papa_y_Yo': 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800',
  'Lexfer4_2004A': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800',
  'Lexfer10_yo_2004': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800',
  'Lexfer16_Cumpleanos': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800',
  'Lexfer14_2009_Vacaciones': 'assets/fotos/Lexfer14_2009_Vacaciones.jpg',
  'Lexfer5_Jugando_Football': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800',
  'Lexfer7_Trillizos': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800',
  'Lexfer2_2007_Gracioso': 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=800',
  'Lexfer18_Graduacion': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800',
  'Lexfer9_Vacac': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800',
  'Lexfer6_Fran_Secundaria': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800',
  'Lexfer17_Graduacion': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000',
  'Lexfer19_Turuk': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800',
  'Lexfer19_AmigosPiramide': 'assets/fotos/Lexfer19_AmigosPiramide_20230212.jpg',
  'Lexfer15_2010_Playa': 'assets/fotos/Lexfer15_2010_Playa.jpg',
  'Lexfer13_Piano': 'assets/fotos/Lexfer13_Piano.jpg',
  'Lexfer18_Graduacion_Univ_2025': 'assets/fotos/Lexfer18_Graduacion_Univ_2025.jpg',
  'Lexfer18-Raquel': 'assets/fotos/Lexfer18-Raquel.jpg',
  'Lexfer20-Raquel_Papa_Y_Yo': 'assets/fotos/Lexfer20-Raquel_Papa_Y_Yo.jpg',
  'Lexfer18_Raquel_Universidad_Celebracion': 'assets/fotos/Lexfer18_Raquel_Universidad_Celebracion.png',
  'Lexfer20-20250824-Matrimonio': 'assets/fotos/Lexfer20-20250824-Matrimonio.jpg',
  'Lexfer20_Raquel_Matrimonio2': 'assets/fotos/Lexfer20_Raquel_Matrimonio2.png'
};

document.querySelectorAll('img').forEach(img => {
  const originalSrc = img.getAttribute('src') || '';
  if (originalSrc.includes('assets/fotos/')) {
    img.addEventListener('error', function onImageError(event) {
      const target = event.currentTarget;
      if (!(target instanceof HTMLImageElement)) return;
      const step = parseInt(target.dataset.retryStep || '0', 10);
      target.dataset.retryStep = (step + 1).toString();

      if (step === 0) {
        if (target.src.endsWith('.jpg')) target.src = target.src.replace(/\.jpg$/, '.JPG');
        else if (target.src.endsWith('.JPG')) target.src = target.src.replace(/\.JPG$/, '.jpg');
        else if (target.src.endsWith('.jpeg')) target.src = target.src.replace(/\.jpeg$/, '.jpg');
        else if (target.src.endsWith('.webp')) target.src = target.src.replace(/\.webp$/, '.jpg');
        else target.src = target.src + '.jpg';
      } else if (step === 1) {
        if (target.src.includes('.jpg') || target.src.includes('.JPG')) {
          target.src = target.src.replace(/\.(jpg|JPG)$/, '.jpeg');
        } else {
          target.src = target.src.replace(/\.webp$/, '.JPG');
        }
      } else if (step === 2) {
        target.src = target.src.replace(/\.(jpeg|jpg|JPG)$/, '.webp');
      } else {
        for (const [key, fallbackUrl] of Object.entries(fallbackImages)) {
          if (originalSrc.includes(key)) {
            target.src = fallbackUrl;
            return;
          }
        }
        target.src = 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800';
      }
    });
  }
});

// Motor de Audio: Web Audio API & Fallback sintetizado
let audioCtx = null;
let synthInterval = null;
const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];

function initAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window['webkitAudioContext'];
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Desbloqueo pasivo en el primer gesto del usuario
const unlockUserAudio = () => {
  initAudioContext();
  window.removeEventListener('touchstart', unlockUserAudio);
  window.removeEventListener('click', unlockUserAudio);
};
window.addEventListener('touchstart', unlockUserAudio, { passive: true });
window.addEventListener('click', unlockUserAudio, { passive: true });

// Sonido háptico de tarjeta (sintetizado)
function playFlipSound() {
  try {
    initAudioContext();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  } catch {
    // Silencio seguro si el navegador bloquea la reproducción automática
  }
}

// Melodía y notas de "Feliz Cumpleaños" (Karaoke tradicional)
const happyBirthdayNotes = [
  // Frase 1: "Cum-ple-a-ños fe-liz"
  { f: 392.00, dur: 0.35, gap: 380 },
  { f: 392.00, dur: 0.25, gap: 280 },
  { f: 440.00, dur: 0.60, gap: 620 },
  { f: 392.00, dur: 0.60, gap: 620 },
  { f: 523.25, dur: 0.60, gap: 620 },
  { f: 493.88, dur: 1.20, gap: 1250 },
  // Frase 2: "Cum-ple-a-ños fe-liz"
  { f: 392.00, dur: 0.35, gap: 380 },
  { f: 392.00, dur: 0.25, gap: 280 },
  { f: 440.00, dur: 0.60, gap: 620 },
  { f: 392.00, dur: 0.60, gap: 620 },
  { f: 587.33, dur: 0.60, gap: 620 },
  { f: 523.25, dur: 1.20, gap: 1250 },
  // Frase 3: "Te de-se-a-mos a ti" (o "Cumpleaños Lexfer")
  { f: 392.00, dur: 0.35, gap: 380 },
  { f: 392.00, dur: 0.25, gap: 280 },
  { f: 783.99, dur: 0.65, gap: 680 },
  { f: 659.25, dur: 0.65, gap: 680 },
  { f: 523.25, dur: 0.65, gap: 680 },
  { f: 493.88, dur: 0.60, gap: 620 },
  { f: 440.00, dur: 0.60, gap: 620 },
  // Frase 4: "Cum-ple-a-ños fe-liz!"
  { f: 698.46, dur: 0.35, gap: 380 },
  { f: 698.46, dur: 0.25, gap: 280 },
  { f: 659.25, dur: 0.65, gap: 680 },
  { f: 523.25, dur: 0.65, gap: 680 },
  { f: 587.33, dur: 0.65, gap: 680 },
  { f: 523.25, dur: 1.50, gap: 1800 }
];

let synthNoteIndex = 0;
let synthTimeout = null;

// Sintetizador procedural con la melodía de Feliz Cumpleaños (Fallback)
function startAmbientSynth() {
  initAudioContext();
  if (!audioCtx) return;
  stopAmbientSynth();

  function playNextSynthNote() {
    if (!audioCtx || audioCtx.state !== 'running' || !isPlaying) return;
    const note = happyBirthdayNotes[synthNoteIndex];
    synthNoteIndex = (synthNoteIndex + 1) % happyBirthdayNotes.length;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, audioCtx.currentTime);

      // Envolvente suave y bajo (volumen suave)
      const baseVol = currentBgVolume * 0.25;
      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(baseVol, audioCtx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + note.dur);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + note.dur);
    } catch {
      // Ignorar bloqueos de audio
    }

    synthTimeout = setTimeout(playNextSynthNote, note.gap);
  }

  playNextSynthNote();
}

function stopAmbientSynth() {
  if (synthTimeout) {
    clearTimeout(synthTimeout);
    synthTimeout = null;
  }
  synthNoteIndex = 0;
}

// ==========================================================================
// Iconos SVG Limpios y Fiables
// ==========================================================================
const SVG_ICONS = {
  play: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 ml-0.5"><polygon points="6 3 20 12 6 21 6 3"/></svg>',
  pause: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',
  bigPlay: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-slate-950"><polygon points="6 3 20 12 6 21 6 3"/></svg>',
  bigPause: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 sm:w-10 sm:h-10 fill-slate-950"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',
  volume2: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
  volume1: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
  volumeX: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>'
};

function setElementSvg(el, svgHtml) {
  if (!el) return;
  const target = typeof el === 'string' ? document.getElementById(el) : el;
  if (target) {
    target.innerHTML = svgHtml;
  }
}

// ==========================================================================
// Control Música Fondo: FELIZ CUMPLEAÑOS (Karaoke Original - Suave y Bajo)
// ==========================================================================
const bgMusic = document.getElementById('bgMusic');
const audioToggleBtn = document.getElementById('audioToggleBtn');
const audioIconContainer = document.getElementById('audioIconContainer');
const bgMusicVolSlider = document.getElementById('bgMusicVolSlider');
const bgMusicVolLabel = document.getElementById('bgMusicVolLabel');

let isPlaying = false;
// Volumen suave y bajo predeterminado: 0.20 (20%)
let currentBgVolume = 0.20;
let wasBgMusicPlayingBeforeInterrupt = false;

// Configurar volumen suave inicial en el elemento de audio
if (bgMusic instanceof HTMLAudioElement) {
  bgMusic.volume = currentBgVolume;
}

// Control deslizante de volumen suave
if (bgMusicVolSlider) {
  bgMusicVolSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value) || 0;
    currentBgVolume = Math.max(0, Math.min(1, val / 100));
    if (bgMusic instanceof HTMLAudioElement) {
      bgMusic.volume = currentBgVolume;
    }
    if (bgMusicVolLabel) {
      bgMusicVolLabel.textContent = `${Math.round(val)}%`;
    }
    updateBgMusicUI(isPlaying);
  });
}

function updateBgMusicUI(playing) {
  const container = document.getElementById('audioIconContainer');
  const btn = document.getElementById('audioToggleBtn');
  const dot = document.getElementById('audioStatusDot');

  if (btn) {
    if (playing) {
      btn.classList.add('border-amber-400', 'ring-2', 'ring-amber-500/30', 'bg-amber-500/10');
      btn.setAttribute('title', 'Pausar música de fondo (Feliz Cumpleaños)');
      btn.setAttribute('aria-label', 'Pausar música de fondo');
    } else {
      btn.classList.remove('border-amber-400', 'ring-2', 'ring-amber-500/30', 'bg-amber-500/10');
      btn.setAttribute('title', 'Reproducir música de fondo (Feliz Cumpleaños)');
      btn.setAttribute('aria-label', 'Reproducir música de fondo');
    }
  }

  if (dot) {
    if (playing) {
      dot.classList.remove('bg-slate-500');
      dot.classList.add('bg-amber-400', 'animate-pulse');
    } else {
      dot.classList.remove('bg-amber-400', 'animate-pulse');
      dot.classList.add('bg-slate-500');
    }
  }

  if (container) {
    // Si está sonando y el volumen es mayor a 0, mostrar icono de sonido activo (SIN la cruz/X)
    if (playing && currentBgVolume > 0) {
      container.innerHTML = SVG_ICONS.volume2;
    } else {
      // Si está pausado o con volumen en cero, mostrar icono con la cruz "X" (silenciado/apagado)
      container.innerHTML = SVG_ICONS.volumeX;
    }
  }
}

// Sincronización con eventos nativos del elemento de audio
if (bgMusic instanceof HTMLAudioElement) {
  bgMusic.addEventListener('play', () => {
    isPlaying = true;
    updateBgMusicUI(true);
  });
  bgMusic.addEventListener('pause', () => {
    if (!synthTimeout) {
      isPlaying = false;
      updateBgMusicUI(false);
    }
  });
  bgMusic.addEventListener('ended', () => {
    if (!synthTimeout) {
      isPlaying = false;
      updateBgMusicUI(false);
    }
  });
}

// Estado visual inicial
updateBgMusicUI(false);

// Pausar música de fondo (por ejemplo cuando se reproduce un video o nota de voz)
function pauseBgMusic(userInitiated = true) {
  if (userInitiated) {
    wasBgMusicPlayingBeforeInterrupt = false;
  }
  if (bgMusic instanceof HTMLAudioElement) {
    bgMusic.pause();
  }
  stopAmbientSynth();
  isPlaying = false;
  updateBgMusicUI(false);
}

// Reproducir música de fondo
function playBgMusic() {
  initAudioContext();

  // Pausar cualquier video o nota de voz para evitar solapamiento
  pauseWeddingVideo();
  if (voiceNoteAudio instanceof HTMLAudioElement && !voiceNoteAudio.paused) {
    voiceNoteAudio.pause();
    updateVoiceNoteUI(false);
  }

  isPlaying = true;
  if (bgMusic instanceof HTMLAudioElement) {
    bgMusic.volume = currentBgVolume;
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        updateBgMusicUI(true);
      }).catch(() => {
        startAmbientSynth();
        updateBgMusicUI(true);
      });
    } else {
      startAmbientSynth();
      updateBgMusicUI(true);
    }
  } else {
    startAmbientSynth();
    updateBgMusicUI(true);
  }
}

if (audioToggleBtn) {
  audioToggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      pauseBgMusic(true);
    } else {
      wasBgMusicPlayingBeforeInterrupt = false;
      playBgMusic();
    }
  });
}

// ==========================================================================
// Control Mensaje Especial de Familia (Audio lexfer01.mp3 con Volumen y Progreso)
// ==========================================================================
const voiceNoteAudio = document.getElementById('voiceNoteAudio');
const voiceNoteBtn = document.getElementById('voiceNoteBtn');
const voiceNoteIconContainer = document.getElementById('voiceNoteIconContainer');
const voiceNoteProgressBar = document.getElementById('voiceNoteProgressBar');
const voiceNoteProgressContainer = document.getElementById('voiceNoteProgressContainer');
const voiceNoteTime = document.getElementById('voiceNoteTime');
const voiceNoteVolumeSlider = document.getElementById('voiceNoteVolumeSlider');
const voiceNoteVolumeLabel = document.getElementById('voiceNoteVolumeLabel');
const voiceNoteMuteIconContainer = document.getElementById('voiceNoteMuteIconContainer');
const voiceNoteStatusDot = document.getElementById('voiceNoteStatusDot');
const voiceNoteStatusText = document.getElementById('voiceNoteStatusText');

let voiceNotePrevVolume = 1;

function updateVoiceNoteUI(playing) {
  if (voiceNoteBtn) {
    if (playing) {
      voiceNoteBtn.classList.add('bg-amber-500', 'text-slate-950', 'ring-4', 'ring-amber-500/30', 'shadow-amber-500/30');
      voiceNoteBtn.classList.remove('bg-amber-500/20', 'text-amber-400');
      voiceNoteBtn.setAttribute('title', 'Pausar mensaje');
      voiceNoteBtn.setAttribute('aria-label', 'Pausar mensaje de voz de familia');
    } else {
      voiceNoteBtn.classList.remove('bg-amber-500', 'text-slate-950', 'ring-4', 'ring-amber-500/30', 'shadow-amber-500/30');
      voiceNoteBtn.classList.add('bg-amber-500/20', 'text-amber-400');
      voiceNoteBtn.setAttribute('title', 'Reproducir mensaje');
      voiceNoteBtn.setAttribute('aria-label', 'Reproducir mensaje de voz de familia');
    }
  }

  if (voiceNoteIconContainer) {
    voiceNoteIconContainer.innerHTML = playing ? SVG_ICONS.pause : SVG_ICONS.play;
  }

  if (voiceNoteStatusDot) {
    if (playing) {
      voiceNoteStatusDot.classList.add('animate-pulse', 'bg-emerald-400');
      voiceNoteStatusDot.classList.remove('bg-amber-500');
    } else {
      voiceNoteStatusDot.classList.remove('animate-pulse', 'bg-emerald-400');
      voiceNoteStatusDot.classList.add('bg-amber-500');
    }
  }

  if (voiceNoteStatusText) {
    voiceNoteStatusText.textContent = playing 
      ? 'Reproduciendo mensaje de voz familiar...' 
      : 'Principe feliz cumpleaños • Bendiciones y amor incondicional';
  }
}

function setVoiceNoteVolume(val) {
  const numVal = parseFloat(val);
  const normalized = Math.max(0, Math.min(100, isNaN(numVal) ? 100 : numVal));
  const volumeFactor = normalized / 100;

  if (voiceNoteAudio instanceof HTMLAudioElement) {
    voiceNoteAudio.volume = volumeFactor;
    voiceNoteAudio.muted = (volumeFactor === 0);
  }

  if (voiceNoteVolumeSlider instanceof HTMLInputElement) {
    voiceNoteVolumeSlider.value = normalized.toString();
  }

  if (voiceNoteVolumeLabel) {
    voiceNoteVolumeLabel.textContent = `${Math.round(normalized)}%`;
  }

  if (voiceNoteMuteIconContainer) {
    if (normalized === 0) {
      voiceNoteMuteIconContainer.innerHTML = SVG_ICONS.volumeX;
    } else if (normalized < 50) {
      voiceNoteMuteIconContainer.innerHTML = SVG_ICONS.volume1;
    } else {
      voiceNoteMuteIconContainer.innerHTML = SVG_ICONS.volume2;
    }
  }

  if (volumeFactor > 0) {
    voiceNotePrevVolume = volumeFactor;
  }
}

function toggleVoiceNoteMute() {
  if (!(voiceNoteAudio instanceof HTMLAudioElement)) return;

  if (voiceNoteAudio.muted || voiceNoteAudio.volume === 0) {
    const targetVol = voiceNotePrevVolume > 0.05 ? voiceNotePrevVolume : 1;
    setVoiceNoteVolume(targetVol * 100);
  } else {
    voiceNotePrevVolume = voiceNoteAudio.volume;
    setVoiceNoteVolume(0);
  }
}

function toggleVoiceNote() {
  initAudioContext();
  if (!(voiceNoteAudio instanceof HTMLAudioElement)) return;

  if (voiceNoteAudio.paused || voiceNoteAudio.ended) {
    pauseWeddingVideo();
    pauseDrivingVideo();

    // Pausar inmediatamente la música de fondo para escuchar la nota familiar sin interferencias
    if (isPlaying) {
      wasBgMusicPlayingBeforeInterrupt = true;
    }
    pauseBgMusic(false);

    // Asegurar que cargue única y exclusivamente public/assets/audio/lexfer01.mp3
    if (!voiceNoteAudio.src || !voiceNoteAudio.src.includes('public/assets/audio/lexfer01.mp3')) {
      voiceNoteAudio.src = 'public/assets/audio/lexfer01.mp3';
      voiceNoteAudio.load();
    }

    const playPromise = voiceNoteAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        updateVoiceNoteUI(true);
      }).catch((err) => {
        console.error('Error al reproducir public/assets/audio/lexfer01.mp3:', err);
        updateVoiceNoteUI(false);
      });
    } else {
      updateVoiceNoteUI(true);
    }
  } else {
    voiceNoteAudio.pause();
    updateVoiceNoteUI(false);
  }
}

if (voiceNoteAudio instanceof HTMLAudioElement) {
  // Configuración exclusiva de la fuente local (sin autoplay)
  voiceNoteAudio.src = 'public/assets/audio/lexfer01.mp3';

  voiceNoteAudio.addEventListener('play', () => {
    if (isPlaying) {
      wasBgMusicPlayingBeforeInterrupt = true;
    }
    pauseBgMusic(false);
    updateVoiceNoteUI(true);
  });

  voiceNoteAudio.addEventListener('pause', () => {
    updateVoiceNoteUI(false);
    // Si la música estaba activa antes de escuchar el mensaje de voz, reanudar suavemente
    if (wasBgMusicPlayingBeforeInterrupt && (!weddingVideo || weddingVideo.paused) && (!drivingVideo || drivingVideo.paused)) {
      wasBgMusicPlayingBeforeInterrupt = false;
      playBgMusic();
    }
  });

  voiceNoteAudio.addEventListener('ended', () => {
    updateVoiceNoteUI(false);
    if (voiceNoteProgressBar) voiceNoteProgressBar.style.width = '0%';
    if (voiceNoteTime && !isNaN(voiceNoteAudio.duration) && isFinite(voiceNoteAudio.duration)) {
      const durMins = Math.floor(voiceNoteAudio.duration / 60);
      const durSecs = Math.floor(voiceNoteAudio.duration % 60);
      voiceNoteTime.textContent = `00:00 / ${durMins}:${durSecs < 10 ? '0' : ''}${durSecs}`;
    }
    if (wasBgMusicPlayingBeforeInterrupt && (!weddingVideo || weddingVideo.paused) && (!drivingVideo || drivingVideo.paused)) {
      wasBgMusicPlayingBeforeInterrupt = false;
      playBgMusic();
    }
  });

  // Sincronización continua de la barra de progreso y contador de tiempo
  voiceNoteAudio.addEventListener('timeupdate', () => {
    if (voiceNoteAudio.duration && voiceNoteProgressBar) {
      const pct = (voiceNoteAudio.currentTime / voiceNoteAudio.duration) * 100;
      voiceNoteProgressBar.style.width = pct + '%';
    }
    if (voiceNoteTime && !isNaN(voiceNoteAudio.duration) && isFinite(voiceNoteAudio.duration)) {
      const mins = Math.floor(voiceNoteAudio.currentTime / 60);
      const secs = Math.floor(voiceNoteAudio.currentTime % 60);
      const durMins = Math.floor(voiceNoteAudio.duration / 60);
      const durSecs = Math.floor(voiceNoteAudio.duration % 60);
      voiceNoteTime.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs} / ${durMins}:${durSecs < 10 ? '0' : ''}${durSecs}`;
    }
  });

  // Inicialización de la duración real al cargar metadatos de lexfer01.mp3
  voiceNoteAudio.addEventListener('loadedmetadata', () => {
    if (voiceNoteTime && !isNaN(voiceNoteAudio.duration) && isFinite(voiceNoteAudio.duration)) {
      const durMins = Math.floor(voiceNoteAudio.duration / 60);
      const durSecs = Math.floor(voiceNoteAudio.duration % 60);
      voiceNoteTime.textContent = `00:00 / ${durMins}:${durSecs < 10 ? '0' : ''}${durSecs}`;
    }
  });

  // Barra de progreso interactiva (hacer clic para avanzar / retroceder)
  if (voiceNoteProgressContainer) {
    voiceNoteProgressContainer.addEventListener('click', (e) => {
      if (voiceNoteAudio.duration && isFinite(voiceNoteAudio.duration)) {
        const rect = voiceNoteProgressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const ratio = Math.max(0, Math.min(1, clickX / rect.width));
        voiceNoteAudio.currentTime = ratio * voiceNoteAudio.duration;
        const pct = ratio * 100;
        if (voiceNoteProgressBar) voiceNoteProgressBar.style.width = pct + '%';
      }
    });
  }
}

// ==========================================================================
// Control Cinematográfico de Video de la Boda & Barra de Avance
// ==========================================================================
const weddingVideo = document.getElementById('weddingVideo');
const videoPlayBtn = document.getElementById('videoPlayBtn');
const videoPlayIconContainer = document.getElementById('videoPlayIconContainer');
const videoPlayOverlay = document.getElementById('videoPlayOverlay');
const overlayPlayIconContainer = document.getElementById('overlayPlayIconContainer');
const videoProgressBar = document.getElementById('videoProgressBar');
const videoProgressContainer = document.getElementById('videoProgressContainer');
const videoProgressThumb = document.getElementById('videoProgressThumb');
const videoSeekInput = document.getElementById('videoSeekInput');
const videoBufferBar = document.getElementById('videoBufferBar');
const videoOverlayProgressBar = document.getElementById('videoOverlayProgressBar');
const videoSeekTooltip = document.getElementById('videoSeekTooltip');
const videoCurrentTimeDisplay = document.getElementById('videoCurrentTimeDisplay');
const videoDurationDisplay = document.getElementById('videoDurationDisplay');
const videoTimeDisplay = document.getElementById('videoTimeDisplay');
const videoStatusDot = document.getElementById('videoStatusDot');
const videoStatusText = document.getElementById('videoStatusText');
const videoMuteBtn = document.getElementById('videoMuteBtn');
const videoMuteIconContainer = document.getElementById('videoMuteIconContainer');
const videoVolumeSlider = document.getElementById('videoVolumeSlider');
const videoVolumeLabel = document.getElementById('videoVolumeLabel');
const videoFullscreenBtn = document.getElementById('videoFullscreenBtn');
const videoFileInput = document.getElementById('videoFileInput');
const videoToggleNativeBtn = document.getElementById('videoToggleNativeBtn');

let videoPreviousVolume = 0.85;
let isSeekingVideo = false;

function formatVideoTime(seconds) {
  if (isNaN(seconds) || seconds < 0 || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function updateVideoProgressUI() {
  if (!(weddingVideo instanceof HTMLVideoElement)) return;
  const duration = weddingVideo.duration;
  const current = weddingVideo.currentTime || 0;

  if (duration && !isNaN(duration) && duration > 0 && isFinite(duration)) {
    const pct = Math.max(0, Math.min(100, (current / duration) * 100));
    
    if (videoProgressBar) {
      videoProgressBar.style.width = `${pct}%`;
    }
    if (videoProgressThumb) {
      videoProgressThumb.style.left = `${pct}%`;
    }
    if (videoOverlayProgressBar) {
      videoOverlayProgressBar.style.width = `${pct}%`;
    }
    if (videoSeekInput && !isSeekingVideo) {
      videoSeekInput.value = String(pct);
    }

    const curText = formatVideoTime(current);
    const durText = formatVideoTime(duration);

    if (videoCurrentTimeDisplay) videoCurrentTimeDisplay.textContent = curText;
    if (videoDurationDisplay) videoDurationDisplay.textContent = durText;
    if (videoTimeDisplay) videoTimeDisplay.textContent = `${curText} / ${durText}`;

    // Actualizar búfer de descarga
    if (videoBufferBar && weddingVideo.buffered && weddingVideo.buffered.length > 0) {
      try {
        const bufferedEnd = weddingVideo.buffered.end(weddingVideo.buffered.length - 1);
        const bufPct = Math.min(100, (bufferedEnd / duration) * 100);
        videoBufferBar.style.width = `${bufPct}%`;
      } catch (_) {}
    }
  } else {
    // Si aún se está inicializando o cargando
    if (videoProgressBar) videoProgressBar.style.width = '0%';
    if (videoProgressThumb) videoProgressThumb.style.left = '0%';
    if (videoOverlayProgressBar) videoOverlayProgressBar.style.width = '0%';
    if (videoCurrentTimeDisplay) videoCurrentTimeDisplay.textContent = '0:00';
    if (videoDurationDisplay) videoDurationDisplay.textContent = '0:20';
    if (videoTimeDisplay) videoTimeDisplay.textContent = '0:00 / 0:20';
  }
}

function onVideoSeekInput(val) {
  isSeekingVideo = true;
  const pct = Math.max(0, Math.min(100, parseFloat(val) || 0));
  if (videoProgressBar) videoProgressBar.style.width = `${pct}%`;
  if (videoProgressThumb) videoProgressThumb.style.left = `${pct}%`;
  if (videoOverlayProgressBar) videoOverlayProgressBar.style.width = `${pct}%`;

  if (weddingVideo instanceof HTMLVideoElement && weddingVideo.duration) {
    const previewTime = (pct / 100) * weddingVideo.duration;
    if (videoCurrentTimeDisplay) videoCurrentTimeDisplay.textContent = formatVideoTime(previewTime);
  }
}

function onVideoSeekChange(val) {
  isSeekingVideo = false;
  if (!(weddingVideo instanceof HTMLVideoElement)) return;
  const pct = Math.max(0, Math.min(100, parseFloat(val) || 0));
  if (weddingVideo.duration && !isNaN(weddingVideo.duration)) {
    weddingVideo.currentTime = (pct / 100) * weddingVideo.duration;
  }
  updateVideoProgressUI();
}

function pauseWeddingVideo() {
  if (weddingVideo instanceof HTMLVideoElement && !weddingVideo.paused) {
    weddingVideo.pause();
    updateVideoPlayUI(false);
  }
}

function updateVideoPlayUI(playing) {
  // Actualizar icono en la barra de control
  setElementSvg('videoPlayIconContainer', playing ? SVG_ICONS.pause : SVG_ICONS.play);

  // Actualizar icono en el botón central del overlay
  setElementSvg('overlayPlayIconContainer', playing ? SVG_ICONS.bigPause : SVG_ICONS.bigPlay);

  if (videoPlayBtn) {
    if (playing) {
      videoPlayBtn.classList.remove('bg-amber-500/20', 'text-amber-400');
      videoPlayBtn.classList.add('bg-amber-500', 'text-slate-950', 'shadow-lg', 'shadow-amber-500/30', 'scale-105');
      videoPlayBtn.setAttribute('title', 'Pausar video');
    } else {
      videoPlayBtn.classList.remove('bg-amber-500', 'text-slate-950', 'shadow-lg', 'shadow-amber-500/30', 'scale-105');
      videoPlayBtn.classList.add('bg-amber-500/20', 'text-amber-400');
      videoPlayBtn.setAttribute('title', 'Reproducir video');
    }
  }

  if (videoPlayOverlay) {
    if (playing) {
      videoPlayOverlay.classList.add('opacity-0', 'pointer-events-none');
    } else {
      videoPlayOverlay.classList.remove('opacity-0', 'pointer-events-none');
    }
  }

  if (videoStatusDot) {
    videoStatusDot.className = playing 
      ? 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse'
      : 'w-2 h-2 rounded-full bg-slate-500';
  }
  if (videoStatusText) {
    videoStatusText.textContent = playing ? 'Reproduciendo' : 'Pausado';
  }
}

function updateVideoVolumeUI(volume, muted) {
  const effectiveVol = muted ? 0 : volume;
  if (videoVolumeSlider instanceof HTMLInputElement) {
    videoVolumeSlider.value = String(effectiveVol);
  }
  if (videoVolumeLabel) {
    videoVolumeLabel.textContent = `${Math.round(effectiveVol * 100)}%`;
  }
  if (muted || effectiveVol === 0) {
    setElementSvg('videoMuteIconContainer', SVG_ICONS.volumeX);
  } else if (effectiveVol < 0.5) {
    setElementSvg('videoMuteIconContainer', SVG_ICONS.volume1);
  } else {
    setElementSvg('videoMuteIconContainer', SVG_ICONS.volume2);
  }
}

function setWeddingVideoVolume(val) {
  if (!(weddingVideo instanceof HTMLVideoElement)) return;
  const num = Math.max(0, Math.min(1, parseFloat(val)));
  weddingVideo.volume = num;
  if (num > 0) {
    weddingVideo.muted = false;
    videoPreviousVolume = num;
  } else {
    weddingVideo.muted = true;
  }
  updateVideoVolumeUI(weddingVideo.volume, weddingVideo.muted);
}

function toggleVideoMute() {
  if (!(weddingVideo instanceof HTMLVideoElement)) return;
  weddingVideo.muted = !weddingVideo.muted;
  if (!weddingVideo.muted && weddingVideo.volume === 0) {
    weddingVideo.volume = videoPreviousVolume || 0.85;
  }
  updateVideoVolumeUI(weddingVideo.volume, weddingVideo.muted);
}

function skipWeddingVideo(seconds) {
  if (!(weddingVideo instanceof HTMLVideoElement)) return;
  const duration = weddingVideo.duration || 1000;
  weddingVideo.currentTime = Math.max(0, Math.min(duration, weddingVideo.currentTime + seconds));
  updateVideoProgressUI();
}

function toggleNativeVideoControls() {
  if (!(weddingVideo instanceof HTMLVideoElement)) return;
  weddingVideo.controls = !weddingVideo.controls;
  const btn = document.getElementById('videoToggleNativeBtn');
  if (btn) {
    if (weddingVideo.controls) {
      btn.classList.add('bg-amber-500/20', 'text-amber-300', 'border-amber-500/50');
      btn.classList.remove('bg-slate-900', 'text-slate-300');
    } else {
      btn.classList.remove('bg-amber-500/20', 'text-amber-300', 'border-amber-500/50');
      btn.classList.add('bg-slate-900', 'text-slate-300');
    }
  }
}

function toggleWeddingVideo() {
  if (!(weddingVideo instanceof HTMLVideoElement)) return;
  
  if (weddingVideo.paused || weddingVideo.ended) {
    // Pausar música de fondo (Karaoke) para escuchar el video con claridad total
    if (isPlaying) {
      wasBgMusicPlayingBeforeInterrupt = true;
    }
    pauseBgMusic(false);

    pauseDrivingVideo();

    if (voiceNoteAudio instanceof HTMLAudioElement && !voiceNoteAudio.paused) {
      voiceNoteAudio.pause();
      updateVoiceNoteUI(false);
    }

    if (!weddingVideo.src || weddingVideo.src === '' || weddingVideo.src.endsWith('/')) {
      weddingVideo.src = 'assets/video/boda.mp4';
      weddingVideo.load();
    }

    weddingVideo.muted = false;
    if (weddingVideo.volume <= 0.05) {
      weddingVideo.volume = 0.85;
      updateVideoVolumeUI(0.85, false);
    }

    const vp = weddingVideo.play();
    if (vp !== undefined) {
      vp.then(() => {
        updateVideoPlayUI(true);
        updateVideoProgressUI();
      }).catch((err) => {
        console.warn('Video play attempt failed, retrying with fallback sources:', err);
        const fallbacks = [
          'assets/video/boda.mp4',
          'public/assets/video/boda.mp4',
          'assets/video/lexfer_boda.mp4',
          'public/assets/video/lexfer_boda.mp4',
          'assets/video/Lexfer_boda.mp4'
        ];
        let idx = 0;
        function tryNextFallback() {
          if (idx < fallbacks.length) {
            weddingVideo.src = fallbacks[idx++];
            weddingVideo.load();
            weddingVideo.play().then(() => {
              updateVideoPlayUI(true);
              updateVideoProgressUI();
            }).catch(tryNextFallback);
          } else {
            // Si el navegador bloqueó la reproducción automática con audio, intentar sin silenciar
            weddingVideo.muted = false;
            updateVideoPlayUI(false);
          }
        }
        tryNextFallback();
      });
    } else {
      updateVideoPlayUI(true);
      updateVideoProgressUI();
    }
  } else {
    weddingVideo.pause();
    updateVideoPlayUI(false);
    updateVideoProgressUI();
  }
}

function toggleVideoFullscreen() {
  const container = document.getElementById('weddingVideoContainer');
  const target = container || weddingVideo;
  if (!target) return;

  if (!document.fullscreenElement) {
    if (target.requestFullscreen) {
      target.requestFullscreen().catch(() => {});
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }
}

if (weddingVideo instanceof HTMLVideoElement) {
  // Asegurar src inicial directo y volumen óptimo
  if (!weddingVideo.src || weddingVideo.src === '' || weddingVideo.src.endsWith('/')) {
    weddingVideo.src = 'assets/video/boda.mp4';
  }
  weddingVideo.muted = false;
  weddingVideo.volume = 0.85;
  updateVideoVolumeUI(weddingVideo.volume, weddingVideo.muted);
  updateVideoProgressUI();

  const syncVideoBadge = () => {
    updateVideoProgressUI();
    const vBadge = document.getElementById('videoSourceBadge');
    if (vBadge && weddingVideo.duration && isFinite(weddingVideo.duration)) {
      const dur = Math.round(weddingVideo.duration);
      vBadge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="font-sans font-medium text-emerald-200">Carga Automática Directa:</span>
        <code class="text-emerald-300 font-bold">public/assets/video/boda.mp4</code>
        <span class="text-emerald-400/80 font-sans text-[10px] hidden sm:inline">(${dur}s &bull; HD Conectado)</span>
      `;
    }
  };

  // Si ya tiene metadata lista por caché
  if (weddingVideo.readyState >= 1) {
    syncVideoBadge();
  }

  weddingVideo.addEventListener('loadedmetadata', syncVideoBadge);
  weddingVideo.addEventListener('durationchange', syncVideoBadge);
  weddingVideo.addEventListener('canplay', syncVideoBadge);
  weddingVideo.addEventListener('timeupdate', updateVideoProgressUI);
  weddingVideo.addEventListener('progress', updateVideoProgressUI);
  weddingVideo.addEventListener('seeked', updateVideoProgressUI);

  weddingVideo.addEventListener('error', () => {
    console.warn('Error en video de boda, probando fallback a assets/video/lexfer_boda.mp4...');
    if (!weddingVideo.src.includes('lexfer_boda.mp4')) {
      weddingVideo.src = 'assets/video/lexfer_boda.mp4';
      weddingVideo.load();
    }
  });

  weddingVideo.addEventListener('play', () => {
    if (isPlaying) {
      wasBgMusicPlayingBeforeInterrupt = true;
    }
    pauseBgMusic(false);
    updateVideoPlayUI(true);
    updateVideoProgressUI();
  });
  weddingVideo.addEventListener('pause', () => {
    updateVideoPlayUI(false);
    updateVideoProgressUI();
    if (wasBgMusicPlayingBeforeInterrupt && (!voiceNoteAudio || voiceNoteAudio.paused) && (!drivingVideo || drivingVideo.paused)) {
      wasBgMusicPlayingBeforeInterrupt = false;
      playBgMusic();
    }
  });
  weddingVideo.addEventListener('ended', () => {
    updateVideoPlayUI(false);
    if (videoProgressBar) videoProgressBar.style.width = '0%';
    if (videoProgressThumb) videoProgressThumb.style.left = '0%';
    if (videoOverlayProgressBar) videoOverlayProgressBar.style.width = '0%';
    if (videoSeekInput) videoSeekInput.value = '0';
    if (videoCurrentTimeDisplay) videoCurrentTimeDisplay.textContent = '0:00';
    if (wasBgMusicPlayingBeforeInterrupt && (!voiceNoteAudio || voiceNoteAudio.paused) && (!drivingVideo || drivingVideo.paused)) {
      wasBgMusicPlayingBeforeInterrupt = false;
      playBgMusic();
    }
  });
  weddingVideo.addEventListener('volumechange', () => {
    updateVideoVolumeUI(weddingVideo.volume, weddingVideo.muted);
  });

  // Tooltip de tiempo en hover sobre el scrubber
  if (videoProgressContainer) {
    videoProgressContainer.addEventListener('mousemove', (e) => {
      if (!videoSeekTooltip || !weddingVideo.duration) return;
      const rect = videoProgressContainer.getBoundingClientRect();
      const hoverX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const pct = hoverX / rect.width;
      const hoverTime = pct * weddingVideo.duration;
      videoSeekTooltip.style.left = `${hoverX}px`;
      videoSeekTooltip.textContent = formatVideoTime(hoverTime);
    });
  }

  // Carga directa de video local opcional para probar otro archivo temporal
  if (videoFileInput) {
    videoFileInput.addEventListener('change', (e) => {
      const target = e.target;
      if (target instanceof HTMLInputElement && target.files && target.files[0]) {
        const file = target.files[0];
        weddingVideo.src = URL.createObjectURL(file);
        weddingVideo.load();
        const vBadge = document.getElementById('videoSourceBadge');
        if (vBadge) {
          vBadge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 font-mono text-[11px] shadow-sm';
          vBadge.innerHTML = `
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span class="font-sans font-medium text-amber-200">Video Temporal:</span>
            <code class="text-amber-300 font-bold">${file.name}</code>
          `;
        }
        weddingVideo.play().then(() => {
          updateVideoPlayUI(true);
          updateVideoProgressUI();
        }).catch((err) => {
          console.warn('Error al reproducir video cargado:', err);
        });
      }
    });
  }

  // Carga directa de foto de portada opcional para probar cualquier imagen al instante
  const posterFileInput = document.getElementById('posterFileInput');
  if (posterFileInput) {
    posterFileInput.addEventListener('change', (e) => {
      const target = e.target;
      if (target instanceof HTMLInputElement && target.files && target.files[0]) {
        const file = target.files[0];
        const objUrl = URL.createObjectURL(file);
        weddingVideo.poster = objUrl;
        const playOverlay = document.getElementById('videoPlayOverlay');
        if (playOverlay && weddingVideo.paused) {
          playOverlay.style.opacity = '1';
          playOverlay.style.pointerEvents = 'auto';
        }
      }
    });
  }
}

// ==========================================================================
// Control de Video: Aprendiendo al Volante (Capítulo V - 2 Enero 2023)
// ==========================================================================
const drivingVideo = document.getElementById('drivingVideo');
const drivingVideoPlayBtn = document.getElementById('drivingVideoPlayBtn');
const drivingVideoPlayIconContainer = document.getElementById('drivingVideoPlayIconContainer');
const drivingVideoPlayOverlay = document.getElementById('drivingVideoPlayOverlay');
const drivingOverlayPlayIconContainer = document.getElementById('drivingOverlayPlayIconContainer');
const drivingVideoProgressBar = document.getElementById('drivingVideoProgressBar');
const drivingVideoProgressContainer = document.getElementById('drivingVideoProgressContainer');
const drivingVideoProgressThumb = document.getElementById('drivingVideoProgressThumb');
const drivingVideoSeekInput = document.getElementById('drivingVideoSeekInput');
const drivingVideoBufferBar = document.getElementById('drivingVideoBufferBar');
const drivingVideoOverlayProgressBar = document.getElementById('drivingVideoOverlayProgressBar');
const drivingVideoSeekTooltip = document.getElementById('drivingVideoSeekTooltip');
const drivingVideoCurrentTimeDisplay = document.getElementById('drivingVideoCurrentTimeDisplay');
const drivingVideoDurationDisplay = document.getElementById('drivingVideoDurationDisplay');
const drivingVideoStatusDot = document.getElementById('drivingVideoStatusDot');
const drivingVideoStatusText = document.getElementById('drivingVideoStatusText');
const drivingVideoMuteBtn = document.getElementById('drivingVideoMuteBtn');
const drivingVideoMuteIconContainer = document.getElementById('drivingVideoMuteIconContainer');
const drivingVideoVolumeSlider = document.getElementById('drivingVideoVolumeSlider');
const drivingVideoFullscreenBtn = document.getElementById('drivingVideoFullscreenBtn');

let drivingVideoPreviousVolume = 0.85;
let isSeekingDrivingVideo = false;

function updateDrivingVideoProgressUI() {
  if (!(drivingVideo instanceof HTMLVideoElement)) return;
  const duration = drivingVideo.duration;
  const current = drivingVideo.currentTime || 0;

  if (duration && !isNaN(duration) && duration > 0 && isFinite(duration)) {
    const pct = Math.max(0, Math.min(100, (current / duration) * 100));
    
    if (drivingVideoProgressBar) {
      drivingVideoProgressBar.style.width = `${pct}%`;
    }
    if (drivingVideoProgressThumb) {
      drivingVideoProgressThumb.style.left = `${pct}%`;
    }
    if (drivingVideoOverlayProgressBar) {
      drivingVideoOverlayProgressBar.style.width = `${pct}%`;
    }
    if (drivingVideoSeekInput && !isSeekingDrivingVideo) {
      drivingVideoSeekInput.value = String(pct);
    }
    if (drivingVideoCurrentTimeDisplay) {
      drivingVideoCurrentTimeDisplay.textContent = formatVideoTime(current);
    }
    if (drivingVideoDurationDisplay) {
      drivingVideoDurationDisplay.textContent = formatVideoTime(duration);
    }
    if (drivingVideoBufferBar && drivingVideo.buffered && drivingVideo.buffered.length > 0) {
      try {
        const bufferedEnd = drivingVideo.buffered.end(drivingVideo.buffered.length - 1);
        const buffPct = Math.max(0, Math.min(100, (bufferedEnd / duration) * 100));
        drivingVideoBufferBar.style.width = `${buffPct}%`;
      } catch {
        // Ignorar si el rango no está disponible
      }
    }
  } else {
    if (drivingVideoCurrentTimeDisplay) {
      drivingVideoCurrentTimeDisplay.textContent = formatVideoTime(current);
    }
  }
}

function onDrivingVideoSeekInput(val) {
  isSeekingDrivingVideo = true;
  const pct = Math.max(0, Math.min(100, parseFloat(val) || 0));
  if (drivingVideoProgressBar) drivingVideoProgressBar.style.width = `${pct}%`;
  if (drivingVideoProgressThumb) drivingVideoProgressThumb.style.left = `${pct}%`;
  if (drivingVideoOverlayProgressBar) drivingVideoOverlayProgressBar.style.width = `${pct}%`;

  if (drivingVideo instanceof HTMLVideoElement && drivingVideo.duration) {
    const previewTime = (pct / 100) * drivingVideo.duration;
    if (drivingVideoCurrentTimeDisplay) {
      drivingVideoCurrentTimeDisplay.textContent = formatVideoTime(previewTime);
    }
  }
}

function onDrivingVideoSeekChange(val) {
  isSeekingDrivingVideo = false;
  if (!(drivingVideo instanceof HTMLVideoElement)) return;
  const pct = Math.max(0, Math.min(100, parseFloat(val) || 0));
  if (drivingVideo.duration && !isNaN(drivingVideo.duration)) {
    drivingVideo.currentTime = (pct / 100) * drivingVideo.duration;
    updateDrivingVideoProgressUI();
  }
}

function pauseDrivingVideo() {
  if (drivingVideo instanceof HTMLVideoElement && !drivingVideo.paused) {
    drivingVideo.pause();
    updateDrivingVideoPlayUI(false);
  }
}

function updateDrivingVideoPlayUI(playing) {
  setElementSvg('drivingVideoPlayIconContainer', playing ? SVG_ICONS.pause : SVG_ICONS.play);
  setElementSvg('drivingOverlayPlayIconContainer', playing ? SVG_ICONS.bigPause : SVG_ICONS.bigPlay);

  if (drivingVideoPlayBtn) {
    if (playing) {
      drivingVideoPlayBtn.classList.remove('bg-amber-500/20', 'text-amber-400');
      drivingVideoPlayBtn.classList.add('bg-amber-500', 'text-slate-950', 'shadow-lg', 'shadow-amber-500/30', 'scale-105');
      drivingVideoPlayBtn.setAttribute('title', 'Pausar video');
    } else {
      drivingVideoPlayBtn.classList.remove('bg-amber-500', 'text-slate-950', 'shadow-lg', 'shadow-amber-500/30', 'scale-105');
      drivingVideoPlayBtn.classList.add('bg-amber-500/20', 'text-amber-400');
      drivingVideoPlayBtn.setAttribute('title', 'Reproducir video');
    }
  }

  if (drivingVideoPlayOverlay) {
    if (playing) {
      drivingVideoPlayOverlay.classList.add('opacity-0', 'pointer-events-none');
    } else {
      drivingVideoPlayOverlay.classList.remove('opacity-0', 'pointer-events-none');
    }
  }

  if (drivingVideoStatusDot) {
    drivingVideoStatusDot.className = playing 
      ? 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse'
      : 'w-2 h-2 rounded-full bg-slate-500';
  }
  if (drivingVideoStatusText) {
    drivingVideoStatusText.textContent = playing ? 'Reproduciendo' : 'Pausado';
  }
}

function updateDrivingVideoVolumeUI(volume, muted) {
  const effectiveVol = muted ? 0 : volume;
  if (drivingVideoVolumeSlider instanceof HTMLInputElement) {
    drivingVideoVolumeSlider.value = String(effectiveVol);
  }
  if (muted || effectiveVol === 0) {
    setElementSvg('drivingVideoMuteIconContainer', SVG_ICONS.volumeX);
  } else if (effectiveVol < 0.5) {
    setElementSvg('drivingVideoMuteIconContainer', SVG_ICONS.volume1);
  } else {
    setElementSvg('drivingVideoMuteIconContainer', SVG_ICONS.volume2);
  }
}

function setDrivingVideoVolume(val) {
  if (!(drivingVideo instanceof HTMLVideoElement)) return;
  const num = Math.max(0, Math.min(1, parseFloat(val)));
  drivingVideo.volume = num;
  if (num > 0) {
    drivingVideo.muted = false;
    drivingVideoPreviousVolume = num;
  } else {
    drivingVideo.muted = true;
  }
  updateDrivingVideoVolumeUI(drivingVideo.volume, drivingVideo.muted);
}

function toggleDrivingVideoMute() {
  if (!(drivingVideo instanceof HTMLVideoElement)) return;
  drivingVideo.muted = !drivingVideo.muted;
  if (!drivingVideo.muted && drivingVideo.volume === 0) {
    drivingVideo.volume = drivingVideoPreviousVolume || 0.85;
  }
  updateDrivingVideoVolumeUI(drivingVideo.volume, drivingVideo.muted);
}

function skipDrivingVideo(seconds) {
  if (!(drivingVideo instanceof HTMLVideoElement)) return;
  const duration = drivingVideo.duration || 1000;
  drivingVideo.currentTime = Math.max(0, Math.min(duration, drivingVideo.currentTime + seconds));
}

function toggleDrivingVideo() {
  if (!(drivingVideo instanceof HTMLVideoElement)) return;

  if (drivingVideo.paused || drivingVideo.ended) {
    // Pausar música de fondo y otros reproductores
    if (isPlaying) {
      wasBgMusicPlayingBeforeInterrupt = true;
    }
    pauseBgMusic(false);

    pauseWeddingVideo();

    if (voiceNoteAudio instanceof HTMLAudioElement && !voiceNoteAudio.paused) {
      voiceNoteAudio.pause();
      updateVoiceNoteUI(false);
    }

    if (!drivingVideo.src || drivingVideo.src === '' || drivingVideo.src.endsWith('/')) {
      drivingVideo.src = 'assets/video/Lexfer19_20230102_aprendiendo.mp4';
      drivingVideo.load();
    }

    drivingVideo.muted = false;
    if (drivingVideo.volume <= 0.05) {
      drivingVideo.volume = 0.85;
      updateDrivingVideoVolumeUI(0.85, false);
    }

    const vp = drivingVideo.play();
    if (vp !== undefined) {
      vp.then(() => {
        updateDrivingVideoPlayUI(true);
        updateDrivingVideoProgressUI();
      }).catch((err) => {
        console.warn('Driving video play attempt failed:', err);
      });
    }
  } else {
    drivingVideo.pause();
  }
}

function toggleDrivingVideoFullscreen() {
  if (!(drivingVideo instanceof HTMLVideoElement)) return;
  const container = document.getElementById('drivingVideoContainer');
  const target = container || drivingVideo;

  if (!document.fullscreenElement) {
    if (target.requestFullscreen) {
      target.requestFullscreen().catch(() => {});
    } else if (target['webkitRequestFullscreen']) {
      target['webkitRequestFullscreen']();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }
}

if (drivingVideo instanceof HTMLVideoElement) {
  if (!drivingVideo.src || drivingVideo.src === '' || drivingVideo.src.endsWith('/')) {
    drivingVideo.src = 'assets/video/Lexfer19_20230102_aprendiendo.mp4';
  }
  drivingVideo.muted = false;
  drivingVideo.volume = 0.85;
  updateDrivingVideoVolumeUI(drivingVideo.volume, drivingVideo.muted);

  const syncDrivingDuration = () => {
    if (drivingVideo.duration && isFinite(drivingVideo.duration)) {
      if (drivingVideoDurationDisplay) {
        drivingVideoDurationDisplay.textContent = formatVideoTime(drivingVideo.duration);
      }
    }
  };

  drivingVideo.addEventListener('loadedmetadata', syncDrivingDuration);
  drivingVideo.addEventListener('durationchange', syncDrivingDuration);
  drivingVideo.addEventListener('canplay', syncDrivingDuration);
  drivingVideo.addEventListener('timeupdate', updateDrivingVideoProgressUI);
  drivingVideo.addEventListener('progress', updateDrivingVideoProgressUI);
  drivingVideo.addEventListener('seeked', updateDrivingVideoProgressUI);

  drivingVideo.addEventListener('play', () => {
    if (isPlaying) {
      wasBgMusicPlayingBeforeInterrupt = true;
    }
    pauseBgMusic(false);
    updateDrivingVideoPlayUI(true);
    updateDrivingVideoProgressUI();
  });

  drivingVideo.addEventListener('pause', () => {
    updateDrivingVideoPlayUI(false);
    updateDrivingVideoProgressUI();
    if (wasBgMusicPlayingBeforeInterrupt && (!weddingVideo || weddingVideo.paused) && (!voiceNoteAudio || voiceNoteAudio.paused)) {
      wasBgMusicPlayingBeforeInterrupt = false;
      playBgMusic();
    }
  });

  drivingVideo.addEventListener('ended', () => {
    updateDrivingVideoPlayUI(false);
    if (drivingVideoProgressBar) drivingVideoProgressBar.style.width = '0%';
    if (drivingVideoProgressThumb) drivingVideoProgressThumb.style.left = '0%';
    if (drivingVideoOverlayProgressBar) drivingVideoOverlayProgressBar.style.width = '0%';
    if (drivingVideoSeekInput) drivingVideoSeekInput.value = '0';
    if (drivingVideoCurrentTimeDisplay) drivingVideoCurrentTimeDisplay.textContent = '0:00';
    if (wasBgMusicPlayingBeforeInterrupt && (!weddingVideo || weddingVideo.paused) && (!voiceNoteAudio || voiceNoteAudio.paused)) {
      wasBgMusicPlayingBeforeInterrupt = false;
      playBgMusic();
    }
  });

  drivingVideo.addEventListener('volumechange', () => {
    updateDrivingVideoVolumeUI(drivingVideo.volume, drivingVideo.muted);
  });

  if (drivingVideoProgressContainer) {
    drivingVideoProgressContainer.addEventListener('mousemove', (e) => {
      if (!drivingVideoSeekTooltip || !drivingVideo.duration) return;
      const rect = drivingVideoProgressContainer.getBoundingClientRect();
      const hoverX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const pct = hoverX / rect.width;
      const hoverTime = pct * drivingVideo.duration;
      drivingVideoSeekTooltip.textContent = formatVideoTime(hoverTime);
      drivingVideoSeekTooltip.style.left = `${hoverX}px`;
    });
  }
}

// Giro interactivo de tarjetas (3D Flip)
function toggleFlip(cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;
  card.classList.toggle('is-flipped');
  card.classList.toggle('flipped');
  playFlipSound();
  initLucideIcons();
}

// Garantizar visibilidad de todos los nodos de la línea de tiempo
function ensureTimelineVisibility() {
  document.querySelectorAll('.timeline-node').forEach(node => {
    node.classList.add('visible');
  });
}
ensureTimelineVisibility();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ensureTimelineVisibility);
}
window.addEventListener('load', ensureTimelineVisibility);

// Barra de lectura superior sincronizada
const scrollProgressBar = document.getElementById('scrollProgressBar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  if (docHeight > 0 && scrollProgressBar) {
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgressBar.style.width = scrollPercent + '%';
  }
}, { passive: true });

// Comparador 1994 vs 2026 (Slider interactivo de 2 fotos táctil y ratón)
const compareWrapper = document.getElementById('compareWrapper');
const compareOverlay = document.getElementById('compareOverlay');
const compareOverlayImg = document.getElementById('compareOverlayImg');
const compareHandle = document.getElementById('compareHandle');
const compareImgHoy = document.getElementById('compareImgHoy');
const badgeInicios = document.getElementById('badgeInicios');
const badgeHoy = document.getElementById('badgeHoy');
const rangeSlider = document.getElementById('rangeSlider');
const sliderVal = document.getElementById('sliderVal');

let isSliding = false;
let currentSliderPos = 50; // %

function renderComparator(pos) {
  if (!compareWrapper) return;
  const clamped = Math.max(0, Math.min(100, pos));
  currentSliderPos = clamped;

  if (compareOverlay) {
    compareOverlay.style.width = '100%';
    compareOverlay.style.height = '100%';
    if (clamped >= 99.8) {
      // Foto 1994 (Inicios) 100% completa: sin recorte, sin transparencia
      compareOverlay.style.clipPath = 'none';
      compareOverlay.style.webkitClipPath = 'none';
      compareOverlay.style.opacity = '1';
    } else if (clamped <= 0.2) {
      // Foto 2026 (Actual) 100% completa: capa superior oculta limpiamente
      compareOverlay.style.clipPath = 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)';
      compareOverlay.style.webkitClipPath = 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)';
      compareOverlay.style.opacity = '0';
    } else {
      // División continua precisa en el porcentaje exacto
      compareOverlay.style.opacity = '1';
      compareOverlay.style.clipPath = `polygon(0% 0%, ${clamped}% 0%, ${clamped}% 100%, 0% 100%)`;
      compareOverlay.style.webkitClipPath = `polygon(0% 0%, ${clamped}% 0%, ${clamped}% 100%, 0% 100%)`;
    }
  }

  if (compareHandle) {
    compareHandle.style.left = `${clamped}%`;
  }

  if (rangeSlider && Math.abs(parseFloat(rangeSlider.value) - clamped) > 0.1) {
    rangeSlider.value = clamped;
  }

  if (sliderVal) {
    sliderVal.textContent = Math.round(clamped) + '%';
  }

  if (badgeInicios) {
    badgeInicios.style.opacity = clamped > 8 ? '1' : '0';
    badgeInicios.style.pointerEvents = clamped > 8 ? 'auto' : 'none';
  }

  if (badgeHoy) {
    badgeHoy.style.opacity = clamped < 92 ? '1' : '0';
    badgeHoy.style.pointerEvents = clamped < 92 ? 'auto' : 'none';
  }
}

function setComparatorPercent(pct) {
  renderComparator(pct);
}
window.setComparatorPercent = setComparatorPercent;

// Funciones de compatibilidad global
window.setCompareMode = function(mode) {
  if (mode === 'hoy-solo' || mode === 'hoy') {
    setComparatorPercent(0);
  } else if (mode === 'inicios' || mode === 'inicios-solo') {
    setComparatorPercent(100);
  } else {
    setComparatorPercent(50);
  }
};
window.setStagePreset = function(stage) {
  if (stage === 'inicios') setComparatorPercent(100);
  else if (stage === 'hoy') setComparatorPercent(0);
  else setComparatorPercent(50);
};

function handleComparatorMove(clientX) {
  if (!compareWrapper) return;
  const rect = compareWrapper.getBoundingClientRect();
  if (rect.width <= 0) return;
  let pct = ((clientX - rect.left) / rect.width) * 100;
  pct = Math.max(0, Math.min(100, pct));
  renderComparator(pct);
}

if (compareWrapper) {
  const onPointerStart = (e) => {
    isSliding = true;
    const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
    handleComparatorMove(clientX);
  };

  const onPointerMove = (e) => {
    if (!isSliding) return;
    const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
    handleComparatorMove(clientX);
  };

  const onPointerEnd = () => {
    if (isSliding) {
      isSliding = false;
    }
  };

  // Arrastre directo sobre la manija divisoria
  if (compareHandle) {
    compareHandle.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      onPointerStart(e);
    });
    compareHandle.addEventListener('touchstart', onPointerStart, { passive: true });
    compareHandle.addEventListener('mousedown', onPointerStart);
  }

  // Clic y arrastre directo sobre cualquier parte del marco del comparador
  compareWrapper.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    onPointerStart(e);
  });
  compareWrapper.addEventListener('touchstart', onPointerStart, { passive: true });
  compareWrapper.addEventListener('mousedown', onPointerStart);

  // Escucha GLOBAL para no perder el arrastre en toda la ventana
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('mousemove', onPointerMove, { passive: true });

  window.addEventListener('pointerup', onPointerEnd);
  window.addEventListener('touchend', onPointerEnd);
  window.addEventListener('mouseup', onPointerEnd);
  window.addEventListener('pointercancel', onPointerEnd);
  window.addEventListener('touchcancel', onPointerEnd);

  // Sincronización con el control deslizante de rango
  if (rangeSlider) {
    rangeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      renderComparator(val);
    });
  }

  // Render inicial al cargar (50%)
  setTimeout(() => {
    renderComparator(50);
    if (window.lucide) window.lucide.createIcons();
  }, 100);
}

// Lightbox Modal
const modal = document.getElementById('lightboxModal');
const modalCard = document.getElementById('lightboxCard');
const modalImg = document.getElementById('lightboxImg');
const modalTitle = document.getElementById('lightboxTitle');
const modalDesc = document.getElementById('lightboxDesc');

function openLightboxFromImage(imgElementId, title, desc) {
  const imgEl = document.getElementById(imgElementId);
  const src = (imgEl instanceof HTMLImageElement) ? (imgEl.currentSrc || imgEl.src) : '';
  openLightbox(src, title, desc);
}

function openLightbox(src, title, desc) {
  if (!modal || !(modalImg instanceof HTMLImageElement) || !modalTitle || !modalDesc) return;
  modalImg.src = src;
  modalTitle.textContent = title;
  modalDesc.textContent = desc;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    modal.classList.remove('opacity-0');
    initLucideIcons();
  }, 10);
}

function closeLightbox() {
  if (!modal) return;
  modal.classList.add('opacity-0');
  document.body.style.overflow = '';
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 250);
}

if (modal && modalCard) {
  modal.addEventListener('click', (e) => {
    if (e.target && !modalCard.contains(e.target)) {
      closeLightbox();
    }
  });
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
    closeLightbox();
  }
});

// Celebración con confeti
function triggerCelebrationConfetti() {
  const confettiFunc = (typeof confetti === 'function') ? confetti : (typeof window !== 'undefined' ? window['confetti'] : null);
  if (typeof confettiFunc !== 'function') return;
  const duration = 3.5 * 1000;
  const animationEnd = Date.now() + duration;
  
  // Paleta festiva multicolor y muy variada
  const festiveColors = [
    '#ff0055', // Fucsia vibrante
    '#ff5000', // Naranja fuego
    '#ffbe0b', // Amarillo oro
    '#fb5607', // Coral intenso
    '#06d6a0', // Verde esmeralda menta
    '#10b981', // Verde jade
    '#00b4d8', // Azul turquesa
    '#3a86ff', // Azul eléctrico
    '#8338ec', // Violeta intenso
    '#ff006e', // Magenta
    '#f72585', // Rosa neón
    '#ffffff'  // Destello blanco
  ];

  // Estallido inicial central multicolor
  confettiFunc({
    particleCount: 50,
    spread: 90,
    origin: { y: 0.65 },
    colors: festiveColors
  });

  (function frame() {
    confettiFunc({
      particleCount: 4,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.75 },
      colors: festiveColors
    });
    confettiFunc({
      particleCount: 4,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.75 },
      colors: festiveColors
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  }());
}

const confettiBtn = document.getElementById('confettiBtn');
if (confettiBtn) {
  confettiBtn.addEventListener('click', () => {
    initAudioContext();
    triggerCelebrationConfetti();
  });
}

// Exponer funciones globales para llamadas inline del HTML
window.toggleFlip = toggleFlip;
window.toggleVoiceNote = toggleVoiceNote;
window.setVoiceNoteVolume = setVoiceNoteVolume;
window.toggleVoiceNoteMute = toggleVoiceNoteMute;
window.toggleWeddingVideo = toggleWeddingVideo;
window.setWeddingVideoVolume = setWeddingVideoVolume;
window.toggleVideoMute = toggleVideoMute;
window.skipWeddingVideo = skipWeddingVideo;
window.toggleVideoFullscreen = toggleVideoFullscreen;
window.toggleNativeVideoControls = toggleNativeVideoControls;
window.onVideoSeekInput = onVideoSeekInput;
window.onVideoSeekChange = onVideoSeekChange;
window.openLightboxFromImage = openLightboxFromImage;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.triggerCelebrationConfetti = triggerCelebrationConfetti;

// Controladores de video de aprendizaje al volante (Capítulo V)
window.toggleDrivingVideo = toggleDrivingVideo;
window.skipDrivingVideo = skipDrivingVideo;
window.setDrivingVideoVolume = setDrivingVideoVolume;
window.toggleDrivingVideoMute = toggleDrivingVideoMute;
window.toggleDrivingVideoFullscreen = toggleDrivingVideoFullscreen;
window.onDrivingVideoSeekInput = onDrivingVideoSeekInput;
window.onDrivingVideoSeekChange = onDrivingVideoSeekChange;

