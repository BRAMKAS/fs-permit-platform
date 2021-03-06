import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidebarConfigService } from '../../../sidebar/sidebar-config.service';
import * as moment from 'moment-timezone';
import { environment } from '../../../../environments/environment';
import { MarkdownService } from 'ngx-md';
import { ChristmasTreesService } from '../../_services/christmas-trees.service';

@Component({
  selector: 'app-tree-info',
  templateUrl: './tree-guidelines.component.html'
})
export class TreeGuidelinesComponent implements OnInit {
  template: string;
  forest: any = [];
  id: any;
  sidebarItems;
  isSeasonOpen = true;
  seasonOpenAlert = 'Christmas tree season is closed and online permits are not available.';

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private christmasTreesService: ChristmasTreesService,
    private configService: SidebarConfigService,
    public markdownService: MarkdownService
  ) {}

  setSeasonStatus(forest) {
    forest.isSeasonOpen = this.isSeasonOpen;
    forest.seasonOpenAlert = this.seasonOpenAlert;

    if (forest.endDate && forest.startDate) {
      forest.isSeasonOpen = moment(forest.endDate)
        .tz(forest.timezone)
        .isAfter(moment().tz(forest.timezone));
      if (forest.isSeasonOpen) {
        forest.seasonOpenAlert = '';
        forest = this.checkSeasonStartDate(forest);
      }
    }

    forest = this.setMockAlert(forest);

    return forest;
  }

  private setMockAlert(forest) {
    // set mock data info warning if on test environment
    if (!environment.production) {
      forest.isMockData = true;
      forest.mockDataAlert = ' Note: Forest season dates are mocked for testing purposes.';
    }
    return forest;
  }

  private checkSeasonStartDate(forest) {
    if (
      moment(forest.startDate)
        .tz(forest.timezone)
        .isAfter(moment().tz(forest.timezone))
    ) {
      forest.isSeasonOpen = false;
      forest.seasonOpenAlert = `Online permits become available for purchase on ${moment(forest.startDate).format(
        'MMM. D, YYYY'
      )}.`;
    }
    return forest;
  }

  ngOnInit() {
    this.template = 'sidebar';
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.route.data.subscribe(data => {
      this.forest = data.forest;
      if (this.forest) {
        this.forest = this.setSeasonStatus(this.forest);
        if (this.forest) {
          this.christmasTreesService.updateMarkdownText(this.markdownService, this.forest);
        }

        this.titleService.setTitle(this.forest.forestName + ' | U.S. Forest Service Christmas Tree Permitting');
        this.configService.getJSON().subscribe(configData => {
          this.sidebarItems = configData;
          if (!this.forest.isSeasonOpen) {
            this.sidebarItems = this.sidebarItems.filter(item => item.type !== 'button');
          }
        });
      }
    });
  }
}
