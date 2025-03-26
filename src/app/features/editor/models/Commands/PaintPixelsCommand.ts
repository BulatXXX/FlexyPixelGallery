import { Panel } from '../Panel';
import { Command } from '../../service/CommandManager';
import { PanelStateService } from '../../service/PanelStateService';

export class PaintPixelsCommand implements Command {
    private prevColors: { x: number, y: number, panel: Panel, prevColor: string }[] = [];

    constructor(
        private editorService: PanelStateService,
        private pixelsToPaint: { x: number, y: number, panel: Panel, prevColor: string }[],
        private newColor: string
    ) {}

    // Выполнение команды (покраска)
    do(): void {
        this.pixelsToPaint.forEach(({ x, y, panel, prevColor }) => {
            this.prevColors.push({ x, y, panel, prevColor });
            panel.pixels[y][x] = this.newColor;  // Красим пиксель
            this.editorService.updatePanel(panel);  // Обновляем панель
        });
    }

    // Отмена команды (восстановление старых цветов)
    undo(): void {
        this.prevColors.forEach(({ x, y, panel, prevColor }) => {
            panel.pixels[y][x] = prevColor;  // Восстанавливаем старый цвет
            this.editorService.updatePanel(panel);  // Обновляем панель
        });
    }
}
