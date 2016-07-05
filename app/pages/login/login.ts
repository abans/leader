import {Component} from '@angular/core';
import {Loading, Alert, Modal, NavController, Config, Storage, LocalStorage} from 'ionic-angular';
import {LeaderPage} from '../leader/leader';
import {LoginService} from '../../providers/login-service/login-service';



@Component({
  templateUrl: 'build/pages/login/login.html?7289',
  providers: [LoginService]
})
export class LoginPage {
  loginCode: string;
  loginCode1: string;
  loginCode2: string;
  loginCode3: string;
  loginCode4: string;
  loginCode5: string;
  loginCode6: string;
  firstName: string;
  lastName: string;
  isValidating: boolean;
  isHandling: boolean;
  loginCodeCorrect: boolean;
  response: any;
  local: any;

  constructor(public nav:NavController, 
              public config:Config,
              public loginService: LoginService) {
    this.nav = nav;
    this.loginCode1 = "";
    this.loginCode2 = "";
    this.loginCode3 = "";
    this.loginCode4 = "";
    this.loginCode5 = "";
    this.loginCode6 = "";
    this.firstName = "";
    this.lastName = "";
    this.isValidating = false;
    this.isHandling = false;
    this.loginCodeCorrect = false;
    this.local = new Storage(LocalStorage);
  }

  handleCodeInput(codeInput, nextCodeInput) {
    if(this.isHandling) {
      return;
    }
    this.isHandling = true;
    codeInput.value = codeInput.value.replace(/[^\d]/g,'');
    
    if(codeInput.value) {
      this.loginCode1 = codeInput.value.substr(0,1);
      this.loginCode2 = codeInput.value.substr(1,1);
      this.loginCode3 = codeInput.value.substr(2,1);
      this.loginCode4 = codeInput.value.substr(3,1);
      this.loginCode5 = codeInput.value.substr(4,1);
      this.loginCode6 = codeInput.value.substr(5,1);
    } else {
      this.loginCode1 = '';
      this.loginCode2 = '';
      this.loginCode3 = '';
      this.loginCode4 = '';
      this.loginCode5 = '';
      this.loginCode6 = '';
    }
    if (codeInput.value && codeInput.value.length == 6) {
      setTimeout(()=>{
        codeInput.blur(); 
        this.validateLoginCode();
      }, 350);
    } else {
      this.isHandling = false; 
      this.loginCodeCorrect = false; 
    }
  }

  validateLoginCode() {
    let loading = Loading.create({
      content: "正在查找...",
    });

    this.nav.present(loading);

    this.loginService.validateLoginCode(this.loginCode)
    .then(data => {
      this.response = data;
      if(this.response.hash){
        this.firstName = this.response.first_name; 
        this.lastName = this.response.last_name; 
        this.loginCodeCorrect = true;
        this.config.set('HASH', this.response.hash);
        this.local.set('HASH', this.response.hash);
      } else {
        this.firstName = ""; 
        this.lastName = ""; 
        this.codeIncorrect('密码错误', '请确认后重试');    
        this.loginCodeCorrect = false;
      }
      this.isHandling = false;
      loading.dismiss();
    });
  }

  codeIncorrect(title, message) {
    let alert = Alert.create({
      title: title,
      message: message,
      buttons: ['好的']
    });
    this.nav.present(alert);
  }

  login() {
    if(this.loginCodeCorrect) {
      if(this.firstName && this.lastName) {
        this.loginService.doLogin(this.loginCode, this.firstName, this.lastName)
        .then(data => {
          this.response = data;
          if(this.response.hash){
            this.config.set('HASH', this.response.hash);
            this.local.set('HASH', this.response.hash);
            this.local.set('AUTHORIZED', true);
            this.nav.setRoot(LeaderPage);
          } else {
            this.codeIncorrect('Error.', this.response.error.message);    
          }
        });
      } else {
        this.codeIncorrect('姓名不能为空', '请确认后重试');    
      }
    } else {
      this.codeIncorrect('密码错误', '请确认后重试');    
    }
  }
}
