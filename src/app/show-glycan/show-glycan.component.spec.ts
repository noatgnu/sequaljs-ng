import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowGlycanComponent } from './show-glycan.component';

describe('ShowGlycanComponent', () => {
  let component: ShowGlycanComponent;
  let fixture: ComponentFixture<ShowGlycanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowGlycanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowGlycanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
