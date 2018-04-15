import {Component, HostBinding} from "@angular/core";
import {environment} from "../environments/environment";

@Component({
  selector: 'dk-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostBinding('@.disabled') animationsDisabled = environment.disableAnimations;
  @HostBinding('class.notransition') transitionDisabled = environment.disableAnimations;
  title = 'dk-mean-starter';
}
