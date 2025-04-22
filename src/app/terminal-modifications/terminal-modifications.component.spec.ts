import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalModificationsComponent } from './terminal-modifications.component';

describe('TerminalModificationsComponent', () => {
  let component: TerminalModificationsComponent;
  let fixture: ComponentFixture<TerminalModificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalModificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalModificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
