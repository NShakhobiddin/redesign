#!/usr/bin/env python3
"""Places a one-take voice-over on the promo's moments and ducks the music under it.

python3 tools/place-voice.py <voice.mp3> <music.wav> <out.wav>

The take is the VOICEOVER.md script read in one go. It splits at its pauses
into 22 phrases (line 1 in two, the 3-2-1 in three, "Bu — / Pochtam!",
the three numbers, "Orzuingiz — / eshigingiz oldida!", "Hoziroq sinab
ko'ring — / Pochtam nuqta uz!"); each phrase starts at its moment in the
film (ONSETS). The music (tools/fit-music.py output) sits 2 dB down and
ducks 8 dB more while the voice speaks, starting just before a phrase and
easing back after it.
"""
import subprocess, sys, wave
import numpy as np

vo_src, mus_src, dst = sys.argv[1:4]
SR, END = 48000, 44.5
ONSETS = [0.20, 2.00,                  # Taxmin qiling! | Uyingizgacha qanchaga tushadi?
          4.50, 5.00, 5.55,            # Uch | ikki | bir (the 3-2-1 on screen)
          6.08,                        # Javob — bitta skrinshotda!
          8.20, 8.80,                  # Bu — | Pochtam! (with the logo)
          10.10, 14.10, 19.10, 22.10, 25.10, 28.60,
          31.95, 33.05, 34.07,         # Qirq uch do'kon | Yigirma kuryer | Uch til! (one per counter)
          35.10,                       # Hammasi — bitta ilovada.
          38.35, 39.40,                # Orzuingiz — | eshigingiz oldida! (the parcel lands at 38.3)
          41.30, 42.55]                # Hoziroq sinab ko'ring — | Pochtam nuqta uz! (pochtam.uz at 42.5)
BASE_DB, DUCK_DB, VO_DB = -2.0, -8.0, 2.0

def decode(path, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-map', '0:a', '-ac', str(ch), '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, ch)

vo = decode(vo_src, 1)[:, 0]; mus = decode(mus_src, 2)[:int(END*SR)]
# phrases: 10 ms frames above -45 dBFS, gaps shorter than 0.15 s bridged
hop = SR//100; e = np.sqrt(np.convolve(vo**2, np.ones(hop)/hop, 'same'))[::hop]; on = 20*np.log10(e + 1e-9) > -45
segs, i = [], 0
while i < len(on):
    if on[i]:
        j = i
        while j < len(on) and (on[j] or on[j:j + 15].any()): j += 1
        if j - i > 5: segs.append((i/100, j/100))
        i = j
    else: i += 1
# this take breathes twice inside line 6 and once inside line 9: those pieces stay together
JOIN = [(9, 11), (14, 15)] if len(segs) == 25 else []
for a_, b_ in reversed(JOIN): segs[a_:b_ + 1] = [(segs[a_][0], segs[b_][1])]
assert len(segs) == len(ONSETS), f'expected {len(ONSETS)} phrases, found {len(segs)}: {segs}'
out_vo = np.zeros(int(END*SR), np.float32); mask = np.zeros_like(out_vo)
for (s, e_), t in zip(segs, ONSETS):
    a, b = int((s - .03)*SR), int((e_ + .06)*SR); piece = vo[max(0, a):b].copy(); f = int(.008*SR)
    piece[:f] *= np.linspace(0, 1, f); piece[-f:] *= np.linspace(1, 0, f)
    p0 = int((t - .03)*SR); p1 = min(len(out_vo), p0 + len(piece)); out_vo[p0:p1] += piece[:p1 - p0]
    mask[int((t - .12)*SR):int((t + e_ - s + .05)*SR)] = 1
    print(f'{s:6.2f}-{e_:6.2f} ({e_ - s:4.2f} s) -> {t:6.2f}-{t + e_ - s:6.2f}')
# smooth the duck: ~80 ms down, ~400 ms back up
env = np.zeros_like(mask); att, rel = 1 - np.exp(-1/(.08*SR/32)), 1 - np.exp(-1/(.4*SR/32)); m = mask[::32]; y = 0.0; sm = np.empty_like(m)
for k, v in enumerate(m): y += (att if v > y else rel)*(v - y); sm[k] = y
env = np.repeat(sm, 32)[:len(mask)]
g = 10**((BASE_DB + DUCK_DB*env)/20)
mix = mus*g[:, None] + (out_vo*10**(VO_DB/20))[:, None]
vo_on = env > .9; mu_db = 10*np.log10(((mus[vo_on]*g[vo_on, None])**2).mean() + 1e-12); vo_db = 10*np.log10(((out_vo[vo_on]*10**(VO_DB/20))**2).mean() + 1e-12)
print(f'while speaking: voice {vo_db:.1f} dB RMS, music {mu_db:.1f} dB RMS (voice {vo_db - mu_db:+.1f} dB over the music)')
pk = np.abs(mix).max(); mix *= min(1, .89/pk)                                # headroom for the final loudness pass
w = wave.open(dst, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(mix, -1, 1)*32767).astype('<i2').tobytes()); w.close()
print(f'{dst}: {len(mix)/SR:.2f} s, peak {20*np.log10(np.abs(mix).max() + 1e-9):.1f} dBFS')
