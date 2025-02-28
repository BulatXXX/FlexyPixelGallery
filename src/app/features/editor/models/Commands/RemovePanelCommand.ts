import { Panel } from '../Panel';
import { EditorStateService } from '../../service/EditorState.service';
import { Command } from '../../service/CommandManager';

export class RemovePanelCommand implements Command {
  private removedPanel: Panel | null = null;
  private removedPanelIndex: number = -1;

  constructor(
    private editorService: EditorStateService,
    private panel: Panel
  ) {}

  do(): void {
    const panels = this.editorService.panels;
    this.removedPanelIndex = panels.findIndex(p => p.id === this.panel.id);
    if (this.removedPanelIndex !== -1) {
      this.removedPanel = this.panel;
      this.editorService.removePanel(this.panel.id);
    }
  }

  undo(): void {
    if (this.removedPanel) {
      this.editorService.insertPanelAt(this.removedPanel, this.removedPanelIndex);
    }
  }
}
