import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigurationCardComponent } from './configuration-card.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ConfigurationCardComponent', () => {
  let component: ConfigurationCardComponent;
  let fixture: ComponentFixture<ConfigurationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ConfigurationCardComponent,      // standalone-компонент
      ],
      providers: [
        provideRouter([]),               // для ActivatedRoute/Router
        provideHttpClient(),             // для HttpClient
      ],
      schemas: [NO_ERRORS_SCHEMA],       // игнорировать дочерние теги/директивы
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigurationCardComponent);
    component = fixture.componentInstance;

    // 👇 Здесь задаём обязательный @Input() config до первого detectChanges()
    component.config = {
      useMiniPreview: true,                             // булево для метода getPreviewUrl
      previewImageUrl: 'https://example.com/full.png',  // URL полного превью
      miniPreviewImageUrl: 'https://example.com/mini.png',
      title: 'Test Configuration',
      description: 'Lorem ipsum',
      publicId: 'cfg-123',
      // … если есть другие @Input()-поля, их тоже нужно указать
    } as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
