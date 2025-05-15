import {Component, ElementRef, Input, input, signal, ViewChild} from '@angular/core';
import {ConfigurationService} from '../../../../service/ConfigurationService';
import {NgIf, NgStyle} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';
import {MatDivider} from "@angular/material/divider";
import {SettingsService} from "../../../../service/SettingsService";
import {Mode} from "../../../../models/Mode";


@Component({
    selector: 'app-spectator',
    templateUrl: './spectator.component.html',
    styleUrl: './spectator.component.css',
    imports: [
        NgIf,
        MatIconModule,
        NgStyle,
        MatSlideToggle,
        FormsModule,
        MatDivider,
    ],
    standalone: true
})
export class SpectatorComponent {
    @ViewChild('nameInput') nameInput!: ElementRef<HTMLInputElement>;
    @ViewChild('descInput') descInput!: ElementRef<HTMLTextAreaElement>;
    @Input() width: number = 250;
    @Input() height: number = 600;

    isEditingName = false;
    isEditingDesc = false;

    constructor(protected configurationService: ConfigurationService,
                private settingsService: SettingsService,
    ) {
    }

    // --- name handlers ---
    onNameKeydown(evt: KeyboardEvent, text: string) {
        if (evt.key === 'Enter') {
            evt.preventDefault();           // не даем перейти на новую строку
            (evt.target as HTMLElement).blur();
        }
    }

    saveName(text: string) {
        this.isEditingName = false;
        this.configurationService.configurationData.update(d => ({
            ...d!,
            name: text.trim()
        }));
        this.callSave();
    }

    // --- description handlers ---
    onDescKeydown(evt: KeyboardEvent, text: string) {
        if (evt.key === 'Enter' && !evt.shiftKey) {
            evt.preventDefault();           // Enter = сохранить
            (evt.target as HTMLElement).blur();
        }
        // Shift+Enter → по умолчанию вставит новую строку
    }

    saveDesc(text: string) {
        this.isEditingDesc = false;
        this.configurationService.configurationData.update(d => ({
            ...d!,
            description: text
        }));
        this.callSave();
    }

    private callSave() {
        this.configurationService.updateConfigData()
    }


    toggleMiniPreview(checked: boolean) {
        this.configurationService.configurationData.update(d => ({
            ...d!,
            useMiniPreview: checked
        }))
        this.callSave()
    }

    isInGalleryMode() {
        return this.settingsService.setting.mode === Mode.GalleryMode
    }
}
