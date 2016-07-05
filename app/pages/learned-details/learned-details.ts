import {Component} from '@angular/core';
import {NavController, NavParams, Config, Alert} from 'ionic-angular';
import {UploadService} from '../../providers/upload-service/upload-service';
//declare var loadImage: any;
declare var EXIF: any;

@Component({
  templateUrl: 'build/pages/learned-details/learned-details.html',
  providers: [UploadService]
})
export class LearnedDetailsPage {
  learned: any;
  response: any;
  allowTypes: string[];
  maxSize: number;
  maxWidth: number;
  maxCount: number;
  photoToBeDeleting: any;

  constructor(private nav: NavController, public navParams:NavParams, public uploadService: UploadService) {
    this.learned = navParams.get('item'); 
    if(!this.learned.photo) {
      this.learned.photo = []; 
    }
    this.allowTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
    this.maxSize = 10 * 1024 * 1024;
    this.maxWidth = 1280;
    this.maxCount = 30;
    this.photoToBeDeleting = [];
  }

  ionViewDidLeave() {
    this.learned.photo = this.learned.photo.concat(this.photoToBeDeleting);
  }

  addPhoto(input) {
    var reader = [];  // create empt array for readers
    for (var i = 0; i < input.files.length; i++) {
      reader.push(new FileReader());

      if (this.allowTypes.indexOf(input.files[i].type) === -1) {
        console.warn('The file type (' + input.files[i].type+ ') is not allowed.');
        continue;
      }

      if (input.files[i].size > this.maxSize) {
        console.warn('The file size (' + input.files[i].size+ ') is too large to upload.');
        continue;
      }

      if (input.files[i]) {
        reader[i].readAsDataURL(input.files[i]);
      }

      reader[i].addEventListener("load", (event)=>{
        var image = new Image();
        image.src = event.target.result;
        image.addEventListener("load", (e)=>{
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          var w = Math.min(this.maxWidth, image.width);
          var h = image.height * (w / image.width);
          this.getOrientation(this, image, w, h, canvas, ctx);
        }, false);
      }, false);

    }
  }

  removePhoto(index) {
    let alert = Alert.create({
      title: '确认删除',
      message: '确定要删除这张照片吗？',
      buttons: [
        {
          text: '取消',
          handler: () => {
          }
        },
        {
          text: '确定',
          handler: () => {
            this.photoToBeDeleting.push(this.learned.photo[index]);
            this.learned.photo.splice(index, 1);
            /*
            if(this.learned.photo[index].data) {
              this.learned.photo.splice(index, 1);
            } else {
              this.uploadService.removeOnePhoto(this.learned, this.learned.photo[index]._id)
              .then((data) => {
                this.response = data;
                if(this.response.error) {
                  this.presentAlert(this.response.error.message);  
                } else {
                  this.learned.photo.splice(index, 1);
                }
              });
            }
            */
          }
        }
      ]
    });
    this.nav.present(alert);
  }

  handleInput(input) {
    if(input.value) {
      this.learned.experience = input.value.replace(/^ +/, '');
    }
  }

  submitLearned(event) {
    this.uploadService.replaceLearned(this.learned)
    .then((data) => {
      this.response = data;
      if(this.response.error) {
        this.presentAlert(this.response.error.message);  
      } else {
        this.photoToBeDeleting = [];
        this.nav.pop();
      } 
    });
  }

  getOrientation(_self, image, w, h, canvas, ctx) {
    EXIF.getData(image, function() {
      var orientation = EXIF.getTag(this, "Orientation");
      canvas.width = w;
      canvas.height = h;
      if (orientation > 4) {
        canvas.width = h;
        canvas.height = w;
      }
      switch (orientation) {
        case 2:
          // horizontal flip
          ctx.translate(w, 0)
          ctx.scale(-1, 1)
        break
        case 3:
          // 180° rotate left
          ctx.translate(w, h)
          ctx.rotate(Math.PI)
        break
        case 4:
          // vertical flip
          ctx.translate(0, h)
          ctx.scale(1, -1)
        break
        case 5:
          // vertical flip + 90 rotate right
          ctx.rotate(0.5 * Math.PI)
          ctx.scale(1, -1)
        break
        case 6:
          // 90° rotate right
          ctx.rotate(0.5 * Math.PI)
          ctx.translate(0, -h)
        break
        case 7:
          // horizontal flip + 90 rotate right
          ctx.rotate(0.5 * Math.PI)
          ctx.translate(w, -h)
          ctx.scale(-1, 1)
        break
        case 8:
          // 90° rotate left
          ctx.rotate(-0.5 * Math.PI)
          ctx.translate(-w, 0)
        break
      }
      //ctx.rotate(0.5 * Math.PI);
      //ctx.translate(0, -h);
      ctx.drawImage(image, 0, 0, w, h);

      if (_self.learned.photo.length < _self.maxCount) {
        let dataURL = canvas.toDataURL('image/jpeg', 0.8);
        let photo = {_id:'', data:'', path:dataURL};
        _self.learned.photo.push(photo);
        _self.doUploadPhoto(dataURL, photo);
      }
    });
  }

  doUploadPhoto(dataURL, photo) {
    this.uploadService.uploadImages(dataURL)
    .then(data =>{
        photo.data = data;
        photo._id = photo.data.url.replace(/[^\d]/g,'');
    });
  }

  presentAlert(message) {
    let alert = Alert.create({
      title: 'Error.',
      subTitle: message,
      buttons: ['Dismiss']
    });
    this.nav.present(alert);
  }
}
