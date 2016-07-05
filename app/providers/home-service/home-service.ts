import {Injectable} from '@angular/core';
import {Config} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HomeService {
  data: any = null;
  learned: any = null;
  api: string;
  hash: string;

  constructor(public http: Http, public config: Config) {
    this.api = this.config.get('APIURL'); 
    this.hash = this.config.get('HASH'); 
  }

  /*
   *获取首页内容除了心得
   */
  load(reload) {
    if (this.data && !reload) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.http.get(this.api + 'yxbg/find_group?hash=' + this.hash)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  /*
   *获取心得
   */
  loadLearned(reload) {
    if (this.learned && !reload) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.http.get(this.api + 'yxbg/xinde_list?hash=' + this.hash)
        .map(res => res.json())
        .subscribe(data => {
          this.learned = data;
          resolve(this.learned);
        });
    });
  }
}

