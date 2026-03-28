import math
from pathlib import Path

import cv2
import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parent.parent
SOURCE_VIDEO = ROOT / "assets" / "videos" / "agent.mp4"
OUTPUT_DIR = ROOT / "assets" / "sequences" / "agent"
META_FILE = ROOT / "pencil-new-react" / "src" / "generated" / "agentSequenceMeta.ts"

TARGET_WIDTH = 480
TARGET_HEIGHT = 488
TARGET_FPS = 15
SOURCE_FPS = 30
FRAME_STEP = SOURCE_FPS // TARGET_FPS
BACKGROUND_COLORS = np.array([[239, 239, 239], [161, 161, 161]], dtype=np.int16)


def remove_black_bars(frame_rgb: np.ndarray) -> np.ndarray:
    luma = (
        frame_rgb[..., 0] * 0.2126
        + frame_rgb[..., 1] * 0.7152
        + frame_rgb[..., 2] * 0.0722
    )
    nonblack = luma > 16
    xs = np.where(nonblack.any(axis=0))[0]
    ys = np.where(nonblack.any(axis=1))[0]

    if xs.size == 0 or ys.size == 0:
        return frame_rgb

    return frame_rgb[ys[0] : ys[-1] + 1, xs[0] : xs[-1] + 1].copy()


def estimate_board_geometry(sample_rgb: np.ndarray) -> tuple[int, int, int]:
    r = sample_rgb[..., 0].astype(np.int16)
    g = sample_rgb[..., 1].astype(np.int16)
    b = sample_rgb[..., 2].astype(np.int16)
    chroma = np.max(sample_rgb, axis=2).astype(np.int16) - np.min(sample_rgb, axis=2).astype(np.int16)
    neutral = chroma < 16

    h, w = neutral.shape
    yy, xx = np.indices((h, w))
    outer_ring = ((xx - w / 2) / (w * 0.34)) ** 2 + ((yy - h * 0.54) / (h * 0.44)) ** 2 > 1.15
    mask = neutral & outer_ring
    points = np.argwhere(mask)[::8]
    colors = sample_rgb[points[:, 0], points[:, 1]].astype(np.int16)

    best: tuple[float, int, int, int] | None = None
    for square_size in range(28, 39):
        for phase_x in range(square_size):
            for phase_y in range(square_size):
                parity = (((points[:, 1] - phase_x) // square_size + (points[:, 0] - phase_y) // square_size) & 1).astype(bool)
                expected = np.where(parity[:, None], BACKGROUND_COLORS[1], BACKGROUND_COLORS[0])
                swapped = np.where(parity[:, None], BACKGROUND_COLORS[0], BACKGROUND_COLORS[1])
                error = min(
                    np.abs(colors - expected).mean(),
                    np.abs(colors - swapped).mean()
                )

                if best is None or error < best[0]:
                    best = (float(error), square_size, phase_x, phase_y)

    if best is None:
        return 32, 13, 29

    return best[1], best[2], best[3]


def build_grabcut_alpha(frame_rgb: np.ndarray) -> np.ndarray:
    h, w = frame_rgb.shape[:2]
    mask = np.full((h, w), cv2.GC_BGD, np.uint8)

    rect_x = int(w * 0.16)
    rect_y = int(h * 0.04)
    rect_w = int(w * 0.68)
    rect_h = int(h * 0.92)
    mask[rect_y : rect_y + rect_h, rect_x : rect_x + rect_w] = cv2.GC_PR_FGD

    r = frame_rgb[..., 0].astype(np.int16)
    g = frame_rgb[..., 1].astype(np.int16)
    b = frame_rgb[..., 2].astype(np.int16)
    chroma = np.max(frame_rgb, axis=2).astype(np.int16) - np.min(frame_rgb, axis=2).astype(np.int16)

    blue_foreground = ((b > g + 10) & (b > r + 10)) | (
        (g > 120) & (b > 125) & (chroma > 20)
    )
    peach_foreground = (r > 220) & (g > 180) & (b > 160)
    dark_foreground = ((r + g + b) / 3 < 70) & (chroma > 12)
    sure_foreground = blue_foreground | peach_foreground | dark_foreground
    mask[sure_foreground] = cv2.GC_FGD

    neutral_background = (chroma < 24) & (frame_rgb.mean(axis=2) > 100)
    edge_margin = max(8, int(min(w, h) * 0.05))
    edge = np.zeros((h, w), dtype=bool)
    edge[:edge_margin, :] = True
    edge[-edge_margin:, :] = True
    edge[:, :edge_margin] = True
    edge[:, -edge_margin:] = True
    mask[neutral_background & edge] = cv2.GC_BGD

    background_model = np.zeros((1, 65), np.float64)
    foreground_model = np.zeros((1, 65), np.float64)
    cv2.grabCut(frame_rgb, mask, None, background_model, foreground_model, 8, cv2.GC_INIT_WITH_MASK)

    alpha = np.where(
        (mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD),
        255,
        0
    ).astype(np.uint8)

    px = frame_rgb.astype(np.int16)
    distance_to_light = np.linalg.norm(px - BACKGROUND_COLORS[0], axis=2)
    distance_to_dark = np.linalg.norm(px - BACKGROUND_COLORS[1], axis=2)
    min_distance = np.minimum(distance_to_light, distance_to_dark)
    residual_background = (min_distance < 34) & (chroma < 26) & (alpha > 0) & (~sure_foreground)
    alpha[residual_background] = 0

    kernel = np.ones((3, 3), np.uint8)
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_OPEN, kernel)
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, kernel)
    alpha = cv2.GaussianBlur(alpha, (0, 0), 1.0)
    return alpha


def render_output_frame(frame_rgb: np.ndarray, alpha: np.ndarray) -> Image.Image:
    rgba = np.dstack([frame_rgb, alpha])
    image = Image.fromarray(rgba, "RGBA")
    image = image.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.LANCZOS)
    return image


def write_meta(frame_count: int) -> None:
    META_FILE.parent.mkdir(parents=True, exist_ok=True)
    META_FILE.write_text(
        "\n".join(
            [
                "export const agentSequenceMeta = {",
                f"  fps: {TARGET_FPS},",
                f"  frameCount: {frame_count},",
                f"  width: {TARGET_WIDTH},",
                f"  height: {TARGET_HEIGHT},",
                '  basePath: "../../assets/sequences/agent"',
                "} as const;",
                "",
            ]
        ),
        encoding="utf-8",
    )


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    capture = cv2.VideoCapture(str(SOURCE_VIDEO))
    frame_count = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
    if frame_count <= 0:
        raise RuntimeError(f"Unable to read frame count from {SOURCE_VIDEO}")

    ok, sample_frame = capture.read()
    if not ok:
        raise RuntimeError(f"Unable to read frames from {SOURCE_VIDEO}")
    sample_rgb = remove_black_bars(cv2.cvtColor(sample_frame, cv2.COLOR_BGR2RGB))
    square_size, phase_x, phase_y = estimate_board_geometry(sample_rgb)
    print(f"checkerboard square={square_size}, phase=({phase_x}, {phase_y})")
    capture.set(cv2.CAP_PROP_POS_FRAMES, 0)

    exported = 0
    frame_index = 0
    while True:
        ok, frame = capture.read()
        if not ok:
            break

        if frame_index % FRAME_STEP != 0:
            frame_index += 1
            continue

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        cropped = remove_black_bars(rgb)
        alpha = build_grabcut_alpha(cropped)
        output_frame = render_output_frame(cropped, alpha)

        exported += 1
        output_path = OUTPUT_DIR / f"frame-{exported:04d}.png"
        output_frame.save(output_path, optimize=True)
        if exported % 20 == 0:
            print(f"generated {output_path.name}")

        frame_index += 1

    capture.release()
    write_meta(exported)
    print(f"generated {exported} frames")


if __name__ == "__main__":
    main()
