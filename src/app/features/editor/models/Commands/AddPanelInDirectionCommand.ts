import {Command} from '../../service/CommandManager';
import {Direction, Panel} from '../Panel';
import {PanelStateService} from '../../service/PanelStateService';

export class AddPanelInDirectionCommand implements Command {
  private panel: Panel | null = null;

  constructor(
    private editorService: PanelStateService,
    private direction: Direction,
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
