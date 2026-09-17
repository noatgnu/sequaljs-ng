import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalModificationsComponent } from './global-modifications.component';

describe('GlobalModificationsComponent', () => {
  let component: GlobalModificationsComponent;
  let fixture: ComponentFixture<GlobalModificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalModificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalModificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
