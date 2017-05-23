import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ApplicationNoncommercialGroupService {

  private postEndpoint = 'https://fs-intake-api-staging.app.cloud.gov/permits/applications/special-uses/noncommercial/';

  constructor (private http: Http) {}

  create(data) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.postEndpoint, data, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    const body = res.json();
    return body.data || { };
  }

  private handleError (error: Response | any) {
    let errors: any;
    if (error instanceof Response) {
      const body = error.json() || '';
      errors = body.errors;
    } else {
      errors = ['Server error'];
    }
    console.error(errors);
    return Observable.throw(errors);
  }
}
