import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FilterPipe } from '../../../../_pipes/filter.pipe';
import { forest } from '../../../../_mocks/forest.mock';
import { TreeCuttingDatesComponent } from './tree-cutting-dates.component';
import { Pipe, PipeTransform } from '@angular/core';
import { LineBreakFormatterPipe } from '../../../../_pipes/line-break-formatter.pipe';
import * as sinon from 'sinon';
import { WindowRef } from '../../../../_services/native-window.service';
import { MarkdownService } from 'ngx-md';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TreeCuttingDatesComponent', () => {
  let component: TreeCuttingDatesComponent;
  let fixture: ComponentFixture<TreeCuttingDatesComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          TreeCuttingDatesComponent,
          FilterPipe,
          LineBreakFormatterPipe
        ],
        providers: [WindowRef, MarkdownService],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [HttpClientTestingModule]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeCuttingDatesComponent);
    component = fixture.componentInstance;
    component.forest = forest;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



});
