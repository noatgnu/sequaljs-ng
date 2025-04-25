import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipeValuesComponent } from './pipe-values.component';

describe('PipeValuesComponent', () => {
  let component: PipeValuesComponent;
  let fixture: ComponentFixture<PipeValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipeValuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PipeValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
