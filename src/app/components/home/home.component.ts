import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive, ContactComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
