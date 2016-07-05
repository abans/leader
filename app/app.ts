import {ViewChild, Component} from '@angular/core';
import {ionicBootstrap, Nav, Config, Storage, LocalStorage} from 'ionic-angular';
//import {StatusBar} from 'ionic-native';
import {LoginPage} from './pages/login/login';
import {LeaderPage} from './pages/leader/leader';


@Component({
  templateUrl: 'build/app.html',
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;
  local: any;

  constructor(private config: Config) {
    if(window.location.origin.indexOf('ibeatop') > 0) {
      this.config.set('APIURL', 'https://api.ibeatop.com/v2/');
    } else {
      this.config.set('APIURL', 'http://api.cheesedu.com/v2/');
    }

    this.local = new Storage(LocalStorage);
    this.initializeApp();
  }

  initializeApp() {
    this.local.get('HASH')
    .then((value) => {
      if(value) {
        this.config.set('HASH', value);
        this.local.get('AUTHORIZED')
        .then((value) => {
          if(value == 'true') {
            this.nav.setRoot(LeaderPage);
          }
        });
      }
    })
    /*
    this.platform.ready().then(() => {
    // StatusBar.styleDefault();
    });
    */
  }
}

ionicBootstrap(MyApp, [], {
  mode: 'ios', 
  backButtonText: '返回',
  prodMode: true 
});
