"""Recorta escudos, remove o fundo preto (ligado à borda) com alfa suave e padroniza em 512x512 WebP."""
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

SRC = Path(sys.argv[1])
OUT = Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)

MAP = {
    "WhatsApp Image 2026-11-19 at 16.37.22.jpeg": "real-quebrada",
    "WhatsApp Image 2026-11-19 at 16.37.22 (1).jpeg": "phenix",
    "WhatsApp Image 2026-11-19 at 16.37.22 (2).jpeg": "adega-do-galo",
    "WhatsApp Image 2026-11-19 at 16.37.23.jpeg": "inimigos-do-fim",
    "WhatsApp Image 2026-11-19 at 16.37.23 (1).jpeg": "pitaco",
    "WhatsApp Image 2026-11-19 at 16.37.23 (2).jpeg": "seu-guzin",
    "WhatsApp Image 2026-11-19 at 16.37.23 (3).jpeg": "cuesta",
    "WhatsApp Image 2026-11-19 at 16.37.23 (4).jpeg": "maestro",
    "WhatsApp Image 2026-11-19 at 16.37.24.jpeg": "abdulas",
    "WhatsApp Image 2026-11-19 at 16.37.24 (1).jpeg": "republica",
    "WhatsApp Image 2026-11-19 at 16.37.24 (2).jpeg": "so-tapa",
    "WhatsApp Image 2026-11-19 at 16.37.24 (3).jpeg": "cabare",
    "logo_copa_varzea.jpeg": "_logo",
}

SIZE = 512
CLOSE = {"republica": 0.03}
DARK_T = 42
WHITE_T = 232


def process(path: Path, name: str):
    rgb = np.asarray(Image.open(path).convert("RGB")).astype(np.int16)
    maxc = rgb.max(axis=2)
    minc = rgb.min(axis=2)
    dark = maxc < DARK_T
    white = minc > WHITE_T
    cand = dark | white

    # Ignora artefatos nas bordas da imagem original
    m = 4
    cand[:m, :] = cand[-m:, :] = True
    cand[:, :m] = cand[:, -m:] = True

    labels, _ = ndimage.label(cand)
    border = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
    border = border[border != 0]
    bg = np.isin(labels, border)

    # Mantém opaco o preto interno do escudo: fecha frestas da silhueta e preenche buracos
    fg = ~bg
    it = max(3, int(max(fg.shape) * CLOSE.get(name, 0.005)))
    fg = ndimage.binary_closing(fg, iterations=it, border_value=0)
    fg = ndimage.binary_fill_holes(fg)
    bg = bg & ~fg
    dark = dark | (bg & ~white)

    alpha = np.full(maxc.shape, 255, dtype=np.float32)
    soft = np.clip((maxc - 10) * 7.0, 0, 255)
    alpha[bg & dark] = soft[bg & dark]
    alpha[bg & white] = 0
    alpha[:m, :] = alpha[-m:, :] = 0
    alpha[:, :m] = alpha[:, -m:] = 0
    # Suaviza 1px na transição para evitar serrilhado
    alpha = ndimage.uniform_filter(alpha, size=2)

    rgba = np.dstack([rgb.astype(np.uint8), alpha.clip(0, 255).astype(np.uint8)])
    im = Image.fromarray(rgba, "RGBA")

    ys, xs = np.where(alpha > 24)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    im = im.crop((x0, y0, x1 + 1, y1 + 1))

    w, h = im.size
    side = int(max(w, h) * 1.04)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(im, ((side - w) // 2, (side - h) // 2))
    out_size = 480 if name == "_logo" else SIZE
    canvas = canvas.resize((out_size, out_size), Image.LANCZOS)

    target = OUT / ("logo-copa-varzea.webp" if name == "_logo" else f"{name}.webp")
    canvas.save(target, "WEBP", quality=90, method=6)
    if name == "_logo":
        canvas.save(OUT / "logo-copa-varzea.png", "PNG", optimize=True)
    print(f"{target.name:28s} {target.stat().st_size // 1024} KB  (crop {w}x{h})")


for fname, name in MAP.items():
    process(SRC / fname, name)
