#!/usr/bin/env python3
"""Fits a 120 BPM track to the 44.5 s promo by rearranging whole bars.

python3 tools/fit-music.py <track.mp3> <out.wav> [--offset 0.178]
python3 tools/fit-music.py <track.mp3> <out.wav> --bpm 121.6 --edl "0.35,35.6,0;35.6,40.96,35.19;40.96,44.5,42.52"

The track's bars start at OFFSET + 2k seconds (found by beat tracking: 120 BPM,
downbeats at 0.178 s in the Suno track "Cold-Open Hit"). The edit list maps
video time to track time in bar-aligned pieces so that the track's sections
land on the film's beats: the sparse hook under the quiz (played twice so the
film opens on a hit), the beat entering with the logo at 8 s, the breakdown
under "Hammasi — bitta ilovada" from 34 s, the chorus on the parcel at 38 s
and the track's last two hits on the logo (41 s) and the address (43 s). Joins are short
equal-power crossfades that end on the downbeat, so the new bar's hit stays
sharp.

--bpm first stretches a track made at another tempo to 120 BPM (ffmpeg's
rubberband, pitch kept); --edl then gives the pieces as "video start, video
end, track start" in the stretched track's time (no --offset). The Suno cover
of the preview score ("pochtam-promo-score", 121.6 BPM) keeps the film's form:
its beat comes in at 7.66 s and returns after the break at 37.59 s, its big
last hit is at 42.56 s (stretched times). It goes in 0.35 s late so the beat
lands on the logo at 8 s, slips 60 ms inside the quiet break so the return
lands on the parcel at 38 s, and jumps to the last hit for the end card at
41 s.
"""
import subprocess, sys, wave
import numpy as np

src, dst = sys.argv[1], sys.argv[2]
opt = lambda k, d=None: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
SR, END, XF = 48000, 44.5, 0.03
BPM = float(opt('--bpm', 120))
if opt('--edl'):
    OFF = 0.0; EDL = [tuple(float(v) for v in p.split(',')) for p in opt('--edl').split(';')]
else:
    OFF = float(opt('--offset', 0.178))
    # (video start, video end, track start) in seconds; track time T = raw - OFF
    EDL = [(0, 4, 2), (4, 8, 2), (8, 24, 6), (24, 34, 26), (34, 38, 22), (38, 41, 26), (41, END, 42)]

af = ['-af', f'rubberband=tempo={120/BPM:.6f}'] if BPM != 120 else []
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-map', '0:a', *af, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2)
x = np.vstack([x, np.zeros((2*SR, 2), np.float32)])                       # the last piece may run past the track's end: silence
out = np.zeros((int(round(END*SR)), 2), np.float32); n = int(XF*SR)
fade_in, fade_out = np.sin(np.linspace(0, np.pi/2, n))[:, None], np.cos(np.linspace(0, np.pi/2, n))[:, None]
for k, (v0, v1, t0) in enumerate(EDL):
    a, b = int(round(v0*SR)), int(round(v1*SR)); s = int(round((t0 + OFF)*SR))
    if k == 0:
        out[a:b] += x[s:s + (b - a)]
        if a > 0: out[a:a + n] *= fade_in                                     # a late start eases in
        continue
    # the new piece starts XF before its downbeat, fading in while the old piece fades out
    out[a - n:a] *= fade_out
    seg = x[s - n:s + (b - a)].copy(); seg[:n] *= fade_in
    out[a - n:b] += seg[:b - a + n]
f = int(.25*SR); out[-f:] *= np.cos(np.linspace(0, np.pi/2, f))[:, None]   # the last quarter second rings out
w = wave.open(dst, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(out, -1, 1)*32767).astype('<i2').tobytes()); w.close()
print(f'{dst}: {len(out)/SR:.2f} s, peak {20*np.log10(np.abs(out).max() + 1e-9):.1f} dBFS')
