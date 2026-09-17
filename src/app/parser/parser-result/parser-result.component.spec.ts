import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParserResultComponent } from './parser-result.component';

describe('ParserResultComponent', () => {
  let component: ParserResultComponent;
  let fixture: ComponentFixture<ParserResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParserResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParserResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
