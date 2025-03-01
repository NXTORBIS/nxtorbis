import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CarouselComponent } from './components/carousel/carousel.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, RouterModule, CarouselComponent, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'nxtorbis-site';

  constructor(private router: Router) {

  }
}
