import {Command} from '../../CommandManager';
import {EditorStateService} from '../../service/editor-state.service';
import {Panel} from '../Panel';

export class AddPanelCommand implements Command {


  constructor(
    private editorState: EditorStateService,
    private panelX: number,
    private panelY: number,
    private addedPanelId: string
  ) {
  }

  do() {
    // создаём панель
    const newId = this.generateId();
    this.addedPanelId = newId;
    const newPanel: Panel = {
      id: newId,
      x: this.panelX,
      y: this.panelY,
      width: 8,
      height: 8,
      pixels: this.createEmptyPixels(8, 8)
    };
    this.editorState.addPanel(newPanel);
  }

  undo() {
    // удаляем добавленную панель
    this.editorState.removePanel(this.addedPanelId);
  }

  private generateId(): string {
    return 'panel-' + Math.random().toString(36).substr(2, 9);
  }

  private createEmptyPixels(w: number, h: number): string[][] {
    // генерируем массив строк вида [["#ffffff", "#ffffff"...], [...]]
    return Array(h).fill(null).map(() =>
      Array(w).fill('#ffffff')
    );
  }
}
