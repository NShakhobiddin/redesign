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
    'AI04': 'Customs_officer_explaining_phone', 'AI05': 'Officer_speaking_at_counter', 'AI06': 'Officer_holding_receipt',
    'K01': 'K01-telefon-qolda', 'K03': 'K03-terminalga-kirish',
    'K04': 'K04-bagaj-lentasi.mp4', 'K04ALT': 'K04-alt-bagaj-lentasi-odamlar',
    'K05': 'K05-telefonga-qarash', 'K05ALT': 'K05-alt-telefon-lenta-yaqin',
    'K06': 'K06-chamadon-olish', 'K07': 'K07-bojxona-nazorati', 'K08': 'K08-bank-kassasi',
    'K09KOMP': 'K09-alt-inspektor-kompyuterda', 'K09KIOSK': 'K09-alt-inspektor-kioskda',
    'K09PULLIK': 'K09-alt-uzimei-pullik-xizmat', 'K10': 'K10-chiqish',
    'K09PESH': 'K09-alt-uzimei-peshtaxtalar', 'K09B': 'K09b-imei-royxatga-olish', 'K07ALTQ': 'K07-alt-qizil-yolak',
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
TAKES = {'full': '07_32_33_Bekzod', 'redo': '10_32_51_Bekzod', 'off': 'Jahongir',
         'new': os.environ.get('TEL_NEW_TAKE', 'NEW_LINES_Bekzod')}
# The lines added in v4, in the order they are recorded (VOICEOVER.md, "Qo'shimcha gaplar").
# Until the take exists, each line keeps an estimated length and the video is cut to it.
NEW = [
    "Yo'lingiz shunday: bagaj zali — bojxona nazorati — kelish zali. To'lovlar kassasi va Bojxona servis kelish zalida, chiqishdan oldin.",
    "Lekin bojsiz me'yorning sharti bor: xorijda kamida uch kun bo'lgan bo'lishingiz kerak.",
    "Safar uch kundan qisqa bo'lsa yoki bir oyda ikki martadan ko'p kelsangiz — me'yor qo'llanmaydi. To'lov telefonning to'liq qiymatiga hisoblanadi.",
    "To'lovlar kassasi — nazoratdan o'tgach, kelish zalida.",
    "Bojxona servis ham kelish zalida — uz imey belgisini qidiring.",
]


def syllables(word):
    return max(1, sum(1 for ch in word.lower().replace("o'", 'o').replace("g'", 'g') if ch in 'aeiou'))


def word_times(text, dur):
    """Estimated start of every word of a line spoken in dur seconds (syllables plus punctuation pauses)."""
    words = text.split(); w = []
    for x in words:
        w.append(syllables(x) / 5.6 + (0.38 if x[-1] in '.!?' else 0.22 if x[-1] in ',:' else 0) + (0.2 if x in ('—',) else 0))
    total = sum(w); out, acc = [], 0.0
    for x in w: out.append(acc / total * dur); acc += x
    return words, out


def new_lines():
    """(in, out) of the five new lines in the take, or None while the take is missing."""
    hits = [f for f in os.listdir(MEDIA) if TAKES['new'] in f] if MEDIA else []
    if not hits: return None
    x = decode(os.path.join(MEDIA, sorted(hits)[0])); h = 480
    e = 20 * np.log10(np.sqrt((x[:len(x) // h * h].reshape(-1, h) ** 2).mean(1)) + 1e-9) > -45
    on = np.flatnonzero(e); start, end = on[0], on[-1] + 1
    gaps = [(b - a, a, b) for a, b in zip(on, on[1:]) if b - a > 1]
    cuts = sorted(sorted(gaps, reverse=True)[:len(NEW) - 1], key=lambda g: g[1])
    bounds = [start] + [g for c in cuts for g in (c[1] + 1, c[2])] + [end]
    return [(max(0, bounds[2 * i] * h / SR - 0.05), bounds[2 * i + 1] * h / SR + 0.08) for i in range(len(NEW))]
EST = [8.7, 5.2, 8.5, 3.2, 3.7]   # estimated seconds while the take is missing

# Voice items: id, take, in, out, gap before (s), tempo, phrase starts (take time).
# 'full' is the whole narrator text; 'redo' re-records steps 5a-5e; 'off' is the officer.
# The officer's IMEI tip (O1, O2) sits between step 5d and 5e, where IMEI is entered.
VO = [
    ('N1', 'full', 0.04, 7.30, 0.25, 1, [0.14, 2.88, 4.23, 5.43]),
    ('N2', 'full', 7.42, 13.75, 0.90, 1, [7.52, 8.72]),
    ('R1', 'new', 0, 0, 0.40, 1, None),
    ('N3', 'full', 13.92, 20.80, 0.35, 1, [14.03, 15.96, 17.98, 19.30]),
    ('N4', 'full', 20.95, 27.95, 0.35, 1, [21.05, 21.95, 24.43, 25.77]),
    ('S1', 'redo', 0.00, 2.68, 0.40, 1, [0.10]),
    ('S2', 'redo', 2.92, 6.15, 0.30, 1, [3.02]),
    ('S3', 'redo', 6.36, 9.33, 0.30, 1, [6.46]),
    ('S4', 'redo', 9.49, 13.52, 0.30, 1, [9.59]),
    ('O1', 'off', 0.10, 6.58, 0.55, 1, [0.14, 2.80, 3.70, 4.44, 4.70, 5.12, 5.80]),
    ('O2', 'off', 6.86, 10.90, 0.30, 1, [6.96, 9.75]),
    ('S5', 'redo', 13.62, 18.13, 3.05, 1, [13.72, 14.61, 17.05]),
    ('N10', 'full', 46.28, 54.25, 0.45, 1, [46.38, 47.24, 48.10, 49.40, 50.55, 51.55, 52.28]),
    ('R2', 'new', 1, 0, 0.40, 1, None),
    ('R3', 'new', 2, 0, 0.35, 1, None),
    ('N11', 'full', 54.35, 59.40, 0.45, 1, [54.45, 56.10]),
    ('N12', 'full', 59.49, 65.42, 0.45, 1, [59.60, 60.42, 62.22, 63.95]),
    ('O3a', 'off', 11.20, 14.00, None, 1, [11.27, 12.52]),
    ('O3b', 'off', 14.40, 18.30, 0.35, 1, [14.46, 16.65]),
    ('O4', 'off', 18.57, 23.92, 0.60, 1, [18.67, 21.17]),
    ('O5', 'off', 24.10, 27.30, 0.55, 1, [24.20]),
    ('N13', 'full', 65.53, 73.08, 0.40, 1, [65.64, 67.54, 69.28, 70.72]),
    ('R4', 'new', 3, 0, 0.40, 1, None),
    ('O6', 'off', 27.54, 33.15, 1.20, 1, [27.64, 29.05, 29.52, 31.31]),
    ('N14', 'full', 73.18, 85.55, 0.45, 1, [73.28, 74.32, 75.29, 76.97, 79.96, 81.79, 84.00]),
    ('R5', 'new', 4, 0, 0.40, 1, None),
    ('N15', 'full', 85.59, 97.95, 1.20, 1, [85.69, 86.66, 89.12, 91.31, 92.88, 94.17, 96.00, 96.81]),
    ('N16', 'full', 98.07, 102.84, 0.50, 1, [98.17, 99.36, 101.85]),
]
# Lip sync: each officer sentence starts where the Veo officer starts a phrase.
# item: (clip, clip source at its first frame, [(take in, take out, lips from, lips to)], clip rate).
# Sentences stay whole and keep their natural rhythm: 'lips to' None keeps the natural tempo,
# 'lips from' None follows the previous sentence after its natural pause. Where the lips and the
# sentence cannot meet, the picture cuts away (AI01 -> the *#06# graphic, AI06 -> K09-kompyuterda).
SYNC = {
    'O1': ('AI01', 0.8, [(0.10, 6.58, 1.29, None)]),
    'O3a': ('AI03', 1.4, [(11.20, 14.00, 4.83, None)]),
    'O4': ('AI04', 1.1, [(18.62, 20.80, 1.65, 3.92), (21.12, 23.70, 4.55, 7.06)]),
    'O5': ('AI05', 0.2, [(24.14, 27.12, 0.71, 3.46)]),
    'O6': ('AI06', 0.3, [(27.58, 28.78, 2.15, None), (29.00, 30.95, 3.73, None), (31.25, 32.98, None, None)]),
}
TEMPO = (0.94, 1.08)   # a sentence may be squeezed or stretched only this much


def timeline():
    T, t = {}, 0.0
    lines = new_lines()
    for vid, take, a, b, gap, tempo, ph in VO:
        if take == 'new':   # a, the line number; the words are timed by their syllables
            i = a; at = t + gap
            if lines: a, b = lines[i]
            else: a, b = 0.0, EST[i]
            words, wt = word_times(NEW[i], b - a - 0.13)
            T[vid] = {'take': take, 'in': a, 'out': b, 'tempo': 1, 'at': round(at, 3), 'end': round(at + b - a, 3),
                      'p': [round(at + 0.05 + x, 3) for x in wt], 'words': words, 'missing': lines is None}
            t = at + b - a; continue
        if vid in SYNC:
            clip, src0, chunks, rate = (*SYNC[vid], 1)[:4]
            if gap is None:   # AI03 starts as the narrator says "QR-kod"; O3a follows its lips
                start = T['N12']['p'][3] - 0.3
            else:             # the first phrase starts after the gap
                start = t + gap - (chunks[0][2] - src0) / rate
            placed, prev, last = [], -1e9, None
            for j0, j1, v0, v1 in chunks:
                tt = prev + (j0 - last) if v0 is None else max(start + (v0 - src0) / rate, prev + 0.03)
                k = 1.0 if v1 is None else min(max((j1 - j0) / ((v1 - v0) / rate), TEMPO[0]), TEMPO[1])
                placed.append((j0, j1, round(tt, 3), round(k, 4))); prev = tt + (j1 - j0) / k; last = j1
            def at_take(x, placed=placed):
                for j0, j1, tt, k in placed:
                    if x <= j1: return tt + (max(x, j0) - j0) / k
                j0, j1, tt, k = placed[-1]; return tt + (j1 - j0) / k
            T[vid] = {'take': take, 'in': a, 'out': b, 'tempo': 1, 'at': placed[0][2], 'end': round(prev, 3),
                      'clip': round(start, 3), 'chunks': placed, 'p': [round(at_take(x), 3) for x in ph]}
            t = prev; continue
        at = t + gap
        end = at + (b - a) / tempo
        T[vid] = {'take': take, 'in': a, 'out': b, 'tempo': tempo, 'at': round(at, 3), 'end': round(end, 3),
                  'p': [round(at + (p - a) / tempo, 3) for p in ph]}
        t = end
    return T


_LEN = {}
def clip_length(clip):
    if clip not in _LEN:
        path = find(CLIPS[clip])
        if not os.path.exists(path): return 1e9
        r = subprocess.run(['ffmpeg', '-hide_banner', '-i', path], capture_output=True, text=True).stderr
        h, m, sec = r.split('Duration: ')[1].split(',')[0].split(':'); _LEN[clip] = int(h) * 3600 + int(m) * 60 + float(sec)
    return _LEN[clip]


def wt(T, vid, prefix, n=1):
    """Time of the n-th word of a new line that starts with prefix."""
    k = 0
    for w, t in zip(T[vid]['words'], T[vid]['p']):
        if w.lower().startswith(prefix.lower()):
            k += 1
            if k == n: return t
    raise KeyError(prefix)


def segments(T):
    v = lambda k: T[k]
    p = lambda k, i: T[k]['p'][i]
    tz = p('N1', 3) - 0.05   # teaser: four flashes of what is coming
    S = [  # id, clip, source in, timeline start, rate, effects
        ('hook', 'WINDOW', 0.5, 0.0, 1, {'sound': -6}),
        ('hook2', 'K05', 3.4, p('N1', 1) - 0.1, 1, {}),
        ('tz1', 'E3', 6.6, tz, 1, {'oy': 100}),
        ('tz2', 'AI03', 9.0, tz + 0.45, 1, {'mute': 1}),
        ('tz3', 'E6', 9.3, tz + 0.9, 1, {'oy': 250}),
        ('tz4', 'K10', 6.2, tz + 1.35, 1, {'mute': 1}),
        ('landing', 'LANDING', 3.3 - (p('N2', 0) - v('N1')['end'] - 0.05), v('N1')['end'] + 0.05, 1, {'sound': 0}),
        ('terminal', 'K03', 0.0, p('N2', 1) + 1.6, 1, {}),
        ('route', 'K03', 0, v('R1')['at'] - 0.2, 0.5, {'bg': 1, 'mute': 1, 'cont': 1}),
        ('belt', 'K04', 0.0, v('N3')['at'] - 0.2, 1, {}),
        ('hall', 'K04ALT', 3.7, p('N3', 1) - 0.1, 1, {}),
        ('phone', 'K05', 0.0, p('N3', 3) - 0.1, 1, {}),
        ('site', 'K05', 0, v('N4')['at'] - 0.15, 0.8, {'dim': 0.25, 'cont': 1}),
        ('siteb', 'K01', 0.1, p('N4', 2) - 0.05, 0.7, {'dim': 0.25}),
        ('site2', 'E1', 0.0, p('N4', 3) - 0.1, 0.4, {'oy': 100}),
        ('s1', 'E1', 0, v('S1')['at'] - 0.12, None, {'to': 9.3, 'oy': 100, 'cont': 1}),
        ('s2', 'E1', 11.0, v('S2')['at'] - 0.12, None, {'to': 16.0, 'oy': 100}),
        ('s2b', 'E3', 4.3, v('S2')['at'] + 1.85, None, {'to': 6.0, 'oy': 100}),
        ('s3', 'E3', 6.0, v('S3')['at'] - 0.12, None, {'to': 9.3, 'oy': 100}),
        ('s4', 'E3', 10.3, v('S4')['at'] - 0.12, None, {'to': 16.5, 'oy': 100}),
        ('s4b', 'E4', 2.5, v('S4')['at'] + 1.85, None, {'to': 10.2, 'oy': 100}),
        ('ai01', 'AI01', SYNC['O1'][1], v('O1')['clip'], 1, {'mute': 1}),
        ('imei', 'AI01', 0, p('O1', 1) - 0.25, 1, {'bg': 1, 'mute': 1, 'cont': 1}),
        ('m1', 'E4', 10.7, v('O2')['end'] + 0.2, None, {'to': 16.0, 'oy': 100}),
        ('m2', 'E5', 0.0, v('O2')['end'] + 1.1, None, {'to': 3.0, 'oy': 100}),
        ('m3', 'E6', 5.5, v('O2')['end'] + 2.0, None, {'to': 8.4, 'oy': 100}),
        ('qr', 'E6', 8.4, v('S5')['at'] - 0.12, 1, {'oy': 250}),
        ('value', 'K04ALT', 0.0, v('N10')['at'] - 0.2, 0.6, {'bg': 1, 'mute': 1}),
        ('days', 'K04ALT', 0, v('R2')['at'] - 0.2, 0.5, {'bg': 1, 'mute': 1, 'cont': 1}),
        ('month', 'K04ALT', 0, v('R3')['at'] - 0.15, 0.5, {'bg': 1, 'mute': 1, 'cont': 1}),
        ('except', 'K04', 0.0, v('N11')['at'] - 0.2, 0.6, {'bg': 1, 'mute': 1}),
        ('suitcase', 'K06', 0.0, v('N12')['at'] - 0.2, 1, {'sound': -2}),
        ('control', 'K07', 1.5, p('N12', 1) + 0.9, 1, {}),
        ('ai03', 'AI03', SYNC['O3a'][1], v('O3a')['clip'], 1, {'mute_after': 4.3, 'sound': 2}),
        ('pass', 'K07', 4.5, v('O3a')['end'] + 0.2, 0.9, {}),
        ('ai04', 'AI04', SYNC['O4'][1], v('O4')['clip'], 1, {'mute': 1}),
        ('ai05', 'AI05', SYNC['O5'][1], v('O5')['clip'], 1, {'mute': 1}),
        ('cashier', 'K08', 2.5, v('N13')['at'] - 0.2, 1, {}),
        ('pay', 'K08', 0, p('N13', 2) - 0.1, 1, {'bg': 1, 'mute': 1, 'cont': 1}),
        ('kassapin', 'K08', 0, v('R4')['at'] - 0.2, 0.5, {'bg': 1, 'mute': 1, 'cont': 1}),
        ('ai06', 'AI06', SYNC['O6'][1], v('O6')['clip'], 1, {'mute_after': 2.0, 'sound': 2}),
        ('bko', 'K09KOMP', 0.6, v('O6')['chunks'][2][2] - 0.12, 1, {'blurtop': 1040, 'mute': 1}),
        ('uz1', 'K09PESH', 0.0, v('N14')['at'] - 0.2, 0.6, {'bg': 1, 'mute': 1}),
        ('uzk', 'K09B', 3.0, p('N14', 3) - 0.1, 1, {}),
        ('uz2', 'K09PESH', 2.4, p('N14', 4) - 0.1, 0.6, {'bg': 1, 'mute': 1}),
        ('servis', 'K09PULLIK', 0.2, p('N14', 6) - 0.05, 1, {}),
        ('servispin', 'K09PULLIK', 0, v('R5')['at'] - 0.2, 0.5, {'bg': 1, 'mute': 1, 'cont': 1}),
        ('sign', 'K09PULLIK', 2.3, wt(T, 'R5', 'uz') - 0.1, 0.8, {}),
        ('exit', 'K10', 1.5, v('N15')['at'] - 0.25, 1, {}),
        ('recap', 'K10', 0, p('N15', 1) - 0.35, 0.33, {'bg': 1, 'mute': 1, 'cont': 1}),
    ]
    end = round(v('N16')['end'] + 1.9, 3)
    out = []
    for i, (sid, clip, src, start, rate, fx) in enumerate(S):
        stop = S[i + 1][3] if i + 1 < len(S) else end
        if fx.get('cont'):   # the same shot goes on
            q = out[-1]; src = q['src'] + (q['e'] - q['s']) * q['rate']
        if clip and MEDIA:   # never seek past the end of a clip (an empty segment would shift every later cut)
            src = min(src, clip_length(clip) - 0.4)
        if rate is None:     # play the source range [src, to] in the segment's time
            rate = (fx['to'] - src) / (stop - start)
        if clip and clip[0] in 'KWL' and not fx.get('bg') and 'oy' not in fx:   # slow camera drift
            fx = {**fx, 'drift': 1 if len(out) % 2 else -1}
        if stop - start < 0.2: raise SystemExit(f'segment {sid} too short: {stop - start:.2f} s')
        out.append({'id': sid, 'clip': clip, 'src': round(src, 3), 's': round(start, 3), 'e': round(stop, 3),
                    'rate': rate, 'fx': fx})
    return out, end


WHIP = ['landing', 'route', 'belt', 'site2', 'ai01', 'qr', 'value', 'days', 'suitcase', 'ai04', 'cashier',
        'kassapin', 'uz1', 'servispin', 'recap']


def scenes3d(T, segs):
    sg = {s['id']: (s['s'], s['e']) for s in segs}
    w = lambda vid, pre, n=1: wt(T, vid, pre, n)
    return {
        'route': {'t0': sg['route'][0], 't1': sg['route'][1],
                  'at': [w('R1', 'bagaj'), w('R1', 'bojxona'), w('R1', "to'lovlar"), w('R1', 'bojxona', 2), w('R1', 'chiqishdan')]},
        'days': {'t0': sg['days'][0], 't1': sg['days'][1], 'pages': [w('R2', 'xorijda'), w('R2', 'kamida'), w('R2', 'uch')],
                 'ok': w('R2', 'kerak')},
        'month': {'t0': sg['month'][0], 't1': sg['month'][1], 'short': w('R3', 'qisqa'),
                  'flags': [w('R3', 'oyda'), w('R3', 'ikki'), w('R3', "ko'p")], 'stamp': w('R3', "me'yor"), 'full': w('R3', "to'lov")},
        'kassa': {'t0': sg['kassapin'][0], 't1': sg['kassapin'][1], 'station': 3},
        'servis': {'t0': sg['servispin'][0], 't1': sg['servispin'][1], 'station': 4},
    }


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
        'control': p('N12', 1), 'showQr': p('N12', 3), 'inNorm': p('O3b', 0), 'welcomeIn': p('O3b', 1),
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
            'seg': {s['id']: [s['s'], s['e']] for s in segs}, 's3d': scenes3d(T, segs), 'whip': [s['s'] for s in segs if s['id'] in WHIP],
            'missing': [k for k, it in T.items() if it.get('missing')],
            'ev': {**events(T), 'loc': src2t(segs, 'm2', 0.5), 'check': src2t(segs, 'm3', 5.6), 'checkDone': src2t(segs, 'm3', 8.0)},
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
    """Few, quiet effects: only where something happens on screen."""
    e = events(T)
    L = [('stamp', e['stamp'])] + [('key', k) for k in e['keys']]
    L += [('ding', e['qrShown']), ('ding', e['paid']), ('ding', e['thatsAll'])]
    d = scenes3d(T, segments(T)[0])
    L += [('tick', x) for x in d['route']['at']] + [('tick', x) for x in d['days']['pages']] + [('ding', d['days']['ok'])]
    L += [('thud', x) for x in d['month']['flags']] + [('stamp', d['month']['stamp'])]
    return L


# Steady airport murmur for the whole film: clips without nearby voices, joined and low-passed.
BED = [('K09B', 0.0, 9.0), ('K05', 0.0, 8.0), ('K04', 0.0, 6.5), ('K07ALTQ', 0.0, 7.0)]


def room_ir(seed=7):
    """Reflections of a medium hall and a soft 0.6 s tail (filtered, so no hiss); no direct sound."""
    rng = np.random.default_rng(seed); n = int(0.9 * SR); ir = np.zeros(n, np.float32)
    for ms, gdb in [(11, -9), (17, -11), (23, -12), (31, -14), (43, -16), (57, -18)]:
        ir[int(ms * SR / 1000)] += 10 ** (gdb / 20)
    t = np.arange(n) / SR; tail = rng.standard_normal(n) * np.exp(-6.9 * t / 0.6) * (t > 0.02)
    k = np.ones(24) / 24; tail = np.convolve(tail, k, 'same')       # darker tail
    ir += (tail / np.sqrt((tail ** 2).sum()) * 0.6).astype(np.float32)
    return ir / np.sqrt((ir ** 2).sum())   # unit energy: the send level sets how much room


def convolve(x, ir):
    n = len(x) + len(ir) - 1; m = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(ir, m), m)[:len(x)].astype(np.float32)


def envelope_duck(voice, n, attack=0.08, release=0.4, thr_db=-45):
    k = int(0.02 * SR); lvl = np.sqrt(np.convolve(voice ** 2, np.ones(k) / k, 'same'))
    speech = (lvl > 10 ** (thr_db / 20)).astype(np.float32)
    duck = np.empty(n, np.float32); g = 0.0; a, rl = 1 / (attack * SR), 1 / (release * SR)
    for i in range(0, n, 240):
        target = speech[i:i + 240].max() if i < len(speech) else 0.0
        g = min(target, g + a * 240) if target > g else max(target, g - rl * 240)
        duck[i:i + 240] = g
    return duck


def build_audio():
    T = timeline(); segs, end = segments(T)
    n = int((end + 0.5) * SR)
    nar, off, ev, fx = (np.zeros(n, np.float32) for _ in range(4))
    takes = {k: decode(find(v, '.mp3')) for k, v in TAKES.items() if k != 'new' or new_lines()}
    def stretch(x, k, name):
        if abs(k - 1) < 1e-3: return x
        tmp = os.path.join(WORK, f'_{name}.wav'); write_wav(tmp, x)
        return decode(tmp, af=f'rubberband=tempo={k}:pitchq=quality')
    for vid, it in T.items():
        if it['take'] not in takes: continue   # a new line not recorded yet
        take, bus = takes[it['take']], (off if it['take'] == 'off' else nar)
        parts = it.get('chunks') or [(it['in'], it['out'], it['at'], it['tempo'])]
        target = -18.5 if it['take'] == 'off' else -17.0   # every sentence at the same loudness
        for m, (j0, j1, at, k) in enumerate(parts):
            x = stretch(take[int(j0 * SR):int(j1 * SR)], k, f'{vid}-{m}')
            fr = x[:len(x) // 960 * 960].reshape(-1, 960); e = np.sqrt((fr ** 2).mean(1)); act = e[e > e.max() * 0.05]
            x = x * 10 ** (target / 20) / (np.sqrt((act ** 2).mean()) + 1e-9)
            place(bus, fade(x, 0.015, 0.06), at)
    # The officer stands in the hall: a little EQ and the room around him.
    tmp = os.path.join(WORK, '_officer.wav'); write_wav(tmp, off)
    dry = decode(tmp, af='highpass=f=110,equalizer=f=250:t=q:w=1:g=-2,equalizer=f=9000:t=q:w=1:g=-2')[:n]
    off = dry + convolve(dry, room_ir()) * 10 ** (-15 / 20)
    # Steady bed of airport murmur.
    parts = [decode(find(CLIPS[c]), ss=a, t=b - a, af='highpass=f=90,lowpass=f=4500') for c, a, b in BED]
    xf = int(1.0 * SR); bed = parts[0]
    for q in parts[1:] + parts[:1]:
        w = np.linspace(0, np.pi / 2, xf); bed = np.concatenate([bed[:-xf], bed[-xf:] * np.cos(w) + q[:xf] * np.sin(w), q[xf:]])
    loop = bed[:-xf]; reps = int(np.ceil(n / len(loop))) + 1; bed = np.tile(loop, reps)[:n]
    bed *= 10 ** (-40 / 20) / (np.sqrt(np.mean(bed ** 2)) + 1e-9)
    # Sounds that belong to a shot: the landing jet, the scanner beeps, the printer.
    for s in segs:
        if 'sound' not in s['fx']: continue
        dur = s['e'] - s['s']; r = s['rate']
        x = decode(find(CLIPS[s['clip']]), ss=s['src'], t=dur * r + 0.05, af=None if abs(r - 1) < 1e-6 else f'atempo={r:.5f}')
        if 'mute_after' in s['fx']:
            q = int(max(0, (s['fx']['mute_after'] - s['src']) / r) * SR)
            x[q:] = 0; x[max(0, q - 4800):q] *= np.linspace(1, 0, min(q, 4800))
        place(ev, fade(x[:int(dur * SR)], 0.2, 0.25), s['s'], s['fx']['sound'])
    for kind, at in sfx_list(T):
        place(fx, sfx(kind), at, {'stamp': -4, 'thud': -8, 'tick': -14}.get(kind, -10))
    duck = envelope_duck(nar + off, n)
    voice = nar + off
    mix = voice + bed * 10 ** (-5 * duck / 20) + ev * 10 ** ((-14 - 6 * duck) / 20) + fx
    os.makedirs(WORK, exist_ok=True)
    write_wav(os.path.join(WORK, 'voice-mix.wav'), mix * 0.89 / max(1e-6, np.abs(mix).max()))
    write_wav(os.path.join(WORK, 'voice-only.wav'), voice)
    print(f'audio: {len(mix) / SR:.2f} s -> {WORK}/voice-mix.wav')


# ---------------------------------------------------------------- video
def seg_filter(s, dur):
    fx, r = s['fx'], s['rate']
    f = [f'setpts=(PTS-STARTPTS)/{r:.6f}', f'fps={FPS}']
    if 'oy' in fx:   # screen recording: fill the width, choose the visible band
        f += [f'scale={W}:-2:flags=lanczos', f"crop={W}:{H}:0:{fx['oy']}", 'setsar=1']
    else:
        f += [f'scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos', f'crop={W}:{H}', 'setsar=1']
    if fx.get('drift'):   # 8 % larger, the frame slides slowly sideways
        d = fx['drift']; f += [f'scale={int(W * 1.08) // 2 * 2}:{int(H * 1.08) // 2 * 2}',
                               f"crop={W}:{H}:x='(iw-ow)*(0.5+{0.5 * d}*(2*t/{dur:.3f}-1))':y='(ih-oh)/2'"]
    if fx.get('bg'):
        f += ['scale=270:480', 'boxblur=8:3', f'scale={W}:{H}', 'eq=brightness=-0.10:saturation=0.75']
    if fx.get('dim'):
        f += [f"eq=brightness={-fx['dim'] / 2}:saturation=0.9"]
    # frame-exact length, so the cuts never drift from the sound
    nf = round(s['e'] * FPS) - round(s['s'] * FPS)
    f += [f'tpad=stop_mode=clone:stop_duration={dur + 1:.3f}', f'trim=end_frame={nf}', 'setpts=N/FRAME_RATE/TB']
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
    from concurrent.futures import ThreadPoolExecutor
    def render(i, s):
        dur = s['e'] - s['s']; out = os.path.join(d, f'{i:02d}-{s["id"]}.mp4')
        enc = ['-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '15', '-pix_fmt', 'yuv420p', '-r', str(FPS), '-threads', '2']
        if s['clip'] is None:
            nf = round(s['e'] * FPS) - round(s['s'] * FPS)
            ff('-f', 'lavfi', '-i', f'color=c=0x06281e:s={W}x{H}:r={FPS}', '-frames:v', str(nf), *enc, out)
        else:
            ff('-ss', f"{s['src']:.3f}", '-i', find(CLIPS[s['clip']]), '-filter_complex', seg_filter(s, dur), *enc, out)
        nf = round(s['e'] * FPS) - round(s['s'] * FPS)
        got = sum(1 for l in subprocess.run(['ffmpeg', '-v', 'error', '-i', out, '-map', '0:v', '-f', 'framecrc', '-'],
                                             capture_output=True, text=True).stdout.splitlines() if l and not l.startswith('#'))
        if got != nf: raise SystemExit(f'segment {s["id"]}: {got} frames, expected {nf}')
        print(f'  {i:02d} {s["id"]:9s} {dur:5.2f} s', flush=True)
        return f"file '{out}'"
    with ThreadPoolExecutor(int(opt('--jobs', 3))) as pool:
        lst = list(pool.map(lambda a: render(*a), enumerate(segs)))
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


def check_av(path, end):
    """The audio must be continuous (no timestamp holes) and as long as the picture."""
    rows = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-map', '0:a', '-c', 'copy', '-f', 'framecrc', '-'],
                          capture_output=True, text=True).stdout.splitlines()
    pts = [int(r.split(',')[2]) for r in rows if r and not r.startswith('#')]
    holes = sum(1 for a, b in zip(pts, pts[1:]) if b - a != 1024)
    n = len(pts) * 1024 / SR
    if holes or abs(n - end) > 0.1: raise SystemExit(f'{path}: audio {n:.2f} s with {holes} holes, picture {end:.2f} s')
    print(f'check: audio {n:.2f} s, no holes, picture {end:.2f} s')


def build_final():
    T = timeline(); _, end = segments(T)
    ov = os.path.join(WORK, 'overlay', '%05d.png'); out = os.path.join(WORK, opt('--out', 'telefon-deklaratsiya.mp4'))
    mix = os.path.join(WORK, opt('--audio', 'voice-mix.wav'))
    # Loudness: measure, then one fixed gain and a peak limiter. (loudnorm falls back to its dynamic
    # mode here, and that mode leaves ~3 s holes in the encoded audio, so it is not used.)
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', mix, '-af', 'ebur128', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    level = float(r[r.rindex('I:'):].split()[1]); gain = -14.0 - level
    af = (f'volume={gain:.2f}dB,alimiter=limit=0.87:attack=3:release=80:level=false:latency=true,'
          f'afade=t=out:st={end - 1.2:.3f}:d=1.2,aformat=sample_rates=48000:channel_layouts=stereo')
    # Sound and picture are encoded separately and then muxed: encoded in one graph with the
    # overlay frames, the audio came out with holes.
    aac, vid = os.path.join(WORK, '_final-audio.m4a'), os.path.join(WORK, '_final-video.mp4')
    ff('-i', mix, '-af', af, '-t', f'{end:.3f}', '-c:a', 'aac', '-b:a', '192k', aac)
    ff('-i', os.path.join(WORK, 'base.mp4'), '-framerate', str(FPS), '-i', ov,
       '-filter_complex', f'[0:v][1:v]overlay=format=auto,fade=t=out:st={end - 1.0:.3f}:d=1.0,format=yuv420p[v]',
       '-map', '[v]', '-t', f'{end:.3f}', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', vid)
    ff('-i', vid, '-i', aac, '-map', '0:v', '-map', '1:a', '-c', 'copy', '-movflags', '+faststart', out)
    check_av(out, end)
    print(f'final: {out}')


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'cues'
    {'cues': write_cues, 'clean': build_clean, 'audio': build_audio, 'video': build_video, 'final': build_final}[cmd]()
