import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectLoginPageComponent } from './redirect-login-page.component';

describe('RedirectLoginPageComponent', () => {
  let component: RedirectLoginPageComponent;
  let fixture: ComponentFixture<RedirectLoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedirectLoginPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedirectLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
