import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { TreePermitViewComponent } from './tree-permit-view.component';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { ChristmasTreesApplicationService } from '../../../trees/_services/christmas-trees-application.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as sinon from 'sinon';
import { UtilService } from '../../../_services/util.service';
import { WindowRef } from '../../../_services/native-window.service';
import { McBreadcrumbsService, McBreadcrumbsModule, McBreadcrumbsConfig } from 'ngx-breadcrumbs';
import { BreadcrumbsComponent } from '../../../breadcrumbs/breadcrumbs.component';

describe('TreePermitViewComponent', () => {
  let component: TreePermitViewComponent;
  let fixture: ComponentFixture<TreePermitViewComponent>;
  const mockActivatedRoute = {
    data: Observable.of({
      permit: {
        permitId: '123',
        totalCost: 0,
        quantity: 0,
        emailAddress: '',
        forest: { forestName: 'Mt Hood', forestAbbr: 'mthood' }
      }
    })
  };

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, McBreadcrumbsModule, HttpClientTestingModule],
        declarations: [TreePermitViewComponent, BreadcrumbsComponent],
        providers: [
          McBreadcrumbsService,
          McBreadcrumbsConfig,
          UtilService,
          { provide: ChristmasTreesApplicationService },
          { provide: WindowRef, useClass: WindowRef }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: mockActivatedRoute });
    fixture = TestBed.createComponent(TreePermitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set forest on init', () => {
    expect(component.forest.forestName).toEqual('Mt Hood');
  });

  it('should set permit on init', () => {
    expect(component.permit.permitId).toEqual('123');
  });

  it('should process error', () => {
    component.processError([{ error: 'test' }]);
    expect(component.error).toEqual([{ error: 'test' }]);
  });
});
