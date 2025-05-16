 // путь подстрой под свой проект
import { take } from 'rxjs/operators';
 import {PanelStateService} from '../PanelStateService';
 import {Direction, Panel} from '../../models/Panel';

describe('PanelStateService', () => {
  let service: PanelStateService;

  beforeEach(() => {
    service = new PanelStateService();
  });

  const createPanel = (id: string, x = 0, y = 0): Panel => ({
    id,
    x,
    y,
    direction: Direction.Top,
    pixels: Array(8).fill(Array(8).fill('#000000')),
  });

  it('should add a panel to the list', () => {
    const panel = createPanel('panel-1');
    service.addPanel(panel);

    // @ts-ignore — если panels приватный
    expect(service['panels'].length).toBe(1);
    // @ts-ignore
    expect(service['panels'][0]).toEqual(panel);
  });

  it('should emit new panel list after addPanel is called', (done) => {
    const panel = {
      id: 'panel-2',
      x: 0,
      y: 0,
      direction: Direction.Top,
      pixels: Array(8).fill(Array(8).fill('#000000'))
    };

    service.addPanel(panel); // сначала добавляем

    service.panels$.pipe(take(1)).subscribe(panels => {
      expect(panels.length).toBe(1);
      expect(panels[0]).toEqual(panel);
      done();
    });
  });

});
