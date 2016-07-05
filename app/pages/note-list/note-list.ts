import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

/*
  Generated class for the NoteListPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/note-list/note-list.html',
})
export class NoteListPage {
  todayNotes: any;
  tomorrowNotes: any;
  afterTomorrowNotes: any;
  showTomorrowNotesAll: boolean;
  showAfterTomorrowNotesAll: boolean;

  constructor(private nav: NavController, private navParams: NavParams) {
    this.nav = nav;
    this.todayNotes= navParams.get('today'); 
    this.tomorrowNotes= navParams.get('tomorrow'); 
    this.afterTomorrowNotes = navParams.get('afterTomorrow'); 
    this.showTomorrowNotesAll = false;
    this.showAfterTomorrowNotesAll = false;
  }
}
