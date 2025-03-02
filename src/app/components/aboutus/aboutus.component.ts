import { Component } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import { ContactComponent } from '../contact/contact.component';
import { ClientsComponent } from '../clients/clients.component';
import { ServicesOfferredComponent } from '../services/services-offerred.component';


@Component({
  selector: 'app-aboutus',
  imports: [CarouselComponent, ContactComponent, ClientsComponent, ServicesOfferredComponent],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.css'
})
export class AboutusComponent {

}
