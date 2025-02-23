import {Command} from '../../service/CommandManager';
import {Panel} from '../Panel';
import {EditorStateService} from '../../service/editor-state.service';

export class AddPanelInDirectionCommand implements Command {
  private panel: Panel | null = null;

  constructor(
    private editorService: EditorStateService,
    private direction: 'L' | 'R' | 'T' | 'B',
    private virtualGridWidth: number,
    private virtualGridHeight: number,
    private panelSize: number
  ) {
  }

  do(): void {
    const success = this.editorService.addPanelInDirection(this.direction, this.virtualGridWidth,
      this.virtualGridHeight, this.panelSize);
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
