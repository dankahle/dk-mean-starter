import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import {Init1, Init2, Init3, Init4, Init5} from '../../core/services/init-service';
import {merge} from 'rxjs/observable/merge';
import {Store} from '../../store/store';
import {Subject} from 'rxjs/Subject';
import * as _ from 'lodash';
import {BreakpointService} from "../../core/services/breakpoint.service";
import {UserService} from "../../core/services/user.service";

@Injectable()
/**
 * InitializationGuard
 * desc - provide a complex hierarchy of initialization "before" app starts up including dependecies of dependencies
 */
export class InitializationGuard implements CanActivate {
  response$ = new Subject<boolean>();

  constructor(private store: Store,
              private route: ActivatedRoute,
              private userService: UserService
              ,
              private breakpoints: BreakpointService,
              private init1: Init1,
              private init2: Init2,
              private init3: Init3,
              private init4: Init4,
              private init5: Init5) {

  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.handleCanActivate();
  }

  canActivateChild(next: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.handleCanActivate();
  }

  handleCanActivate() {

    if (this.store.initialized) {
      return true;
    } else {
      this.init();
      return this.response$;
    }


/*
    if (this.store.authenticated && this.store.initialized) {
      return true;
    } else {
      const subscription = this.store.subAuthenticated(authenticated => {
        if (authenticated && !this.store.initialized) {
          this.init();
          subscription.unsubscribe();
        }
      });
      return this.response$;
    }
*/
  }

  init() {
    // console.log('initguard start');

    Observable.forkJoin(this.userService.getAll({networkOnly: true}))
      .map(x => {
        // console.log('initguard done');
        // this.store.pub({...this.store.state, initialized: true});
        this.afterInit();
        this.response$.next(true);
        return true;
      })
      .catch(err => {
        this.response$.next(false);
        return Observable.throw(err);
      })
      .subscribe();


/*
    // an example of a complex initialization flow with dependencies of dependencies
    Observable.forkJoin(this.init1.get(), this.init2.get())
      .mergeMap(arr => {
        // arr has results of forkJoin calls in same order, this was easier with promises, this is
        // essentially the same as Promise.all().then(arr => Promise.all().then(..., just with observables now
        return Observable.forkJoin(this.init3.get(), this.init4.get());
      })
      .mergeMap(x => {
        return Observable.forkJoin(this.init5.get());
      })
      .map(x => {
        this.store.pubInitialized(true);
        this.afterInit();
        console.log('app initialized');
        this.response$.next(true);
        return true;
      })
      .catch(err => {
        this.response$.next(false);
        return Observable.throw(err);
      })
      .subscribe(); // only need this cause we're not returning this function to canActivate
*/
  }

  // initialization code that depends on the initial data loads
  afterInit() {
  }
}
