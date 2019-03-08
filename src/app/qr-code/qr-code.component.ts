import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, NgForm} from '@angular/forms';
import * as QRCode from 'qrcode';
import {FormControl, Validators} from '@angular/forms';
import {MatExpansionPanel} from '@angular/material';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.css']
})

export class QrCodeComponent implements OnInit {
  text: string = null;
  url: string = null;
  email: string;
  number: string;
  msg: string;
  subject: string;
  fname: string;
  lname: string;
  option: string;
  color: string = null;
  image: string = null;
  urlRegex = /^(http|https|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;

  @ViewChild(MatExpansionPanel) colorPicker;

  urlForm = new FormGroup({
    url: new FormControl('', [Validators.required, Validators.pattern(this.urlRegex)])
  });

  textForm = new FormGroup({
    text: new FormControl('', Validators.required),
  });

  smsForm = new FormGroup({
    body: new FormControl('', Validators.required),
    number: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  emailForm = new FormGroup({
    sub: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    body: new FormControl('', Validators.required),
  });

  vcardForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    fname: new FormControl('', Validators.required),
    lname: new FormControl('', Validators.required),
    number: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  constructor() {
    this.color = '#000000';
  }

  ngOnInit() {

  }

  getErrorMessage() {
    switch (this.option) {
      case 'url':
        return this.urlForm.hasError('required', 'url') ? 'URL is required' : 'Not a valid URL';
      case 'text':
        return this.textForm.hasError('required', 'text') ? 'Text is required' : '';
      case 'sms':
        if (this.smsForm.controls.number.invalid) {
          return this.smsForm.hasError('required', 'number') ? 'Number is required' : 'Please enter a valid number';
        }
        if (this.smsForm.controls.body.invalid) {
          return this.smsForm.hasError('required', 'body') ? 'Body is required' : '';
        }
      case 'email':
        return this.emailForm.hasError('required', 'email') ? 'Email is required' : 'Not a valid email';

    }
  }

  createQr() {
    QRCode.toDataURL(this.text, {width: 190, color: {dark: this.color}})
      .then(url => {
        this.image = url;
        console.log(url);
      })
      .catch(err => {
        console.error(err);
      });
  }

  formOnSubmit(form: NgForm) {
    for (const name in form.value) {
      this[name] = form.value[name];
    }
    switch (this.option) {
      case 'url':
        this.text = this.url;
        break;
      case 'email':
        this.text = encodeURI('mailto:' + this.email + '?subject=' + this.subject + '&body=' + this.msg);
        break;
      case 'sms':
        this.text = encodeURI('sms:' + this.number + '?body=' + this.msg);
        break;
      case 'vcard':
        this.text = 'BEGIN:VCARD\n' +
          'VERSION:4.0\n' +
          'N:' + this.lname + ';' + this.fname + ';;\n' +
          'FN:' + this.fname + ' ' + this.lname + '\n' +
          'TEL;TYPE=work,voice;VALUE=uri:' + this.number + '\n' +
          'EMAIL:' + this.email + '\n' +
          'REV:20080424T195243Z\n' +
          'x-qq:21588891\n' +
          'END:VCARD';
    }
    // console.log(this.text);
    this.createQr();
  }

  toggleColorPicker() {
    this.colorPicker.close();
  }
}
