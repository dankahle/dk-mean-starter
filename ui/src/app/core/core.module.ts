import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Store} from "../store/store";
import {ProgressService} from "./services/progress.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {SpinnerInterceptor} from "./interceptors/spinner.interceptor";
import {TimingInterceptor} from "./interceptors/timing.interceptor";
import {ErrorInterceptor} from "./interceptors/error.interceptor";
import {Init1, Init2, Init3, Init4, Init5} from "./services/init-service";
import {ModifyRequestInterceptor} from "./interceptors/modify-request.interceptor";
import {InitializationGuard} from "../routing/guards/initialization.guard";
import {RouterModule} from "@angular/router";
import {StoreModule} from "../store/store.module";
import {BreakpointService} from "./services/breakpoint.service";
import {Apollo, ApolloModule} from "apollo-angular";
import {HttpLink} from "apollo-angular-link-http";
import {environment} from "../../environments/environment";
import {InMemoryCache} from "apollo-cache-inmemory";
import {DefaultOptions} from "apollo-client/ApolloClient";
import {UserServiceRest} from "./services/user-service-rest";
import {UserService} from "./services/user.service";

// working with the apollo cache is somewhat complicated and error prone. You require cache resolvers and
// query updates on add/delete mutations to make it work. We don't have much to get so until the use
// case presents itself, we'll simplify things with no-cache, i.e. all queries will go to the server for now
// (use apollo.query instead of apollo.watchQuery), and nothing will be cached (no reason then).
// If on the other hand, you wish to implement this, then this bookeeping is required and if watchQuery is used
// it will notify the subscribers on any mutation.
// https://www.apollographql.com/docs/angular/features/cache-updates.html#cacheRedirect
// https://www.apollographql.com/docs/angular/features/cache-updates.html
const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache'
  },
  query: {
    fetchPolicy: 'no-cache'
  },
  mutate: {
  },
};

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    StoreModule
  ],
  exports: [HttpClientModule, StoreModule],
  providers: [Store, Init1, Init2, Init3, Init4, Init5, ProgressService,
    {provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: TimingInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ModifyRequestInterceptor, multi: true},
    BreakpointService, UserServiceRest, UserService,
    InitializationGuard
  ]
})
export class CoreModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    apollo.create({
      link: httpLink.create({uri: environment.apiUrl + '/api/graphql'}),
      cache: new InMemoryCache(),
      defaultOptions
    });
  }
}
