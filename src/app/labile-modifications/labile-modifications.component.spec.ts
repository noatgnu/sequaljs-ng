import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabileModificationsComponent } from './labile-modifications.component';

describe('LabileModificationsComponent', () => {
  let component: LabileModificationsComponent;
  let fixture: ComponentFixture<LabileModificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabileModificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabileModificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('accepts a basic non-Glycan labile modification (previously rejected)', () => {
    component.setExample('basicNonGlycan');
    expect(component.parsedOutput).not.toContain('Error');
    expect(component.parsedOutput).toContain('Phospho');
  });
});
