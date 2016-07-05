import {Injectable} from '@angular/core';
import {Config} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

/*
 * 
 * 根据组id获取组员信息
*/
@Injectable()
export class GuestService {
  data: any = null;
  api: string;
  hash: string;

  constructor(public http: Http, public config: Config) {
    this.api = this.config.get('APIURL') + 'yxbg/find_team_guests'; 
    this.hash = this.config.get('HASH'); 
  }

  load(id) {
    return new Promise(resolve => {
      this.http.get(this.api + '?hash=' + this.hash + '&_id=' + id)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }
}

