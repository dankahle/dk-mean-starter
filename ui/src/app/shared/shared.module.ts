import {forwardRef, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {ForbiddenNameValidator} from './validators/forbidden-name.validator';
import {MinValidator} from './validators/min.validator';
import {MaxValidator} from './validators/max.validator';
import {MaterialIndexModule} from './material-index/material-index.module';
import {ProgressComponent} from './components/progress/progress.component';
import {ErrorModalComponent} from './dialogs/error-modal/error-modal.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { NotImplementedComponent } from './dialogs/not-implemented/not-implemented.component';
import {TrimInputValueAccessor} from './accessors/trim-input-value.accessor';
import {RoutingModule} from "../routing/routing.module";
import {ApolloModule} from 'apollo-angular';
import {HttpLinkModule} from 'apollo-angular-link-http';

@NgModule({
  imports: [
    CommonModule,
    MaterialIndexModule,
    FlexLayoutModule,
    FormsModule,
    RoutingModule,
    ApolloModule,
    HttpLinkModule
  ],
  declarations: [PageNotFoundComponent, ForbiddenNameValidator, MinValidator, MaxValidator, ProgressComponent, ErrorModalComponent,
    NotImplementedComponent, TrimInputValueAccessor],
  exports: [
    MaterialIndexModule, FlexLayoutModule, RoutingModule, FormsModule, ApolloModule, HttpLinkModule,
    PageNotFoundComponent, ForbiddenNameValidator, MinValidator, MaxValidator, ProgressComponent, ErrorModalComponent,
    NotImplementedComponent, TrimInputValueAccessor],
  entryComponents: [ErrorModalComponent, NotImplementedComponent]
})
export class SharedModule {
}
