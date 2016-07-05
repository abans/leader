import {Component} from '@angular/core';
import {Modal, NavController, NavParams} from 'ionic-angular';
import {GuestService} from '../../providers/guest-service/guest-service';
import {AvatarPreviewPage} from '../avatar-preview/avatar-preview';

@Component({
  templateUrl: 'build/pages/member-group/member-group.html',
  providers: [GuestService]
})

export class MemberGroupPage {
  selectedItem: any;
  response: any;
  guests: any;
  groupA: any;//缺席
  groupB: any;//未评价
  groupC: any;//已评价


  constructor(private nav: NavController, 
              private navParams: NavParams, 
              private guestService: GuestService) {
    this.selectedItem = navParams.get('item');
    this.initializeItems();
    this.groupA = [];
    this.groupB = [];
    this.groupC = [];
  }

  initializeItems() {
    this.guestService.load(this.selectedItem._id)
    .then(data => {
      this.response = data;
      if(this.response._id) {
        this.guests = this.response.guests; 
        this.guests.forEach((guest) => {
          if(guest.status === -1) {
            this.groupA.push(guest);
          } else if (guest.status === 0) {
            this.groupB.push(guest);
          } else {
            this.groupC.push(guest);
          }
        });
      }
    });
  }

  previewAvatar(guest) {
      if(guest._id && guest._id.photo && guest._id.photo.length) {
        guest.avatar = guest._id.photo[0].replace(/s\.(png|jpg)/g, 'm\.$1');
      } else {
        guest.avatar = ''
      }
      let modal = Modal.create(AvatarPreviewPage, {guest: guest});
      this.nav.present(modal);
  }
}
