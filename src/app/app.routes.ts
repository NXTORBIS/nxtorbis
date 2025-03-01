import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ProductsComponent } from './components/products/products.component';
import { ContactComponent } from './components/contact/contact.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { PricingComponent } from './components/pricing/pricing.component';


export const routes: Routes = [ { path: '', component: HomeComponent, pathMatch: 'full' },
{ path: 'about', component: AboutComponent },
{ path: 'products', component: ProductsComponent },
{ path: 'contact', component: ContactComponent },
{ path: 'pricing', component: PricingComponent }
];
