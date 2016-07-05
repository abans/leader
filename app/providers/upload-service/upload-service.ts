import {Injectable} from '@angular/core';
import {Config} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UploadService {
  api: string;
  hash: string;
  huodong: string;

  constructor(public http: Http, public config: Config) {
    this.api = this.config.get('APIURL'); 
    this.hash = this.config.get('HASH');
    this.huodong = this.config.get('HUODONGID');
  }

  uploadImages(filedata) {
    let body = "filemeta={}&filedata=" + encodeURIComponent(filedata); 
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = new RequestOptions({ headers: headers });

    return new Promise(resolve => {
      this.http.post(this.api + 'pic/up_tmp', body, options)
      .map(res => res.json())
      .subscribe(data => {
          resolve(data);
        }, 
        err => console.error(err),
        () => console.log('Upload Complete') 
      );
    });
  }

  replaceLearned(learned) {
    let body = "hash=" + this.hash + '&rid=' + learned.huodong_id + "&_id=" + learned._id + "&date=" + learned.date + "&experience=" + learned.experience;
    learned.photo.forEach((photo)=>{
      if(photo.data) {
        body += "&photo[" + photo._id + "][path]=" + encodeURIComponent(photo.data.url);
      }else{
        body += "&photo[" + photo._id + "][path]=" + encodeURIComponent(photo.path);
      }
      body += "&photo[" + photo._id + "][_id]=" + photo._id;
    });


    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = new RequestOptions({ headers: headers });

    return new Promise(resolve => {
      this.http.post(this.api + 'yxbg/xinde_up', body, options)
      .map(res => res.json())
      .subscribe(data => {
          resolve(data);
        }, 
        err => console.error(err),
        () => console.log('http done.') 
      );
    });
  }

  removeOnePhoto(learned, photoId) {
    let body = "hash=" + this.hash + "&_id=" + learned._id + "&date=" + learned.date +"&photo_del[" + photoId + "]=1";
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = new RequestOptions({ headers: headers });

    return new Promise(resolve => {
      this.http.post(this.api + 'yxbg/xinde_up', body, options)
      .map(res => res.json())
      .subscribe(data => {
          resolve(data);
        }, 
        err => console.error(err),
        () => console.log('http done.') 
      );
    });
  }
}

