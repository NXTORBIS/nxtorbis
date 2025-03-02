import { Component } from '@angular/core';
import { ServicesOfferredComponent } from './services-offerred.component';
import { ClientsChooseUsComponent } from '../clients/clients-choose-us.component';

@Component({
  selector: 'app-services',
  imports: [ServicesOfferredComponent, ClientsChooseUsComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {

}
