import {Component} from '@angular/core';
import {Alert, NavController, Config, Storage, LocalStorage} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {LearnedListPage} from '../learned-list/learned-list';
import {LearnedDetailsPage} from '../learned-details/learned-details';
import {GradingListPage} from '../grading-list/grading-list';
import {MemberGroupPage} from '../member-group/member-group';
import {NoteListPage} from '../note-list/note-list';
import {HomeService} from '../../providers/home-service/home-service';
import * as moment from 'moment';

@Component({
  templateUrl: 'build/pages/leader/leader.html',
  providers: [HomeService]
})
export class LeaderPage {
  learned: any;//领队心得
  todayLearnedIndex: any;
  today: string;
  tempDate: string;
  ongoing: boolean;
  grading: Array<Object>; //评分列表
  schedules: any;
  group: any;
  notes: any;
  response: any;
  todayNotes: any;
  tomorrowNotes: any;
  afterTomorrowNotes: any;
  local: any;
  loaded: boolean;

  constructor(public nav: NavController, 
              public config: Config,
              public homeService: HomeService) {
    this.nav = nav;
    this.loaded = false;
    this.local = new Storage(LocalStorage);
    this.initializeParams();
    this.initLearned();
    this.initializeLeaderPage();
  }

  initializeParams() {
    this.today = moment().format('YYYY-MM-DD');
    this.ongoing = false;
    this.grading = [];
    this.schedules = [];
    this.todayNotes = [];
    this.notes = {};
    this.tomorrowNotes = [];
    this.afterTomorrowNotes = [];
    this.group = {};
  }

  initLearned() {
    this.learned = [];
    this.todayLearnedIndex = -1;
  }

  ionViewWillEnter() {
    if(this.loaded) {
      this.initializeLeaderPage();
    }
  }

  initializeLeaderPage() {
    if(this.config.get('HASH')) {
      this.homeService.load()// 0 : load,  1:reload
      .then(data => {
        if(this.loaded) {
          this.initializeParams();
        }
        this.group = data;
        if(!this.group.err && this.group) {
          if(this.group.schedule) {
            this.schedules = this.group.schedule;
          } else {
            console.warn('It seems schedules is empyt.'); 
          }

          this.ongoing = moment(moment(this.group.schedule_start).format('YYYY-MM-DD')) <= moment(moment().format('YYYY-MM-DD'));
          this.schedules.forEach((schedule) => {
            if(this.grading.length && schedule.date == this.tempDate) {
              this.grading.push(schedule);
            }
            if(!this.grading.length && moment(schedule.date) >= moment(this.today)) {
              this.tempDate = schedule.date;  
              this.grading.push(schedule);
            }
          });
          
          for(let i in this.group.matters) {
            if(this.group.matters[i][0].date == this.today) {
              this.todayNotes = this.group.matters[i];
            } else if (this.group.matters[i][0].date == moment().add(1, 'days').format('YYYY-MM-DD')) {
              this.tomorrowNotes = this.group.matters[i];
            } else if (moment(moment().add(1, 'days').format('YYYY-MM-DD')).isBefore(this.group.matters[i][0].date)) {//明天以后
              this.afterTomorrowNotes.push({data: this.group.matters[i]});
            }
          }
          this.getLearned(moment(this.group.schedule_start).format('YYYY-MM-DD'), moment(this.group.schedule_end).format('YYYY-MM-DD'));
        } else {
          console.warn('It seems respnse is empyt.'); 
        }
      });
    } else {
      console.error('HASH does not exist.'); 
    }
  }
  
  getLearned(start, end) {
      let diff = moment(end).diff(moment(start), 'days')
      this.homeService.loadLearned()// 0 : load,  1:reload
      .then(data => {
        if(this.loaded) {
          this.initLearned();
        }
        this.loaded = true;
        this.response = data; 
        if(!this.response.error) {
          for( var i = 0; i <= diff; i++) {
            let date = moment(start).add(i, 'days').format('YYYY-MM-DD');
            let res = this.isInResponse(date);
            if(res) {
              this.learned.push(res);
            }else{
              this.learned.push({date: date});
            }
            if(date === this.today) {
              this.todayLearnedIndex = i;
            }
          }
        }
      });
  }
  
  isInResponse(date){
    let res: any = null;
    this.response.data.forEach((learned) => {
      if(learned.date === date) {
        res = learned;
      } 
    });  
    return res;
  }

  openLearnedListPage(event) {
    this.nav.push(LearnedListPage, {item:this.learned});
  }

  openGradingListPage(event) {
    this.nav.push(GradingListPage, {item:this.schedules});
  }

  openLearnedDetailsPage(event, item) {
    this.nav.push(LearnedDetailsPage, {item:item});
  }

  openMemberGroupPage(event, team) {
    this.nav.push(MemberGroupPage, {item:team});
  }

  openNoteListPage(event) {
    this.nav.push(NoteListPage, {today: this.todayNotes, tomorrow: this.tomorrowNotes, afterTomorrow: this.afterTomorrowNotes});
  }

  logout() {
    let confirm = Alert.create({
      title: '确定要退出吗？',
      message: '',
      buttons: [
        {
          text: '取消',
          handler: () => {
          }
        },
        {
          text: '确定',
          handler: () => {
            this.local.clear()
            .then((data) => {
              this.nav.setRoot(LoginPage);
            });
          }
        }
      ]
    });
    this.nav.present(confirm);
  }
  
  openValuator() {
    window.open('https://www.ibeatop.com/h5/valuator');
  }
}
