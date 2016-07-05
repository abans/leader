import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {MemberGroupPage} from '../member-group/member-group';

@Component({
  templateUrl: 'build/pages/grading-list/grading-list.html',
})
export class GradingListPage {
  schedules: any;
  constructor(private nav: NavController, private navParams: NavParams) {
    this.nav = nav;
    this.schedules = navParams.get('item'); 
  }

  openMemberGroupPage(event, team) {
    this.nav.push(MemberGroupPage, {item:team});
  }

  openValuator() {
    window.open('https://www.ibeatop.com/h5/valuator');
  }
}
