import {inject, Injectable} from '@angular/core';
import {SettingsService} from '../../../../service/SettingsService';
import {AnimationService} from '../../../../service/AnimationService';

@Injectable({
  providedIn: 'root'
})
export class PaletteGenerator {
  private readonly K = 9;

  animationService: AnimationService = inject(AnimationService);
  settingsService = inject(SettingsService);
   private collectUniqueColors(): string[] {
    const unique = new Set<string>();
    this.animationService.frames.forEach(frame => {
      Object.values(frame.panelPixelColors).forEach(matrix => {
        matrix.forEach(row => {
          row.forEach(color => unique.add(color));
        });
      });
    });
    return Array.from(unique);
  }
  generatePalette(): void {
    const hexes = this.collectUniqueColors()
    if (hexes.length < this.K) {
      this.settingsService.setting.paletteColors = this.generateRandomColors(this.K);
      return;
    }

    const points = hexes.map(h => this.hexToRgb(h));

    const centroids = this.kMeans(points, this.K, 30);

    this.settingsService.setting.paletteColors = centroids.map(c => this.rgbToHex(c));
  }

  private hexToRgb(hex: string) {
    const m = hex.match(/^#?([0-9a-f]{6})$/i);
    const num = m ? parseInt(m[1], 16) : 0;
    return {
      r: (num >> 16) & 0xff,
      g: (num >>  8) & 0xff,
      b: num & 0xff
    };
  }

  private rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
    const p = (n: number) => n.toString(16).padStart(2, '0');
    return `#${p(r)}${p(g)}${p(b)}`;
  }

  /** Простейшая k-means на RGB-точках */
  private kMeans(
    points: { r: number; g: number; b: number }[],
    k: number,
    maxIter: number
  ) {
    if (points.length <= k) return points.map(p => ({ ...p }));

    // 1) Инициализация
    const shuffled = points.sort(() => Math.random() - 0.5);
    let centroids = shuffled.slice(0, k).map(p => ({ ...p }));
    let clusters: number[][] = [];

    for (let iter = 0; iter < maxIter; iter++) {
      clusters = centroids.map(() => []);

      // 2) Распределение
      points.forEach((p, i) => {
        let best = 0, bestD = Infinity;
        centroids.forEach((c, ci) => {
          const d2 = (p.r - c.r)**2 + (p.g - c.g)**2 + (p.b - c.b)**2;
          if (d2 < bestD) { bestD = d2; best = ci; }
        });
        clusters[best].push(i);
      });

      // 3) Пересчёт центроидов
      let moved = false;
      centroids = centroids.map((c, ci) => {
        const idxs = clusters[ci];
        if (!idxs.length) return c;
        const sum = idxs.reduce((acc, i) => {
          acc.r += points[i].r; acc.g += points[i].g; acc.b += points[i].b;
          return acc;
        }, { r:0, g:0, b:0 });
        const avg = {
          r: Math.round(sum.r / idxs.length),
          g: Math.round(sum.g / idxs.length),
          b: Math.round(sum.b / idxs.length)
        };
        if (avg.r!==c.r || avg.g!==c.g || avg.b!==c.b) moved = true;
        return avg;
      });

      if (!moved) break;
    }

    return centroids;
  }
  private generateRandomColors(n: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < n; i++) {
      colors.push(this.randomHex());
    }
    return colors;
  }
  private randomHex(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const to2 = (x: number) => x.toString(16).padStart(2, '0');
    return `#${to2(r)}${to2(g)}${to2(b)}`;
  }
}
