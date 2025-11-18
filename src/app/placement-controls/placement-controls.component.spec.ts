import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementControlsComponent } from './placement-controls.component';

describe('PlacementControlsComponent', () => {
  let component: PlacementControlsComponent;
  let fixture: ComponentFixture<PlacementControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacementControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacementControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
