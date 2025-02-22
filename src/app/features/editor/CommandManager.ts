class CommandManager {
  private doneCommands: Command[] = [];
  private undoneCommands: Command[] = [];

  execute(command: Command) {
    command.do();
    this.doneCommands.push(command);
    // после нового действия всё, что было в undone, обнуляем
    this.undoneCommands = [];
  }

  undo() {
    const cmd = this.doneCommands.pop();
    if (!cmd) return;
    cmd.undo();
    this.undoneCommands.push(cmd);
  }

  redo() {
    const cmd = this.undoneCommands.pop();
    if (!cmd) return;
    cmd.do();  // повторяем действие
    this.doneCommands.push(cmd);
  }
}

export interface Command {
  do(): void;
  undo(): void;
}
