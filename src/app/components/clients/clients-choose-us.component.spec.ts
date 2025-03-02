import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsChooseUsComponent } from './clients-choose-us.component';

describe('ClientsChooseUsComponent', () => {
  let component: ClientsChooseUsComponent;
  let fixture: ComponentFixture<ClientsChooseUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsChooseUsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsChooseUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
