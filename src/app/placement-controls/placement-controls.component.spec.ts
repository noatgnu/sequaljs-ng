import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PlacementControlsComponent } from './placement-controls.component';

describe('PlacementControlsComponent', () => {
  let component: PlacementControlsComponent;
  let fixture: ComponentFixture<PlacementControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacementControlsComponent],
      providers: [
        provideHttpClient(withXhr()),
        provideHttpClientTesting(),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacementControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('parses a global mod with a position constraint and limit', () => {
    component.setExample('combined');
    expect(component.parsedSequence.toStrippedString()).toBe('MTPEILTCNSIGCLKG');
    const globalMod = component.parsedSequence.globalMods[0];
    expect(globalMod.getPositionConstraint()).toBeTruthy();
    expect(globalMod.getLimitPerPosition()).toBe(1);
  });

  it('displays position constraint and limit correctly in the parsed output (previously always null)', () => {
    component.setExample('combined');
    const globalModsInfo = JSON.parse(component.output).globalMods;
    expect(globalModsInfo[0].positionConstraint).toBeTruthy();
    expect(globalModsInfo[0].limitPerPosition).toBe(1);
  });
});
