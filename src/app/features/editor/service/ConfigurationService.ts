import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AnimationService} from './AnimationService';
import {PanelStateService} from './PanelStateService';
import {Frame} from '../models/Frame';
import {Direction, Panel} from '../models/Panel';
import {BehaviorSubject, finalize, Observable, tap} from 'rxjs';
import {environment} from '../../../core/environment';
import {
  CreateResponse,
  LibraryConfigurationRepository
} from '../../configurations/library-configuration.repository';
import {LoadingService} from '../../../core/services/LoadingService';


export interface ConfigurationResponse {
  publicId: string;
  name: string;
  description: string;
  previewImageUrl: string;
  miniPreviewImageUrl: string;
  miniPreviewPanelUid: string | null;
  useMiniPreview: boolean;
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

export interface ConfigurationData {
  name: string;
  description: string;
  useMiniPreview: boolean;
}

@Injectable({providedIn: 'root'})
export class ConfigurationService {
  public configurationData = signal<ConfigurationData>(
    {
      name: "ConfigName",
      description: "Your config description",
      useMiniPreview: false,
    }
  );
  private readonly baseUrl = `${environment.apiUrl}/configurations/my`;

  private currentPublicIdSubject = new BehaviorSubject<string | null>(null);
  public currentPublicId$ = this.currentPublicIdSubject.asObservable();

  private setCurrentPublicId(newId: string | null): void {
    this.currentPublicIdSubject.next(newId);
  }

  constructor(
    private http: HttpClient,
    private panelStateService: PanelStateService,
    private animationService: AnimationService,
    private libraryConfigurationRepository: LibraryConfigurationRepository,
    private loadingService: LoadingService,
  ) {
  }

  serializeConfiguration() {
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
      panels: serializedPanels,
      frames: serializedFrames
    };
  }

  private downloadPayloadAsFile(payload: any, filename: string): void {
    const jsonString = JSON.stringify(payload, null, 2); // форматирование для читаемости
    const blob = new Blob([jsonString], {type: 'application/json'});

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    URL.revokeObjectURL(link.href); // очистка
  }

  saveConfiguration(): Observable<CreateResponse | void> {
    const payload = this.serializeConfiguration();
    const currentId = this.currentPublicIdSubject.getValue();
    // this.downloadPayloadAsFile(payload,`${currentId}`)
    this.loadingService.show();
    if (currentId) {
      return this.libraryConfigurationRepository
        .updateConfigurationStructure(currentId, payload)
        .pipe(
          finalize(() => this.loadingService.hide())
        );
    } else {

      return this.libraryConfigurationRepository
        .createConfigurationFull(
          {
            name: this.configurationData().name,
            description:  this.configurationData().description,
            panels: payload.panels,
            frames: payload.frames,
          }
        )
        .pipe(
          tap(res => this.setCurrentPublicId(res.publicId)),
          finalize(() => this.loadingService.hide())
        );
    }
  }

  loadConfiguration(publicId: string): Observable<ConfigurationResponse> {
    this.loadingService.show();
    return this.libraryConfigurationRepository.getConfiguration(publicId).pipe(
      tap(res => {
        this.setCurrentPublicId(res.publicId);
        let name = res.name;
        let description = res.description;
        let useMiniPreview = res.useMiniPreview;
        let configData = {
          name: name,
          description: description,
          useMiniPreview: useMiniPreview,
        }
        this.configurationData.set(configData);
      }),
      finalize(() => this.loadingService.hide())
    );
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
      case 'left':
        return Direction.Left;
      case 'right':
        return Direction.Right;
      case 'top':
        return Direction.Top;
      case 'bottom':
        return Direction.Bottom;
      default:
        console.warn(`Unknown direction "${dir}". Defaulting to Direction.Bottom.`);
        return Direction.Bottom;
    }
  }

  updateConfigData() {
    const configId = this.currentPublicIdSubject.getValue()
    const configData = this.configurationData()
    if (!configId || !configData) return;
    this.libraryConfigurationRepository
      .updateConfigurationData(
        configId,
        configData).subscribe({
        next: () => console.log('ok'),
        error: err => console.error(err)
      }
    )
  }
}
