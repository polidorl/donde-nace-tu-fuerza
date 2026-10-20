import math
import struct
import wave
import subprocess
import os

sample_rate = 44100
bpm = 100
beat_sec = 60.0 / bpm # ~0.6 sec per beat

NOTE_FREQS = {
    'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
    'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'G6': 1567.98
}

events = []

def add_melody(note, start_beat, dur_beats, vol=0.38, pan=0.5):
    if note not in NOTE_FREQS: return
    events.append({
        'type': 'melody',
        'freq': NOTE_FREQS[note],
        'start': start_beat * beat_sec,
        'dur': dur_beats * beat_sec,
        'vol': vol,
        'pan': pan
    })

def add_chord_note(note, start_beat, dur_beats, vol=0.18, pan=0.4):
    if note not in NOTE_FREQS: return
    events.append({
        'type': 'chord',
        'freq': NOTE_FREQS[note],
        'start': start_beat * beat_sec,
        'dur': dur_beats * beat_sec,
        'vol': vol,
        'pan': pan
    })

def add_bass(note, start_beat, dur_beats=2.0, vol=0.25, pan=0.5):
    if note not in NOTE_FREQS: return
    events.append({
        'type': 'bass',
        'freq': NOTE_FREQS[note],
        'start': start_beat * beat_sec,
        'dur': dur_beats * beat_sec,
        'vol': vol,
        'pan': pan
    })

def add_pad(note, start_beat, dur_beats, vol=0.08, pan=0.5):
    if note not in NOTE_FREQS: return
    events.append({
        'type': 'pad',
        'freq': NOTE_FREQS[note],
        'start': start_beat * beat_sec,
        'dur': dur_beats * beat_sec,
        'vol': vol,
        'pan': pan
    })

def play_waltz_bar(bar_start_beat, bass_note, chord_notes, vol=0.18):
    # Beat 1: Bass note
    add_bass(bass_note, bar_start_beat, dur_beats=1.8, vol=0.26)
    # Beat 2: Chord
    for i, n in enumerate(chord_notes):
        pan = 0.35 + (i * 0.12)
        add_chord_note(n, bar_start_beat + 1.0, dur_beats=1.2, vol=vol, pan=pan)
    # Beat 3: Chord
    for i, n in enumerate(chord_notes):
        pan = 0.4 + (i * 0.10)
        add_chord_note(n, bar_start_beat + 2.0, dur_beats=0.9, vol=vol * 0.85, pan=pan)

# Build Arrangement
cur_beat = 0.0

# INTRO (4 bars = 12 beats)
play_waltz_bar(0.0, 'C3', ['E4', 'G4', 'C5'], vol=0.15)
play_waltz_bar(3.0, 'F3', ['F4', 'A4', 'C5'], vol=0.15)
play_waltz_bar(6.0, 'G3', ['F4', 'G4', 'B4'], vol=0.16)
play_waltz_bar(9.0, 'C3', ['E4', 'G4', 'C5'], vol=0.15)

# Chime in intro
add_melody('C6', 0.0, 2.0, vol=0.2, pan=0.7)
add_melody('G5', 3.0, 2.0, vol=0.2, pan=0.3)
add_melody('A5', 6.0, 1.5, vol=0.2, pan=0.6)
add_melody('B5', 7.5, 1.5, vol=0.2, pan=0.4)

def build_happy_birthday_verse(start_b, richness=1.0):
    b = start_b
    # Pickup on beat 2 of bar 4 (beat 11): "Cum-ple"
    add_melody('G4', b - 1.0, 0.65, vol=0.35 * richness, pan=0.5)
    add_melody('G4', b - 0.35, 0.35, vol=0.35 * richness, pan=0.5)

    # Bar 1: "a-ños fe-liz" -> A4, G4, C5 (over C major)
    play_waltz_bar(b, 'C3', ['E4', 'G4', 'C5'], vol=0.18 * richness)
    add_melody('A4', b + 0.0, 0.95, vol=0.42 * richness)
    add_melody('G4', b + 1.0, 0.95, vol=0.42 * richness)
    add_melody('C5', b + 2.0, 0.95, vol=0.45 * richness)

    # Bar 2: "liz..." -> B4 (sustain) (over G major)
    play_waltz_bar(b + 3.0, 'G3', ['D4', 'G4', 'B4'], vol=0.18 * richness)
    add_melody('B4', b + 3.0, 1.8, vol=0.44 * richness)
    # Pickup: "Cum-ple"
    add_melody('G4', b + 5.0, 0.65, vol=0.35 * richness)
    add_melody('G4', b + 5.65, 0.35, vol=0.35 * richness)

    # Bar 3: "a-ños fe-liz" -> A4, G4, D5 (over G7)
    play_waltz_bar(b + 6.0, 'G3', ['F4', 'G4', 'B4'], vol=0.19 * richness)
    add_melody('A4', b + 6.0, 0.95, vol=0.42 * richness)
    add_melody('G4', b + 7.0, 0.95, vol=0.42 * richness)
    add_melody('D5', b + 8.0, 0.95, vol=0.45 * richness)

    # Bar 4: "liz..." -> C5 (sustain) (over C major)
    play_waltz_bar(b + 9.0, 'C3', ['E4', 'G4', 'C5'], vol=0.18 * richness)
    add_melody('C5', b + 9.0, 1.8, vol=0.44 * richness)
    # Pickup: "Te de-se-" (G4, G4)
    add_melody('G4', b + 11.0, 0.65, vol=0.36 * richness)
    add_melody('G4', b + 11.65, 0.35, vol=0.36 * richness)

    # Bar 5: "a-mos a ti..." -> G5, E5, C5 (over C7 / F major)
    play_waltz_bar(b + 12.0, 'C3', ['E4', 'G4', 'B4'], vol=0.18 * richness) # C dominant
    add_melody('G5', b + 12.0, 0.95, vol=0.48 * richness)
    add_melody('E5', b + 13.0, 0.95, vol=0.46 * richness)
    add_melody('C5', b + 14.0, 0.95, vol=0.44 * richness)

    # Bar 6: "Cum-ple-a-ños..." -> B4, A4 (over F major)
    play_waltz_bar(b + 15.0, 'F3', ['F4', 'A4', 'C5'], vol=0.20 * richness)
    add_melody('B4', b + 15.0, 0.95, vol=0.44 * richness)
    add_melody('A4', b + 16.0, 0.95, vol=0.44 * richness)
    # Pickup: "Lexfer" / "fe-liz" (F5, F5)
    add_melody('F5', b + 17.0, 0.65, vol=0.40 * richness)
    add_melody('F5', b + 17.65, 0.35, vol=0.40 * richness)

    # Bar 7: "cumpleaños..." -> E5, C5, D5 (over C / G7)
    play_waltz_bar(b + 18.0, 'G3', ['E4', 'G4', 'C5'], vol=0.19 * richness)
    add_melody('E5', b + 18.0, 0.95, vol=0.46 * richness)
    add_melody('C5', b + 19.0, 0.95, vol=0.44 * richness)
    add_melody('D5', b + 20.0, 0.95, vol=0.46 * richness)

    # Bar 8: "fe-liiiz!" -> C5 (sustain) (over C major)
    play_waltz_bar(b + 21.0, 'C3', ['E4', 'G4', 'C5'], vol=0.22 * richness)
    add_melody('C5', b + 21.0, 2.8, vol=0.48 * richness)

    # Warm pad chords underneath
    for bar_idx, (b_note, ch_notes) in enumerate([
        ('C3', ['C4', 'E4', 'G4']),
        ('G3', ['B3', 'D4', 'G4']),
        ('G3', ['B3', 'D4', 'F4']),
        ('C3', ['C4', 'E4', 'G4']),
        ('C3', ['C4', 'E4', 'G4', 'B4']),
        ('F3', ['C4', 'F4', 'A4']),
        ('G3', ['C4', 'E4', 'G4']),
        ('C3', ['C4', 'E4', 'G4', 'C5'])
    ]):
        bar_t = b + (bar_idx * 3.0)
        for p_note in ch_notes:
            add_pad(p_note, bar_t, 2.9, vol=0.045 * richness)

# Verse 1 (gentle karaoke piano + glockenspiel)
build_happy_birthday_verse(12.0, richness=0.95)

# Interlude between verses (2 bars)
play_waltz_bar(36.0, 'F3', ['F4', 'A4', 'C5'], vol=0.17)
play_waltz_bar(39.0, 'G3', ['F4', 'G4', 'B4'], vol=0.17)
add_melody('E5', 36.0, 1.0, vol=0.25, pan=0.6)
add_melody('F5', 37.0, 1.0, vol=0.25, pan=0.6)
add_melody('G5', 38.0, 1.0, vol=0.28, pan=0.6)

# Verse 2 (fuller, celebrating Lexfer with richer harmony)
build_happy_birthday_verse(42.0, richness=1.1)

# Outro (triumphant gentle resolution)
play_waltz_bar(66.0, 'F3', ['F4', 'A4', 'C5'], vol=0.20)
play_waltz_bar(69.0, 'G3', ['F4', 'G4', 'B4'], vol=0.20)
play_waltz_bar(72.0, 'C3', ['E4', 'G4', 'C5', 'E5'], vol=0.22)

# Outro sparkling bells
add_melody('C5', 66.0, 1.5, vol=0.35, pan=0.4)
add_melody('D5', 67.5, 1.5, vol=0.35, pan=0.6)
add_melody('E5', 69.0, 1.5, vol=0.38, pan=0.5)
add_melody('G5', 70.5, 1.5, vol=0.40, pan=0.5)
add_melody('C6', 72.0, 4.0, vol=0.42, pan=0.5)

total_duration = (72.0 + 5.0) * beat_sec # ~44.5 seconds of high-fidelity celebration
total_samples = int(sample_rate * total_duration)

print(f"Total events: {len(events)}, duration: {total_duration:.2f}s, samples: {total_samples}")

samples_l = [0.0] * total_samples
samples_r = [0.0] * total_samples

for ev in events:
    start_s = int(ev['start'] * sample_rate)
    dur_s = int(ev['dur'] * sample_rate)
    freq = ev['freq']
    vol = ev['vol']
    pan = ev['pan']
    ev_type = ev['type']

    end_s = min(total_samples, start_s + dur_s)
    
    for i in range(start_s, end_s):
        t_rel = (i - start_s) / sample_rate
        
        if ev_type == 'melody':
            # Bell-piano with rich shimmer
            sig = (
                1.0 * math.sin(2.0 * math.pi * freq * t_rel) +
                0.40 * math.sin(4.0 * math.pi * freq * t_rel) * math.exp(-1.5 * t_rel) +
                0.20 * math.sin(6.0 * math.pi * freq * t_rel) * math.exp(-3.0 * t_rel) +
                0.08 * math.sin(8.0 * math.pi * freq * t_rel) * math.exp(-5.0 * t_rel) +
                0.06 * math.sin(2.756 * 2.0 * math.pi * freq * t_rel) * math.exp(-4.0 * t_rel) # celesta chime
            )
            env = math.exp(-2.2 * t_rel) * (1.0 - math.exp(-50.0 * t_rel))
            val = sig * env * vol
        elif ev_type == 'chord':
            # Warm acoustic piano chord
            sig = (
                0.85 * math.sin(2.0 * math.pi * freq * t_rel) +
                0.35 * math.sin(4.0 * math.pi * freq * t_rel) * math.exp(-1.8 * t_rel) +
                0.15 * math.sin(6.0 * math.pi * freq * t_rel) * math.exp(-3.5 * t_rel)
            )
            env = math.exp(-1.8 * t_rel) * (1.0 - math.exp(-40.0 * t_rel))
            val = sig * env * vol
        elif ev_type == 'bass':
            # Upright acoustic bass
            sig = (
                1.0 * math.sin(2.0 * math.pi * freq * t_rel) +
                0.35 * math.sin(4.0 * math.pi * freq * t_rel) * math.exp(-1.5 * t_rel)
            )
            env = math.exp(-1.4 * t_rel) * (1.0 - math.exp(-30.0 * t_rel))
            val = sig * env * vol
        elif ev_type == 'pad':
            # Warm analog strings pad
            sig = (
                math.sin(2.0 * math.pi * freq * t_rel) +
                0.3 * math.sin(4.0 * math.pi * freq * t_rel) +
                0.15 * math.sin(2.0 * math.pi * (freq * 1.002) * t_rel) # slight chorus detune
            )
            # smooth envelope
            pad_dur = ev['dur']
            rel_pct = t_rel / pad_dur
            env = math.sin(math.pi * min(1.0, max(0.0, rel_pct)))
            val = sig * env * vol
        else:
            val = 0.0

        samples_l[i] += val * (1.0 - pan) * 1.414
        samples_r[i] += val * pan * 1.414

# Master fade out
fade_s = int(2.0 * sample_rate)
for i in range(total_samples - fade_s, total_samples):
    factor = (total_samples - i) / fade_s
    samples_l[i] *= factor
    samples_r[i] *= factor

# Normalize and convert to 16-bit PCM WAV
max_val = max(max(abs(x) for x in samples_l), max(abs(x) for x in samples_r))
norm_factor = 0.85 / max_val if max_val > 0.0 else 1.0

int_samples = bytearray()
for l, r in zip(samples_l, samples_r):
    sl = int(max(-1.0, min(1.0, l * norm_factor)) * 32767)
    sr = int(max(-1.0, min(1.0, r * norm_factor)) * 32767)
    int_samples.extend(struct.pack('<hh', sl, sr))

wav_tmp = '/tmp/feliz_cumpleanos_raw.wav'
with wave.open(wav_tmp, 'w') as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(sample_rate)
    wf.writeframes(int_samples)

print(f"Written raw WAV to {wav_tmp}")

# Add subtle warm studio reverb with ffmpeg and encode to MP3
mp3_target = '/tmp/feliz_cumpleanos_karaoke.mp3'
# aecho filter for warm karaoke spatial acoustic resonance
cmd = [
    'ffmpeg', '-y', '-i', wav_tmp,
    '-af', 'aecho=0.8:0.88:40|80:0.25|0.15,volume=1.0',
    '-c:a', 'libmp3lame', '-b:a', '192k',
    mp3_target
]
subprocess.run(cmd, check=True)
print(f"Generated professional MP3: {mp3_target} ({os.path.getsize(mp3_target)} bytes)")

