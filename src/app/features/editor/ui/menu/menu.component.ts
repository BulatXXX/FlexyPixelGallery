import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {PanelStateService} from '../../service/PanelStateService';
import {AsyncPipe, NgClass, NgStyle} from '@angular/common';
import {CommandManager} from '../../service/CommandManager';
import {Mode} from '../../models/Mode';
import {EditorActions} from '../../models/EditorActions';
import {MatTooltip} from '@angular/material/tooltip';
import {SettingsService} from '../../service/SettingsService';
import {FormsModule} from '@angular/forms';
import {AnimationService} from '../../service/AnimationService';
import {ConfigurationService} from '../../service/ConfigurationService';
import {DialogService} from '../../../../core/services/dialog.service';
import {Subscription} from 'rxjs';
import {CreateResponse} from '../../../configurations/library-configuration.repository';

@Component({
  selector: 'app-menu',
  imports: [
    MatIcon,
    NgStyle,
    MatTooltip,
    AsyncPipe,
    NgClass,
    FormsModule
  ],
  templateUrl: './menu.component.html',
  standalone: true,
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  @Input() width: number = 0;
  @Input() height: number = 0;
  @ViewChild('editableFrame', { static: true }) editableFrame!: ElementRef<HTMLElement>;

  currentFrameNumber = 0;
  isPlaying = false;

  currentPublicId: string | null = null;
  private configurationIdSubscription!: Subscription;


  ngOnInit() {
    this.animationService.currentFrameIndex$.subscribe((index) => {
      this.currentFrameNumber = index;
    });
    this.animationService.isPlaying$.subscribe(isPlaying => {
      this.isPlaying = isPlaying;
    })
  }

  onFrameNumberChange(event: Event) {
    const target = event.target as HTMLElement;
    // читаем то, что в span-е
    let raw = target.innerText.trim();
    let val = parseInt(raw, 10);

    if (isNaN(val))          val = 0;
    if (val < 0)             val = 0;
    if (val > 585)           val = 585;

    this.currentFrameNumber = val;
    this.animationService.selectFrame(val);
  }
  allowOnlyDigits(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'Delete',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End',
      'Tab'
    ];

    // всегда пропускаем навигацию и удаление
    if (allowedKeys.includes(event.key)) {
      return;
    }

    // если это не цифра — блокируем
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }
  prevFrame() {
    const newIndex = Math.max(0, this.currentFrameNumber - 1);
    this.animationService.selectFrame(newIndex);
  }

  nextFrame() {
    const newIndex = Math.min(585, this.currentFrameNumber + 1);
    this.animationService.selectFrame(newIndex);
  }

  constructor(private configurationService: ConfigurationService,
              private dialogService: DialogService,
              protected editorStateService: PanelStateService,
              private commandManager: CommandManager,
              protected settingsService: SettingsService,
              protected animationService: AnimationService) {
  }

  undo() {
    this.commandManager.undo()
  }

  redo() {
    this.commandManager.redo()
  }

  centerGrid() {
    this.editorStateService.triggerAction(EditorActions.CenterGrid);
  }


  toggleBorders() {
    this.settingsService.toggleBorders();
  }

  toggleDirections() {
    this.settingsService.toggleDirections();
  }

  protected readonly Mode = Mode;


  zoomIn() {
    this.editorStateService.triggerAction(EditorActions.ZoomIn)
  }

  zoomOut() {
    this.editorStateService.triggerAction(EditorActions.ZoomOut);
  }

  save() {
    this.configurationService.saveConfiguration().subscribe({
      next: (res: CreateResponse | void) => {
        if (res) {
          // ветка CREATE
          console.log('Новая конфигурация, publicId =', (res as CreateResponse).publicId);
        } else {
          // ветка UPDATE
          console.log('Конфигурация успешно обновлена');
        }
      },
      error: err => {
        console.error('Ошибка при сохранении:', err);
      }
    });

  }

  load() {
    this.dialogService
      .openConfigurationDialog()
      .subscribe({
        next: publicId => {
          if (!publicId) {
            console.log('Dialog cancelled or no ID provided.');
            return;
          }

          this.configurationService
            .loadConfiguration(publicId)
            .subscribe({
              next: response => {
                this.configurationService.applyConfiguration(response);
                console.log('Configuration loaded successfully:', response);
              },
              error: err => {
                console.error('Error loading configuration:', err);
              }
            });
        },
        error: err => {
          console.error('Error opening dialog:', err);
        }
      });
  }


  pauseAnimation() {
    this.animationService.pauseAnimation();
  }
  playAnimation() {
    this.animationService.playAnimation();
  }
}
