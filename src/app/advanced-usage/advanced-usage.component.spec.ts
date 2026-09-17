import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedUsageComponent } from './advanced-usage.component';

describe('AdvancedUsageComponent', () => {
  let component: AdvancedUsageComponent;
  let fixture: ComponentFixture<AdvancedUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedUsageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
