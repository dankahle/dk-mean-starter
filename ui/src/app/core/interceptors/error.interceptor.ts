import {Injectable} from '@angular/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ProgressService} from '../services/common/progress.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ErrorModalComponent} from '../../shared/dialogs/error-modal/error-modal.component';
import {Router} from '@angular/router';
import {errorCodes} from '../services/common/error-codes';
import * as _ from 'lodash';
import {environment} from '../../../environments/environment';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  // if in this list, then no error modal
  whiteList = [
    // how to bypass errors for specific paths
    // todo: determine what pathing will look like for non-local use, for whitelisting errors
    // {status: 404, methods: ['GET', 'POST'], url: new RegExp(`^${environment.apiUrl}api/login`)},
  ];

  constructor(private progressService: ProgressService, public dialog: MatDialog, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .do(event => {
      })
      .catch(resp => {
        this.progressService.hideProgressBar();

        let err;
        if (resp.error && resp.error.errorCode) {
          err = resp.error;
        } else if (resp.error && resp.error.error) {
          err = resp.error.error;
          if (!resp.error.error.errorCode) {
            err.errorCode = errorCodes.server_prefix + errorCodes.server_unknown_error;
          }
        } else if (resp.error.errors && resp.error.errors.length) {
          if (resp.error.errors.length === 1) {
            err = {message: resp.error.errors[0].message};
          } else {
            err = {
              message: 'graphql errors',
              data: resp.error.errors.map(err => err.message).join('\n')
            }
          }
        } else {
          err = {
            message: 'Unknown server error',
            data: {
              message: resp.message,
              url: resp.url,
              status: resp.status
            },
            errorCode: errorCodes.server_prefix + errorCodes.server_unknown_error
          };
        }

        if (this.whiteListed(resp, req.method)) {
          return Observable.throw(err);
        }

        if (err.errorCode === errorCodes.server_prefix + errorCodes.user_not_authenticated) {
          this.router.navigateByUrl('/login');
        }

        const config = <MatDialogConfig> {
          data: {error: err},
          width: '600px',
          backdropClass: 'bg-modal-backdrop'
        };
        this.dialog.open(ErrorModalComponent, config)
          .afterClosed()
          .subscribe(result => {
            // if (resp.error && resp.error.errorCode === 'xxx-xxxx') {
            //   this.router.navigateByUrl('/');
            // }
          });
        return Observable.throw(err);
      });
  }

  /**
   * whiteListed
   * @desc - Some 404's are an error (unexpected), while others are handled in the code (expected). We'll whitelist
   * the expected ones so we won't get an error modal in that case. We could just pass a parameter to show no errors, but
   * that only applies to expected errors, and even then we may want to show 400 but nto 404
   * @param resp
   * @param method
   * @returns {boolean}
   */
  whiteListed(resp, method) {
    let found = false;
    this.whiteList
      .forEach(item => {
        if (resp.status === item.status && _.includes(item.methods, method) && item.url.test(resp.url)) {
          found = true;
        }
      });
    return found;
  }

}


