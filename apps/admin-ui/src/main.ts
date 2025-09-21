import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { GraphQLProviders } from './app/graphql/graphql.config';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    ...GraphQLProviders
  ]
}).catch(err => console.error(err));