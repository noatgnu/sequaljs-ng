import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnknownModificationsComponent } from './unknown-modifications.component';

describe('UnknownModificationsComponent', () => {
  let component: UnknownModificationsComponent;
  let fixture: ComponentFixture<UnknownModificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnknownModificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnknownModificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('has a non-empty programmatic-access code sample', () => {
    expect(component.exampleCodes['programmaticAccess'].trim().length).toBeGreaterThan(0);
  });
});
