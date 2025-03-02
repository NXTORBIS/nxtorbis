import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
// import { AboutComponent } from './components/about/about.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { ProductsComponent } from './components/products/products.component';
import { ServicesComponent } from './components/services/services.component';
import { ContactComponent } from './components/contact/contact.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { PricingComponent } from './components/pricing/pricing.component';


export const routes: Routes = [ { path: '', pathMatch: 'full', redirectTo: 'home' },
{path: 'home', component: AboutusComponent},
{ path: 'about', component: HomeComponent },
{ path: 'products', component: ProductsComponent },
{ path: 'services', component: ServicesComponent },
{ path: 'contact', component: ContactComponent },
{ path: 'pricing', component: PricingComponent }
];
