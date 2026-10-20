import math
import struct
import wave
import subprocess
import os

sample_rate = 44100
duration = 20.0  # seconds
num_samples = int(sample_rate * duration)

# Gentle romantic chords progression: C -> G -> Am -> F -> C -> G -> C
chords = [
    [261.63, 329.63, 392.00, 523.25], # C major (C4, E4, G4, C5)
    [196.00, 246.94, 293.66, 392.00], # G major (G3, B3, D4, G4)
    [220.00, 261.63, 329.63, 440.00], # A minor (A3, C4, E4, A4)
    [174.61, 220.00, 261.63, 349.23], # F major (F3, A3, C4, F4)
    [261.63, 329.63, 392.00, 523.25], # C major
    [196.00, 246.94, 293.66, 392.00], # G major
    [261.63, 329.63, 392.00, 523.25], # C major
]

chord_duration = duration / len(chords)

samples_l = []
samples_r = []

for i in range(num_samples):
    t = i / sample_rate
    chord_idx = min(int(t / chord_duration), len(chords) - 1)
    chord_t = t - (chord_idx * chord_duration)
    current_chord = chords[chord_idx]
    
    # Envelope for each chord note
    env = math.exp(-1.8 * chord_t) * (1.0 - math.exp(-20.0 * chord_t))
    
    val_l = 0.0
    val_r = 0.0
    for idx, freq in enumerate(current_chord):
        # Arpeggio offset
        note_offset = idx * 0.25
        if chord_t >= note_offset:
            sub_t = chord_t - note_offset
            sub_env = math.exp(-2.2 * sub_t) * (1.0 - math.exp(-30.0 * sub_t))
            # fundamental + soft harmonic
            tone = math.sin(2.0 * math.pi * freq * t) + 0.35 * math.sin(4.0 * math.pi * freq * t) + 0.15 * math.sin(6.0 * math.pi * freq * t)
            pan = (idx / 3.0) # 0 to 1
            val_l += tone * sub_env * (1.0 - 0.5 * pan)
            val_r += tone * sub_env * (0.5 + 0.5 * pan)
            
    # Base pad sustain
    pad_env = math.sin(math.pi * (t / duration)) * 0.4
    for freq in current_chord[:2]:
        val_l += 0.2 * math.sin(2.0 * math.pi * freq * t) * pad_env
        val_r += 0.2 * math.sin(2.0 * math.pi * freq * t) * pad_env

    # Overall master envelope fade-in and fade-out
    master_fade = 1.0
    if t < 0.5:
        master_fade = t / 0.5
    elif t > (duration - 1.0):
        master_fade = (duration - t) / 1.0
        
    val_l *= master_fade * 0.45
    val_r *= master_fade * 0.45
    
    # Clip protection
    val_l = max(-0.95, min(0.95, val_l))
    val_r = max(-0.95, min(0.95, val_r))
    
    samples_l.append(int(val_l * 32767))
    samples_r.append(int(val_r * 32767))

wav_path = "/tmp/wedding_audio.wav"
with wave.open(wav_path, "w") as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(sample_rate)
    data = bytearray()
    for l, r in zip(samples_l, samples_r):
        data.extend(struct.pack("<hh", l, r))
    wf.writeframes(data)

print(f"Generated {wav_path}")
