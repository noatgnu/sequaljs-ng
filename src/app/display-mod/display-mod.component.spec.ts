import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayModComponent } from './display-mod.component';

describe('DisplayModComponent', () => {
  let component: DisplayModComponent;
  let fixture: ComponentFixture<DisplayModComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayModComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
