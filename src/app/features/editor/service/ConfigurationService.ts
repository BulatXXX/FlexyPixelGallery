import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnimationService } from './AnimationService';
import { PanelStateService } from './PanelStateService';
import { Frame } from '../models/Frame';
import {Direction, Panel} from '../models/Panel';
import { Observable } from 'rxjs';

export interface SaveConfigurationRequest {
  name: string;
  description: string;
  previewImageUrl: string;
  panels: {
    uid: string;
    x: number;
    y: number;
    direction: string;
  }[];
  frames: {
    index: number;
    panelPixelColors: string; // JSON строка
  }[];
}

export interface ConfigurationResponse {
  publicId: string;
  ownerId: number;
  name: string;
  description: string;
  previewImageUrl: string;
  createdAt: string;
  updatedAt: string;
  panels: {
    uid: string;
    x: number;
    y: number;
    direction: string;
  }[];
  frames: {
    index: number;
    panelPixelColors: string; // JSON-строка
  }[];
}

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  private readonly baseUrl = 'http://localhost:8080/configurations';

  constructor(
    private http: HttpClient,
    private panelStateService: PanelStateService,
    private animationService: AnimationService
  ) {}

  serializeConfiguration(
    name: string = 'My LED Animation',
    description: string = 'Amazing LED panel configuration',
    previewImageUrl: string = 'http://example.com/preview.jpg'
  ): SaveConfigurationRequest {
    const panels = this.panelStateService.panels;
    const frames = this.animationService.frames;

    const serializedPanels = panels.map(p => ({
      uid: p.id,
      x: p.x,
      y: p.y,
      direction: p.direction
    }));

    const serializedFrames = frames.map((frame, idx) => ({
      index: idx,
      panelPixelColors: JSON.stringify(frame.panelPixelColors)
    }));

    return {
      name,
      description,
      previewImageUrl,
      panels:serializedPanels,
      frames: serializedFrames
    };
  }

  saveConfiguration(): Observable<{ publicId: string }> {
    console.log("saveConfiguration");
    const payload = this.serializeConfiguration();
    console.log("payload", payload);
    return this.http.post<{ publicId: string }>(`http://localhost:8080/configurations/full`, payload);
  }

  loadConfiguration(publicId: string): Observable<ConfigurationResponse> {
    return this.http.get<ConfigurationResponse>(`${this.baseUrl}/${publicId}`);
  }

  applyConfiguration(response: ConfigurationResponse): void {
    const panels: Panel[] = response.panels.map(p => ({
      id: p.uid,
      x: p.x,
      y: p.y,
      direction: this.convertToDirection(p.direction),
      pixels: Array(8).fill(null).map(() => Array(8).fill('#ffffff')) // временно, чтобы редактор не упал
    }));

    const frames: Frame[] = response.frames.map(f => ({
      index: f.index,
      panelPixelColors: JSON.parse(f.panelPixelColors)
    }));

    this.panelStateService.updatePanels(panels);
    this.animationService.frames = frames;
    this.animationService.selectFrame(0);
  }
  private convertToDirection(dir: string): Direction {
    switch (dir.toLowerCase()) {
      case 'left':   return Direction.Left;
      case 'right':  return Direction.Right;
      case 'top':    return Direction.Top;
      case 'bottom': return Direction.Bottom;
      default:
        console.warn(`Unknown direction "${dir}". Defaulting to Direction.Bottom.`);
        return Direction.Bottom;
    }
  }

}
