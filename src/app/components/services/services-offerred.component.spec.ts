import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesOfferredComponent } from './services-offerred.component';

describe('ServicesOfferredComponent', () => {
  let component: ServicesOfferredComponent;
  let fixture: ComponentFixture<ServicesOfferredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesOfferredComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesOfferredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
