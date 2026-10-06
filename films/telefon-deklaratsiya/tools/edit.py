#!/usr/bin/env python3
"""Montage of the phone declaration video: timeline, voice track, base video, final mix.

Footage and voices are the user's files. They stay outside the repository and are
found by name in --media. Intermediate and final files go to --work.

  python3 tools/edit.py cues                       # timeline -> cues.js (for overlay.html)
  python3 tools/edit.py audio --media DIR --work DIR
  python3 tools/edit.py video --media DIR --work DIR
  python3 tools/edit.py final --media DIR --work DIR   # needs overlay frames in WORK/overlay
"""
import json, os, subprocess, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.dirname(HERE)
opt = lambda k, d=None: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
MEDIA = opt('--media', os.environ.get('TEL_MEDIA', ''))
WORK = opt('--work', os.environ.get('TEL_WORK', os.path.join(FILM, 'out')))
FPS, W, H, SR = 30, 1080, 1920, 48000

# Files are matched by these name fragments in MEDIA.
CLIPS = {
    'WINDOW': 'Airplane_landing_from_passenger', 'LANDING': 'Aircraft_landing_at_airport',
    'AI01': 'Customs_officer_showing_smartpho', 'AI03': 'Officer_scanning_passenger_QR',
    'K01': 'K01-telefon-qolda', 'K03': 'K03-terminalga-kirish',
    'K04': 'K04-bagaj-lentasi.mp4', 'K04ALT': 'K04-alt-bagaj-lentasi-odamlar',
    'K05': 'K05-telefonga-qarash', 'K05ALT': 'K05-alt-telefon-lenta-yaqin',
    'K06': 'K06-chamadon-olish', 'K07': 'K07-bojxona-nazorati', 'K08': 'K08-bank-kassasi',
    'K09KOMP': 'K09-alt-inspektor-kompyuterda', 'K09KIOSK': 'K09-alt-inspektor-kioskda',
    'K09PULLIK': 'K09-alt-uzimei-pullik-xizmat', 'K10': 'K10-chiqish',
    # ybdweb screen recording (six parts), used after tools/edit.py clean has masked personal data
    **{f'E{i}': f'@clean/E{i}.mp4' for i in range(1, 7)},
}
RECS = {f'E{i}': f'IMG_5930_0{i}' for i in range(1, 7)}
# Personal data in the screen recording: (x, y, w, h, from, to, kind) in source pixels and seconds.
# Passport number, the face in Face ID, the IMEI digits, the registration number and the QR code.
FACE = (150, 540, 990, 1370)
IMEI_A, IMEI_B = (150, 354, 830, 141), (150, 789, 830, 141)
MASKS = {
    'E1': [(60, 1100, 1050, 175, 0, 7.85, 'blur'), (60, 995, 1050, 175, 7.75, 8.8, 'blur'), (60, 1100, 1050, 175, 8.7, 11.3, 'blur'),
           (0, 1785, 1290, 115, 0, 8.9, 'blur'), (*FACE, 13.7, 16.1, 'face')],
    'E2': [(*FACE, 0, 14.1, 'face')],
    'E3': [(*FACE, 0, 5.5, 'face'), (150, 684, 830, 144, 7.7, 19.1, 'blur'),
           (*IMEI_A, 18.8, 23.1, 'blur'), (*IMEI_B, 18.8, 23.1, 'blur')],
    'E4': [(*IMEI_A, 0, 6.1, 'blur'), (*IMEI_B, 0, 6.1, 'blur'),
           (150, 375, 830, 141, 5.8, 10.9, 'blur'), (150, 0, 830, 70, 5.8, 10.9, 'blur'),
           (150, 489, 830, 141, 10.6, 13.1, 'blur'), (150, 924, 830, 141, 10.6, 13.1, 'blur'),
           (330, 690, 380, 130, 12.9, 15.0, 'blur')],
    'E6': [(610, 425, 440, 90, 8.2, 99, 'blur'), (480, 970, 340, 125, 8.2, 99, 'blur'),
           (375, 1205, 540, 545, 8.2, 99, 'pix'), (85, 2080, 320, 615, 11.7, 99, 'blur')],
}
REC_SCALE = W / 1290   # screen recordings fill the width
TAKES = {'full': '07_32_33_Bekzod', 'redo': '10_32_51_Bekzod', 'off': 'Jahongir'}

# Voice items: id, take, in, out, gap before (s), tempo, phrase starts (take time).
# 'full' is the whole narrator text; 'redo' re-records steps 5a-5e; 'off' is the officer.
# The officer's IMEI tip (O1, O2) sits between step 5d and 5e, where IMEI is entered.
VO = [
    ('N1', 'full', 0.04, 7.30, 0.30, 1, [0.14, 2.88, 4.23, 5.43]),
    ('N2', 'full', 7.42, 13.75, 0.45, 1, [7.52, 8.72]),
    ('N3', 'full', 13.92, 20.80, 0.45, 1, [14.03, 15.96, 17.98, 19.30]),
    ('N4', 'full', 20.95, 27.95, 0.45, 1, [21.05, 21.95, 24.43, 25.77]),
    ('S1', 'redo', 0.00, 2.68, 0.50, 1, [0.10]),
    ('S2', 'redo', 2.92, 6.15, 0.35, 1, [3.02]),
    ('S3', 'redo', 6.36, 9.33, 0.35, 1, [6.46]),
    ('S4', 'redo', 9.49, 13.52, 0.35, 1, [9.59]),
    ('O1', 'off', 0.04, 6.62, 0.50, 1.08, [0.14, 2.80, 3.70, 4.44, 4.70, 5.12, 5.80]),
    ('O2', 'off', 6.86, 10.90, 0.35, 1, [6.96, 9.75]),
    ('S5', 'redo', 13.62, 18.13, 5.10, 1, [13.72, 14.61, 17.05]),
    ('N10', 'full', 46.28, 54.25, 0.55, 1, [46.38, 47.24, 48.10, 49.40, 50.55, 51.55, 52.28]),
    ('N11', 'full', 54.35, 59.40, 0.50, 1, [54.45, 56.10]),
    ('N12', 'full', 59.49, 65.42, 0.50, 1, [59.60, 60.42, 62.22, 63.95]),
    ('O3', 'off', 11.17, 18.37, None, 1.08, [11.27, 12.52, 14.46, 16.65]),
    ('O4', 'off', 18.57, 23.92, 0.45, 1, [18.67, 21.17]),
    ('O5', 'off', 24.10, 27.30, 0.30, 1, [24.20]),
    ('N13', 'full', 65.53, 73.08, 0.45, 1, [65.64, 67.54, 69.28, 70.72]),
    ('O6', 'off', 27.54, 33.15, 0.45, 1, [27.64, 29.05, 29.52, 31.31]),
    ('N14', 'full', 73.18, 85.55, 0.50, 1, [73.28, 74.32, 75.29, 76.97, 79.96, 81.79, 84.00]),
    ('N15', 'full', 85.59, 97.95, 2.40, 1, [85.69, 86.66, 89.12, 91.31, 92.88, 94.17, 96.00, 96.81]),
    ('N16', 'full', 98.07, 102.84, 0.60, 1, [98.17, 99.36, 101.85]),
]
AI03_RATE, AI03_LIPS = 1 / 1.12, 4.45   # AI03 plays slower; the officer starts talking at 4.45 s
AI03_LEAD = -1.6                       # the scan starts as the narrator says "QR-kod"
AI01_RATE, AI01_LIPS, AI01_IN = 1 / 1.1, 1.29, 0.8


def timeline():
    T, t = {}, 0.0
    for vid, take, a, b, gap, tempo, ph in VO:
        if gap is None:   # O3 follows the officer's lips in AI03
            clip0 = T['N12']['end'] + AI03_LEAD
            at = clip0 + AI03_LIPS / AI03_RATE - (ph[0] - a) / tempo
        else:
            at = t + gap
        end = at + (b - a) / tempo
        T[vid] = {'take': take, 'in': a, 'out': b, 'tempo': tempo, 'at': round(at, 3), 'end': round(end, 3),
                  'p': [round(at + (p - a) / tempo, 3) for p in ph]}
        t = end
    return T


def segments(T):
    v = lambda k: T[k]
    p = lambda k, i: T[k]['p'][i]
    ai03 = v('N12')['end'] + AI03_LEAD
    ai01 = v('O1')['p'][0] - (AI01_LIPS - AI01_IN) / AI01_RATE
    S = [  # id, clip, source in, timeline start, rate, effects
        ('hook', 'WINDOW', 0.0, 0.0, 1, {}),
        ('landing', 'LANDING', 1.2, v('N1')['end'] + 0.15, 1, {'gain': -6}),
        ('terminal', 'K03', 0.0, p('N2', 1) + 2.4, 1, {}),
        ('belt', 'K04', 0.0, v('N3')['at'] - 0.25, 1, {}),
        ('hall', 'K04ALT', 3.7, p('N3', 1) - 0.15, 1, {}),
        ('phone', 'K05', 0.0, p('N3', 3) - 0.2, 1, {}),
        ('site', 'K05', 3.2, v('N4')['at'] - 0.25, 0.6, {'dim': 0.25}),
        ('s1', 'E1', 0.0, v('S1')['at'] - 0.15, None, {'to': 9.3, 'oy': 100}),
        ('s2', 'E1', 11.0, v('S2')['at'] - 0.15, None, {'to': 16.0, 'oy': 100}),
        ('s2b', 'E3', 4.3, v('S2')['at'] + 1.85, None, {'to': 6.0, 'oy': 100}),
        ('s3', 'E3', 6.0, v('S3')['at'] - 0.15, None, {'to': 9.3, 'oy': 100}),
        ('s4', 'E3', 10.3, v('S4')['at'] - 0.15, None, {'to': 16.5, 'oy': 100}),
        ('s4b', 'E4', 2.5, v('S4')['at'] + 1.85, None, {'to': 10.2, 'oy': 100}),
        ('ai01', 'AI01', AI01_IN, ai01, AI01_RATE, {'mute': 1}),
        ('imei', 'AI01', 0, v('O2')['at'] - 0.15, 1, {'bg': 1, 'mute': 1, 'cont': 1}),
        ('m1', 'E4', 10.7, v('O2')['end'] + 0.3, None, {'to': 16.0, 'oy': 100}),
        ('m2', 'E5', 0.0, v('O2')['end'] + 1.9, None, {'to': 3.0, 'oy': 100}),
        ('m3', 'E6', 5.5, v('O2')['end'] + 3.5, None, {'to': 8.4, 'oy': 100}),
        ('qr', 'E6', 8.4, v('S5')['at'] - 0.15, 1, {'oy': 250}),
        ('value', None, 0, v('N10')['at'] - 0.2, 1, {}),
        ('except', None, 0, v('N11')['at'] - 0.2, 1, {}),
        ('suitcase', 'K06', 0.0, v('N12')['at'] - 0.2, 1, {}),
        ('control', 'K07', 1.5, p('N12', 1) + 1.3, 1, {}),
        ('ai03', 'AI03', 0.0, ai03, AI03_RATE, {'mute_after': AI03_LIPS - 0.15, 'gain': -4}),
        ('over', 'AI03', 9.9, v('O4')['at'] - 0.15, 1, {'bg': 1, 'mute': 1}),   # AI04/AI05 to come
        ('cashier', 'K08', 1.5, v('N13')['at'] - 0.2, 1, {}),
        ('pay', 'K08', 7.9, p('N13', 2) - 0.1, 1, {'bg': 1, 'mute': 1}),
        ('bko', 'K09KOMP', 0.3, v('O6')['at'] - 0.15, 1, {'blurtop': 1040}),     # AI06 to come
        ('uzimei', None, 0, v('N14')['at'] - 0.2, 1, {}),
        ('servis', 'K09PULLIK', 0.2, p('N14', 6) + 0.6, 1, {}),
        ('kiosk', 'K09KIOSK', 4.7, v('N14')['end'] + 0.9, 1, {}),
        ('exit', 'K10', 1.5, v('N15')['at'] - 0.25, 1, {}),
        ('recap', 'K10', 0, p('N15', 1) - 0.35, 0.33, {'bg': 1, 'mute': 1, 'cont': 1}),
    ]
    end = round(v('N16')['end'] + 1.9, 3)
    out = []
    for i, (sid, clip, src, start, rate, fx) in enumerate(S):
        stop = S[i + 1][3] if i + 1 < len(S) else end
        if fx.get('cont'):   # the same shot goes on behind a graphic
            q = out[-1]; src = q['src'] + (q['e'] - q['s']) * q['rate']
        if rate is None:     # play the source range [src, to] in the segment's time
            rate = (fx['to'] - src) / (stop - start)
        out.append({'id': sid, 'clip': clip, 'src': round(src, 3), 's': round(start, 3), 'e': round(stop, 3),
                    'rate': rate, 'fx': fx})
    return out, end


def events(T):
    """Named moments the overlay animates on and the sound effects hit."""
    p = lambda k, i: T[k]['p'][i]
    return {
        'hookTitle': p('N1', 0), 'stamp': p('N1', 2), 'how': p('N1', 3),
        'welcome': p('N2', 0), 'wait': p('N3', 0), 'here': p('N3', 1), 'url': p('N4', 1),
        'urlDone': p('N4', 2), 'noApp': p('N4', 3),
        'step1': p('S1', 0), 'step2': p('S2', 0), 'step3': p('S3', 0), 'step4': p('S4', 0),
        'tip': p('O1', 0), 'keys': [p('O1', i) for i in (1, 2, 3, 4, 5)], 'dual': p('O2', 0),
        'dualBoth': p('O2', 1), 'step5': p('S5', 0), 'qrShown': p('S5', 1), 'save': p('S5', 2),
        'value': p('N10', 0), 'norm': p('N10', 3), 'free': p('N10', 4), 'over': p('N10', 5),
        'overPart': p('N10', 6), 'except': p('N11', 0), 'exceptTick': p('N11', 1),
        'control': p('N12', 1), 'showQr': p('N12', 3), 'inNorm': p('O3', 2),
        'overNorm': p('O4', 0), 'ybt': p('O4', 1), 'bkoAfter': p('O5', 0),
        'cash': p('N13', 0), 'online': p('N13', 2), 'paid': p('N13', 3) + 1.2,
        'bko': p('O6', 2), 'bkoDone': p('O6', 3),
        'last': p('N14', 0), 'all': p('N14', 1), 'evenNorm': p('N14', 2), 'imeiUz': p('N14', 3),
        'way1': p('N14', 4), 'way2': p('N14', 5), 'way3': p('N14', 6),
        'recap': p('N15', 0), 'r1': p('N15', 1), 'r2': p('N15', 2), 'r3': p('N15', 3),
        'r4': p('N15', 4), 'r5a': p('N15', 5), 'r5': p('N15', 6), 'thatsAll': p('N15', 7),
        'endTitle': p('N16', 0), 'endSub': p('N16', 1), 'bye': p('N16', 2),
    }


def src2t(segs, sid, t):
    s = next(q for q in segs if q['id'] == sid)
    return round(s['s'] + (t - s['src']) / s['rate'], 3)


def highlights(T, segs):
    """Rings drawn over the screen recording: (from, to, box in output pixels, kind)."""
    def box(sid, x, y, w, h):
        oy = next(q for q in segs if q['id'] == sid)['fx']['oy']
        return [round(x * REC_SCALE), round(y * REC_SCALE - oy), round(w * REC_SCALE), round(h * REC_SCALE)]
    p = lambda k, i: T[k]['p'][i]
    return [
        {'a': src2t(segs, 's3', 6.35), 'b': src2t(segs, 's3', 7.85), 'box': box('s3', 39, 981, 381, 303), 'tap': src2t(segs, 's3', 7.65)},
        {'a': p('S5', 1), 'b': p('S5', 2) - 0.2, 'box': box('qr', 375, 1205, 540, 545)},
        {'a': p('S5', 2), 'b': T['S5']['end'] + 0.3, 'box': box('qr', 135, 1855, 500, 140), 'tap': src2t(segs, 'qr', 11.75)},
    ]


def qr_matrix(text):
    import qrcode
    q = qrcode.QRCode(border=0, error_correction=qrcode.constants.ERROR_CORRECT_M)
    q.add_data(text); q.make(fit=True)
    return [''.join('1' if c else '0' for c in row) for row in q.get_matrix()]


def write_cues():
    T = timeline(); segs, end = segments(T)
    cues = {'fps': FPS, 'w': W, 'h': H, 'end': end, 'vo': T,
            'seg': {s['id']: [s['s'], s['e']] for s in segs}, 'ev': {**events(T), 'loc': src2t(segs, 'm2', 0.5), 'check': src2t(segs, 'm3', 5.6), 'checkDone': src2t(segs, 'm3', 8.0)},
            'hl': highlights(T, segs),
            'qrSite': qr_matrix('https://ybdweb.customs.uz')}
    with open(os.path.join(FILM, 'cues.js'), 'w') as f:
        f.write('// Generated by tools/edit.py cues. Timeline of the video in seconds.\n')
        f.write('window.CUES = ' + json.dumps(cues, separators=(',', ':')) + ';\n')
    print(f'cues.js: {end:.2f} s, {len(segs)} segments')
    for s in segs: print(f"  {s['id']:9s} {s['s']:7.2f}-{s['e']:7.2f}  {s['clip'] or '-':9s} src {s['src']}")


# ---------------------------------------------------------------- media helpers
def find(frag, ext=None):
    if frag.startswith('@'): return os.path.join(WORK, frag[1:])
    hits = sorted(f for f in os.listdir(MEDIA) if frag in f and (ext is None or f.endswith(ext)))
    if not hits: raise SystemExit(f'Not found in {MEDIA}: {frag}')
    return os.path.join(MEDIA, hits[0])


def ff(*args):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *args], check=True)


def decode(path, ss=None, t=None, af=None):
    cmd = ['ffmpeg', '-v', 'error']
    if ss is not None: cmd += ['-ss', f'{ss:.3f}']
    if t is not None: cmd += ['-t', f'{t:.3f}']
    cmd += ['-i', path, '-vn'] + (['-af', af] if af else []) + ['-f', 'f32le', '-ac', '1', '-ar', str(SR), '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).copy()


def write_wav(path, x):
    x = np.clip(x, -1, 1)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-i', '-',
                    '-c:a', 'pcm_s16le', path], input=x.astype(np.float32).tobytes(), check=True)


def place(bus, x, at, gain_db=0.0):
    i = int(round(at * SR)); x = x * 10 ** (gain_db / 20)
    if i < 0: x, i = x[-i:], 0
    n = min(len(x), len(bus) - i)
    if n > 0: bus[i:i + n] += x[:n]


def fade(x, a=0.01, b=0.03):
    x = x.copy(); na, nb = int(a * SR), int(b * SR)
    if na: x[:na] *= np.linspace(0, 1, na)
    if nb: x[-nb:] *= np.linspace(1, 0, nb)
    return x


# ---------------------------------------------------------------- sound effects (tonal, no noise)
def sfx(kind):
    def env(n, d): t = np.arange(n) / SR; return np.exp(-t / d)
    t = lambda d: np.arange(int(d * SR)) / SR
    if kind == 'stamp':
        tt = t(0.45); f = 95 * np.exp(-tt * 5) + 42
        body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.11)
        click = np.sin(2 * np.pi * 1800 * tt) * env(len(tt), 0.004) * 0.35
        return (body + click) * 0.9
    if kind == 'tick':
        tt = t(0.06); return np.sin(2 * np.pi * 2300 * tt) * env(len(tt), 0.008) * 0.35
    if kind == 'pop':
        tt = t(0.12); f = 520 + 520 * np.minimum(tt / 0.05, 1)
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.03) * 0.35
    if kind == 'ding':
        tt = t(1.0)
        return (np.sin(2 * np.pi * 1318.5 * tt) + 0.35 * np.sin(2 * np.pi * 2637 * tt)) * env(len(tt), 0.22) * 0.22
    if kind == 'key':   # keypad tone
        tt = t(0.11); return (np.sin(2 * np.pi * 941 * tt) + np.sin(2 * np.pi * 1209 * tt)) * env(len(tt), 0.05) * 0.16
    if kind == 'thud':
        tt = t(0.3); f = 70 * np.exp(-tt * 4) + 50
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.08) * 0.6
    raise ValueError(kind)


def sfx_list(T):
    e = events(T)
    L = [('stamp', e['stamp']), ('pop', e['hookTitle']), ('tick', e['url']), ('pop', e['noApp'])]
    L += [('tick', e[f'step{i}']) for i in range(1, 6)]
    L += [('key', k) for k in e['keys']] + [('pop', e['dual']), ('ding', e['qrShown'])]
    L += [('thud', e['norm']), ('ding', e['free']), ('thud', e['overPart']), ('pop', e['exceptTick'])]
    L += [('ding', e['inNorm']), ('pop', e['cash']), ('pop', e['online']), ('ding', e['paid']), ('ding', e['bkoDone'])]
    L += [('thud', e['imeiUz']), ('pop', e['way1']), ('pop', e['way2']), ('pop', e['way3'])]
    L += [('tick', e[k]) for k in ('r1', 'r2', 'r3', 'r4', 'r5')] + [('ding', e['thatsAll'])]
    return L


# ---------------------------------------------------------------- audio
def build_audio():
    T = timeline(); segs, end = segments(T)
    n = int((end + 0.5) * SR)
    vo, amb, fx = np.zeros(n, np.float32), np.zeros(n, np.float32), np.zeros(n, np.float32)
    takes = {k: decode(find(v, '.mp3')) for k, v in TAKES.items()}
    for vid, it in T.items():
        x = takes[it['take']][int(it['in'] * SR):int(it['out'] * SR)]
        if it['tempo'] != 1:
            tmp = os.path.join(WORK, f'_{vid}.wav'); write_wav(tmp, x)
            x = decode(tmp, af=f"rubberband=tempo={it['tempo']}:pitchq=quality")
        place(vo, fade(x, 0.01, 0.06), it['at'])
    # Ambience: the clips' own sound, low under the voice.
    for s in segs:
        if not s['clip'] or s['fx'].get('mute') or s['clip'].startswith('E'): continue
        dur = s['e'] - s['s']; r = s['rate']
        x = decode(find(CLIPS[s['clip']]), ss=s['src'], t=dur * r + 0.05,
                   af=None if abs(r - 1) < 1e-6 else f'atempo={r:.5f}')
        if 'mute_after' in s['fx']:
            k = int(max(0, (s['fx']['mute_after'] - s['src']) / r) * SR)
            x[k:] = 0; x[max(0, k - 2400):k] *= np.linspace(1, 0, min(k, 2400))
        place(amb, fade(x[:int(dur * SR)], 0.15, 0.15), s['s'], s['fx'].get('gain', 0))
    for kind, at in sfx_list(T):
        place(fx, sfx(kind), at)
    # Duck the ambience under speech (attack 80 ms, release 400 ms).
    env = np.abs(vo); k = int(0.02 * SR)
    lvl = np.sqrt(np.convolve(env ** 2, np.ones(k) / k, 'same'))
    speech = (lvl > 10 ** (-45 / 20)).astype(np.float32)
    duck = np.empty_like(speech); g = 0.0; a, rl = 1 / (0.08 * SR), 1 / (0.4 * SR)
    for i in range(0, n, 240):   # 5 ms blocks
        target = speech[i:i + 240].max()
        g = min(target, g + a * 240) if target > g else max(target, g - rl * 240)
        duck[i:i + 240] = g
    amb *= 10 ** ((-14 + -8 * duck) / 20)
    mix = vo * 10 ** (0 / 20) + amb + fx * 10 ** (-6 / 20)
    os.makedirs(WORK, exist_ok=True)
    write_wav(os.path.join(WORK, 'voice-mix.wav'), mix * 0.89 / max(1e-6, np.abs(mix).max()))
    write_wav(os.path.join(WORK, 'voice-only.wav'), vo)
    print(f'audio: {len(mix) / SR:.2f} s -> {WORK}/voice-mix.wav')


# ---------------------------------------------------------------- video
def seg_filter(s, dur):
    fx, r = s['fx'], s['rate']
    f = [f'setpts=(PTS-STARTPTS)/{r:.6f}', f'fps={FPS}']
    if 'oy' in fx:   # screen recording: fill the width, choose the visible band
        f += [f'scale={W}:-2:flags=lanczos', f"crop={W}:{H}:0:{fx['oy']}", 'setsar=1']
    else:
        f += [f'scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos', f'crop={W}:{H}', 'setsar=1']
    if fx.get('bg'):
        f += ['scale=270:480', 'boxblur=8:3', f'scale={W}:{H}', 'eq=brightness=-0.10:saturation=0.75']
    if fx.get('dim'):
        f += [f"eq=brightness={-fx['dim'] / 2}:saturation=0.9"]
    f += [f'tpad=stop_mode=clone:stop_duration={dur + 1:.3f}', f'trim=duration={dur:.4f}']
    chain = ','.join(f)
    if 'blurbox' in fx:
        x, y, w, h = fx['blurbox']
        chain += f',split[a][b];[b]crop={w}:{h}:{x}:{y},boxblur=22:3[bb];[a][bb]overlay={x}:{y}'
    if 'blurtop' in fx:
        y = fx['blurtop']
        chain += (f',split[a][b];[b]crop={W}:{y}:0:0,scale=270:{y // 4},boxblur=6:2,scale={W}:{y},format=rgba,'
                  f"geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='255*clip(({y}-Y)/160,0,1)'[bb];[a][bb]overlay=0:0")
    return chain


def build_video():
    T = timeline(); segs, end = segments(T)
    d = os.path.join(WORK, 'segs'); os.makedirs(d, exist_ok=True)
    lst = []
    for i, s in enumerate(segs):
        dur = s['e'] - s['s']; out = os.path.join(d, f'{i:02d}-{s["id"]}.mp4')
        enc = ['-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', str(FPS)]
        if s['clip'] is None:
            ff('-f', 'lavfi', '-i', f'color=c=0x06281e:s={W}x{H}:r={FPS}:d={dur:.4f}', *enc, out)
        else:
            src = find(CLIPS[s['clip']])
            ff('-ss', f"{s['src']:.3f}", '-i', src, '-filter_complex', seg_filter(s, dur), *enc, out)
        lst.append(f"file '{out}'")
        print(f'  {i:02d} {s["id"]:9s} {dur:5.2f} s')
    with open(os.path.join(d, 'list.txt'), 'w') as f: f.write('\n'.join(lst) + '\n')
    ff('-f', 'concat', '-safe', '0', '-i', os.path.join(d, 'list.txt'), '-c', 'copy', os.path.join(WORK, 'base.mp4'))
    print(f'video: {WORK}/base.mp4 ({end:.2f} s)')


def mask_filter(masks):
    chain, last = [], '0:v'
    for i, (x, y, w, h, t0, t1, kind) in enumerate(masks):
        # text: ~1 px per letter before scaling back; QR: fewer cells than modules; face: a soft blob
        down = {'blur': 28, 'pix': 45, 'face': 90}[kind]
        up = 'neighbor' if kind == 'pix' else 'bicubic'
        soft = ',boxblur=6:2' if kind != 'pix' else ''
        chain.append(f'[{last}]split[a{i}][b{i}];[b{i}]crop={w}:{h}:{x}:{y},scale={max(4, w // down)}:{max(4, h // down)}:flags=area,'
                     f"scale={w}:{h}:flags={up}{soft}[m{i}];[a{i}][m{i}]overlay={x}:{y}:enable='between(t,{t0},{t1})'[v{i}]")
        last = f'v{i}'
    return ';'.join(chain), f'[{last}]'


def build_clean():
    """Masks personal data in the screen recording before it enters the edit."""
    d = os.path.join(WORK, 'clean'); os.makedirs(d, exist_ok=True)
    only = opt('--only', '').split(',') if opt('--only') else list(RECS)
    for k, frag in RECS.items():
        if k not in only: continue
        out = os.path.join(d, f'{k}.mp4'); masks = MASKS.get(k, [])
        if masks:
            fc, last = mask_filter(masks)
            ff('-i', find(frag), '-filter_complex', fc + f';{last}format=yuv420p[o]', '-map', '[o]', '-an',
               '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', out)
        else:
            ff('-i', find(frag), '-vf', 'format=yuv420p', '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', out)
        print(f'  {k}: {len(masks)} masks')


def build_final():
    T = timeline(); _, end = segments(T)
    ov = os.path.join(WORK, 'overlay', '%05d.png'); out = os.path.join(WORK, opt('--out', 'telefon-deklaratsiya.mp4'))
    mix = os.path.join(WORK, opt('--audio', 'voice-mix.wav'))
    # Two-pass loudness to -14 LUFS, true peak -1 dB.
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', mix, '-af', 'loudnorm=I=-14:TP=-1:LRA=11:print_format=json',
                        '-f', 'null', '-'], capture_output=True, text=True).stderr
    m = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
    ln = (f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
          f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    ff('-i', os.path.join(WORK, 'base.mp4'), '-framerate', str(FPS), '-i', ov, '-i', mix,
       '-filter_complex', f'[0:v][1:v]overlay=format=auto,fade=t=out:st={end - 1.0:.3f}:d=1.0,format=yuv420p[v];'
                          f'[2:a]{ln},aresample=48000,alimiter=limit=0.84:attack=2:release=60:level=false,'
                          f'afade=t=out:st={end - 1.2:.3f}:d=1.2,aformat=channel_layouts=stereo[a]',
       '-map', '[v]', '-map', '[a]', '-t', f'{end:.3f}', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18',
       '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out)
    print(f'final: {out}')


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'cues'
    {'cues': write_cues, 'clean': build_clean, 'audio': build_audio, 'video': build_video, 'final': build_final}[cmd]()
