import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UtilService } from '../../_services/util.service';
import * as moment from 'moment-timezone';

@Injectable()
export class ChristmasTreesApplicationService {
  private endpoint = environment.apiUrl + 'forests/christmas-trees';
  private adminEndpoint = environment.apiUrl + 'admin/christmas-trees';

  constructor(private http: HttpClient, public router: Router, public util: UtilService) {}

  create(body, multipart = false) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (multipart) {
      headers = new HttpHeaders().set('Content-Type', 'application/json').set('enctype', 'multipart/form-data');
    }

    const options = {
      withCredentials: true,
      headers: headers
    };

    return this.http.post(`${this.endpoint}/permits`, body, options).catch(this.util.handleError);
  }

  cancelOldApp(id) {
    const body = { permitId: id, status: 'Cancelled' };
    return this.http.put(`${this.endpoint}/permits`, body).catch(this.util.handleError);
  }

  getOne(id, token) {
    return this.http
      .get(`${this.endpoint}/permits/${id}`, { params: new HttpParams().set('t', token) })
      .catch(this.util.handleError);
  }

  getDetails(id) {
    return this.http.get(`${this.endpoint}/permits/${id}/details`).catch(this.util.handleError);
  }

  getPrintablePermit(id, includeRules = false) {
    const requests = [];
    requests.push(this.getPermitRequest(id, false));
    if (includeRules) {
      requests.push(this.getPermitRequest(id, true));
    }
    return forkJoin(requests);
  }

  getPermitRequest(id, rules = false) {
    let queryParam = 'permit=true';
    if (rules) {
      queryParam = 'rules=true';
    }
    return this.http.get(`${this.endpoint}/permits/${id}/print?${queryParam}`).catch(this.util.handleError);
  }

  getAllByDateRange(forestId, startDate, endDate) {
    return this.http
      .get(`${this.adminEndpoint}/permits/${forestId}/${startDate}/${endDate}`, { withCredentials: true })
      .catch(this.util.handleError);
  }

  getReportByPermitNumber(permitNumber) {
    return this.http
      .get(`${this.adminEndpoint}/permits/${permitNumber}`, { withCredentials: true })
      .catch(this.util.handleError);
  }

  updateSeasonDates(forestId, startDate, endDate) {
    const body = { startDate: startDate, endDate: endDate };
    return this.http
      .put(`${this.adminEndpoint}/forests/${forestId}`, body, { withCredentials: true })
      .catch(this.util.handleError);
  }

  updateDistrictDates(forest, districtName, startDate, endDate) {
    const cuttingAreas = Object.assign({}, forest.cuttingAreas);
    const format = 'YYYY-MM-DDTHH:mm:ss';

    const tzStartDate = moment.tz(startDate, format, forest.timezone);
    tzStartDate.utc();

    const tzEndDate = moment.tz(endDate, format, forest.timezone);
    tzEndDate.utc();

    cuttingAreas[districtName].startDate = tzStartDate.format(format) + 'Z';
    cuttingAreas[districtName].endDate = tzEndDate.format(format) + 'Z';

    const body = { cuttingAreas: cuttingAreas };

    return this.http
      .put(`${this.adminEndpoint}/forests/${forest.id}`, body, { withCredentials: true })
      .catch(this.util.handleError);
  }

  resolverError(errors, route) {
    for (const error of errors) {
      if (error && error.status === 404) {
        this.router.navigate([route]);
      }
      return Observable.of({ error: error });
    }
    return Observable.of(errors);
  }
}
