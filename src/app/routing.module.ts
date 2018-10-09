import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user/user.component';
import { AccountComponent } from './user/account/account.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { BookingComponent } from './booking/booking.component';
import { ProjectsComponent } from './user/projects/projects.component';

import { AuthGuard } from './@services/auth-guard.guard';
import { SignupComponent } from './user/signup/signup.component';
import { TestComponent } from './test/test.component';
import { BookingConfirmationComponent } from './booking/confirmation/confirmation.component';
import { ProductSingleComponent } from './catalogue/product-single/product-single.component';
import { ErrorComponent } from './error/error.component';
import { IsThisYouComponent } from './user/signup/isthisyou/isthisyou.component';
import { SearchComponent } from './search/search.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './home/home.component';
import { VehiclesComponent } from './catalogue/vehicles/vehicles.component';
import { AboutComponent } from './pages/about/about.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { CreditsComponent } from './pages/credits/credits.component';
import { SponsorshipComponent } from './pages/sponsorship/sponsorship.component';
import { SignUpSuccessComponent } from './user/signup/success/success.component';
import { PackagesComponent } from './catalogue/packages/packages.component';
import { InspirationsComponent } from './inspirations/inspirations.component';

const routes: Routes = [
  {
    path: 'catalogue/vehicles',
    component: VehiclesComponent
  },
  {
    path: 'catalogue/packages/:id',
    component: PackagesComponent
  },
  {
    path: 'catalogue/:id',
    component: CatalogueComponent
  },
  {
    path: 'catalogue/:category/:id',
    component: CatalogueComponent,
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'product/:id',
    component: ProductSingleComponent
  },
  {
    path: 'error',
    component: ErrorComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'inspirations',
    component: InspirationsComponent
  },
  {
    path: 'privacy',
    component: PrivacyComponent
  },
  {
    path: 'credits',
    component: CreditsComponent
  },
  {
    path: 'sponsorship',
    component: SponsorshipComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'isthisyou',
    component: IsThisYouComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'signup/success',
    component: SignUpSuccessComponent
  },
  {
    path: 'login',
    component: UserComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'test',
    component: TestComponent
  },
  {
    path: 'search/:search',
    component: SearchComponent
  },
  {
    path: 'user/account',
    component: AccountComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user/projects',
    component: ProjectsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'booking',
    component: BookingComponent
  },
  {
    path: 'booking/confirmation',
    component: BookingConfirmationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class RoutingModule {}
