import {Command} from '../../CommandManager';
import {EditorStateService} from '../../service/editor-state.service';

export class MovePanelCommand implements Command {
  constructor(
    private editorState: EditorStateService,
    private panelId: string,
    private oldX: number,
    private oldY: number,
    private newX: number,
    private newY: number
  ) {}

  do() {
    this.editorState.movePanel(this.panelId, this.newX, this.newY);
  }

  undo() {
    this.editorState.movePanel(this.panelId, this.oldX, this.oldY);
  }
}
