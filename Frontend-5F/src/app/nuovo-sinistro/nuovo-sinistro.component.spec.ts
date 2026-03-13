import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuovoSinistroComponent } from './nuovo-sinistro.component';
import { Sinistri } from '../services/sinistri';
import { of, throwError } from 'rxjs';
import { sinistro } from '../models/sinistro.model';

class MockSinistri {
  sinistri: sinistro[] = [];
  askSinistri() {}
  createSinistro(automobilista_id: number, targa: string, data_evento: Date, descrizione: string) {
    const s: any = { id_automobilista: automobilista_id, targa, data_evento, descrizione, stato: 'APERTO', data_creazione: new Date() };
    this.sinistri.push(s);
    return of(s);
  }
}

describe('NuovoSinistroComponent', () => {
  let component: NuovoSinistroComponent;
  let fixture: ComponentFixture<NuovoSinistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuovoSinistroComponent],
      providers: [{ provide: Sinistri, useClass: MockSinistri }]
    }).compileComponents();

    fixture = TestBed.createComponent(NuovoSinistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct icons and colors in the template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const titleIcon = compiled.querySelector('h2 i.bi-shield-plus');
    expect(titleIcon).toBeTruthy();
    const title = compiled.querySelector('h2');
    expect(title?.classList.contains('text-[#09637E]')).toBe(true);

    const buttonIcon = compiled.querySelector('button[type="submit"] i.bi-send-fill');
    expect(buttonIcon).toBeTruthy();
  });

  it('should add a sinistro to the list and reset form on submit', () => {
    // prepare form data
    component.formData.automobilista_id = 123;
    component.formData.targa = 'AA111BB';
    component.formData.data_evento = '2025-01-01';
    component.formData.descrizione = 'Test';

    // select a vehicle so targa is set (component already has vehicles array)
    component.selectVehicle(component.vehicles[0]);

    expect(component.sinistriList.length).toBe(0);
    component.submit();
    fixture.detectChanges();

    // list should be updated immediately
    expect(component.sinistriList.length).toBe(1);
    expect(component.sinistriList[0].targa).toBe('AA111BB');

    // form should be reset
    expect(component.formData.automobilista_id).toBe(0);
    expect(component.formData.targa).toBe('');
    expect(component.formData.data_evento).toBe('');
    expect(component.formData.descrizione).toBe('');
  });

  it('should push into service.sinistri when submitting (integration)', () => {
    // use a simple mock service instance so we can inspect its sinistri array
    const mockSinistri: any = { sinistri: [], askSinistri: () => {}, createSinistro: () => of({}) };
    TestBed.overrideProvider(Sinistri, { useValue: mockSinistri });

    const localFixture = TestBed.createComponent(NuovoSinistroComponent);
    const localComponent = localFixture.componentInstance;
    localFixture.detectChanges();

    localComponent.formData.automobilista_id = 42;
    localComponent.formData.targa = 'MM222NN';
    localComponent.formData.data_evento = '2025-11-11';
    localComponent.formData.descrizione = 'integration test';
    localComponent.selectVehicle(localComponent.vehicles[0]);

    expect(mockSinistri.sinistri.length).toBe(0);
    localComponent.submit();
    localFixture.detectChanges();
    expect(mockSinistri.sinistri.length).toBe(1);
    expect(mockSinistri.sinistri[0].targa).toBe('MM222NN');
  });

  it('should still push sinistro even when service errors', () => {
    // override provider with one that fails
    const errorService = new MockSinistri();
    // override service method without jasmine.spy to avoid typings issues
    errorService.createSinistro = () => throwError(() => new Error('fail'));
    TestBed.overrideProvider(Sinistri, { useValue: errorService });
    const localFixture = TestBed.createComponent(NuovoSinistroComponent);
    const localComponent = localFixture.componentInstance;
    localFixture.detectChanges();

    localComponent.formData.automobilista_id = 1;
    localComponent.formData.targa = 'ZZ999YY';
    localComponent.formData.data_evento = '2025-12-31';
    localComponent.formData.descrizione = 'Oops';
    localComponent.selectVehicle(localComponent.vehicles[0]);

    expect(localComponent.sinistriList.length).toBe(0);
    localComponent.submit();
    localFixture.detectChanges();

    expect(localComponent.sinistriList.length).toBe(1);
    expect(localComponent.sinistriList[0].stato).toBe('SIMULAZIONE');
    expect(localComponent.errorMessage).toContain('fail');
  });
});
