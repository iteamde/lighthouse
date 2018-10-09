// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoutingModule } from './routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { IntercomModule } from 'ng-intercom';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { AgmCoreModule } from '@agm/core';
import { MomentModule } from 'ngx-moment';
import { SlickCarouselModule } from 'ngx-slick-carousel';

// Caching
import { CacheInterceptor } from './cache.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpCacheService } from './@services/cache.service';

// Sentry logging
import * as Raven from 'raven-js';
import * as path from 'path';

// Google Firebase Modules + Config
import { environment } from '../environments/environment';
export const firebaseConfig = environment.firebaseConfig;
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';

// Custom Pipes
import { SafePipe } from './safe.pipe';
import { KeysPipe } from './keys.pipe';

// Services
import { ProjectService } from './@services/project.service';
import { FirestoreService } from './@services/firestore.service';
import { AuthService } from './@services/auth.service';
import { AuthGuard } from './@services/auth-guard.guard';

// Components
import { AppComponent } from './app.component';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { HeaderComponent } from './header/header.component';
import { ProductTileComponent } from './catalogue/product-tile/product-tile.component';
import { TestComponent } from './test/test.component';
import { ProductSingleComponent } from './catalogue/product-single/product-single.component';
import { QuoteComponent } from './quote/quote.component';
import { UserComponent } from './user/user.component';
import { BookingComponent } from './booking/booking.component';
import { AccountComponent } from './user/account/account.component';
import { BookingConfirmationComponent } from './booking/confirmation/confirmation.component';
import { MemberLevelComponent } from './user/account/member-level/member-level.component';
import { LogoutComponent } from './user/logout/logout.component';
import { ProjectsComponent } from './user/projects/projects.component';
import { SignupComponent } from './user/signup/signup.component';

// Directives
import { FireFormDirective } from './fire-form.directive';
import { ElementScrollPercentageDirective } from './element-scroll-percentage.directive';
import { DomChangeDirective } from './dom-change.directive';

// Components
import { ErrorComponent } from './error/error.component';
import { IsThisYouComponent } from './user/signup/isthisyou/isthisyou.component';
import { SearchComponent } from './search/search.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './home/home.component';
import { RemoveDashPipe } from './remove-dash.pipe';
import { ColourSpinnerComponent } from './colour-spinner/colour-spinner.component';
import { VehiclesComponent } from './catalogue/vehicles/vehicles.component';
import { VehicleTileComponent } from './catalogue/vehicles/vehicle-tile/vehicle-tile.component';
import { PackagesComponent } from './catalogue/packages/packages.component';
import { PackageTileComponent } from './catalogue/package-tile/package-tile.component';
import { AboutComponent } from './pages/about/about.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { CreditsComponent } from './pages/credits/credits.component';
import { SponsorshipComponent } from './pages/sponsorship/sponsorship.component';
import { DesktopNavComponent } from './desktop-nav/desktop-nav.component';
import { DesktopQuoteComponent } from './desktop-quote/desktop-quote.component';
import { SignUpSuccessComponent } from './user/signup/success/success.component';
import { InspirationsComponent } from './inspirations/inspirations.component';

// Raven setup (Sentry)
if (environment.production) {
  Raven.config('https://e1f4fdddf8ac4a5eacc2928bc977b54c@sentry.io/1278346', {
    // the rest of configuration
    release: '0.2.1',

    dataCallback: function(data) {
      const stacktrace = data.exception && data.exception[0].stacktrace;

      if (stacktrace && stacktrace.frames) {
        stacktrace.frames.forEach(function(frame) {
          if (frame.filename.startsWith('/')) {
            frame.filename = 'app:///' + path.basename(frame.filename);
          }
        });
      }

      return data;
    }
  }).install();
}

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    MobileMenuComponent,
    CatalogueComponent,
    HeaderComponent,
    ProductTileComponent,
    ElementScrollPercentageDirective,
    DomChangeDirective,
    ProductSingleComponent,
    QuoteComponent,
    UserComponent,
    BookingComponent,
    AccountComponent,
    LogoutComponent,
    ProjectsComponent,
    SignupComponent,
    SafePipe,
    KeysPipe,
    TestComponent,
    FireFormDirective,
    BookingConfirmationComponent,
    MemberLevelComponent,
    ErrorComponent,
    IsThisYouComponent,
    SearchComponent,
    DatepickerComponent,
    ContactComponent,
    HomeComponent,
    RemoveDashPipe,
    ColourSpinnerComponent,
    VehiclesComponent,
    VehicleTileComponent,
    PackagesComponent,
    PackageTileComponent,
    AboutComponent,
    PrivacyComponent,
    CreditsComponent,
    SponsorshipComponent,
    DesktopNavComponent,
    DesktopQuoteComponent,
    SignUpSuccessComponent,
    InspirationsComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    MomentModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    LayoutModule,
    HttpClientModule,
    RoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    GooglePlaceModule,
    IntercomModule.forRoot({
      appId: 'q12g12yk',
      updateOnRouterChange: true
    }),
    ScrollToModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCufRXKkRXxF48NKHZl8bxSMXIkqkL7-is'
    }),
    SlickCarouselModule
  ],
  providers: [
    environment.production
      ? { provide: ErrorHandler, useClass: RavenErrorHandler }
      : [],
    AuthService,
    ProjectService,
    FirestoreService,
    AngularFireAuthModule,
    AngularFireAuth,
    HttpCacheService,
    AuthGuard
    // { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
