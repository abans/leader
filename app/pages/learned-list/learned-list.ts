import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {LearnedDetailsPage} from '../learned-details/learned-details';
import * as moment from 'moment';

@Component({
  templateUrl: 'build/pages/learned-list/learned-list.html',
})

export class LearnedListPage {
  learned: any;

  constructor(private nav: NavController, navParams: NavParams) {
    this.learned = navParams.get('item');
  }

  openLearnedDetailsPage(event, item) {
    this.nav.push(LearnedDetailsPage, {
      item: item
    });
  }
}
