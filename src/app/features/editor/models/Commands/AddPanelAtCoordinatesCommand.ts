import {Command} from '../../service/CommandManager';
import {Panel} from '../Panel';
import {EditorStateService} from '../../service/editor-state.service';

export class AddPanelAtCoordinatesCommand implements Command {
  private panel: Panel | null = null;

  constructor(
    private editorService: EditorStateService,
    private gridX: number,
    private gridY: number,
    private panelSize: number,
    private virtualGridWidth: number,
    private virtualGridHeight: number
  ) {}

  do(): void {
    const success = this.editorService.addPanelAtCoordinates(this.gridX, this.gridY,
      this.virtualGridWidth, this.virtualGridHeight, this.panelSize);
    if (success) {
      const panels = this.editorService.panels;
      this.panel = panels[panels.length - 1];
    }
  }

  undo(): void {
    if (this.panel) {
      this.editorService.removePanel(this.panel.id);
    }
  }
}
