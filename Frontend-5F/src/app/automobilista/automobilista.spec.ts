import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Automobilista } from './automobilista';
import { sinistro } from '../models/sinistro.model';
import { Sinistri } from '../services/sinistri';

class MockSinistri {
  sinistri: sinistro[] = [];
  askSinistri() {}
}

describe('Automobilista', () => {
  let component: Automobilista;
  let fixture: ComponentFixture<Automobilista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Automobilista],
      providers: [{ provide: Sinistri, useClass: MockSinistri }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Automobilista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header icons and link icons correctly', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1 i.bi-person-badge')).toBeTruthy();
    expect(compiled.querySelector('button i.bi-plus-lg')).toBeTruthy();
    expect(compiled.querySelector('h2 i.bi-stack')).toBeTruthy();
    expect(compiled.querySelector('button .bi-arrow-right-short')).toBeTruthy();
  });

  it('should push new sinistro on created event and mark simulation when non-aperto', () => {
    const sample: sinistro = { id_automobilista: 1, targa: 'XX', data_evento: new Date(), descrizione: 'x', stato: 'APERTO', data_creazione: new Date() } as any;
    expect(component.sinistriList.length).toBe(0);
    component.onSinistroCreated(sample);
    expect(component.sinistriList.length).toBe(1);
    expect(component.sinistriList[0].stato).toBe('APERTO');

    const sample2: sinistro = { id_automobilista: 2, targa: 'YY', data_evento: new Date(), descrizione: 'y', stato: 'ERROR', data_creazione: new Date() } as any;
    component.onSinistroCreated(sample2);
    expect(component.sinistriList.length).toBe(2);
    expect(component.sinistriList[1].stato).toBe('SIMULAZIONE');
  });

  it('should render sinistri provided by Sinistri service', () => {
    // prepare a mock service instance with prepopulated sinistri
    const mockSinistri: any = {
      sinistri: [
        { id_automobilista: 7, targa: 'TT111ZZ', data_creazione: new Date(), descrizione: 'desc', stato: 'APERTO' }
      ],
      askSinistri: () => {}
    };

    TestBed.overrideProvider(Sinistri, { useValue: mockSinistri });
    const localFixture = TestBed.createComponent(Automobilista);
    localFixture.detectChanges();
    const compiled = localFixture.nativeElement as HTMLElement;

    const card = compiled.querySelector('[data-test-sinistro]');
    expect(card).toBeTruthy();
    expect(card?.textContent).toContain('TT111ZZ');
  });
});
