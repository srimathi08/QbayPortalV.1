import { LightningElement, track } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import jquery from '@salesforce/resourceUrl/jquery';

export default class LoginComponent extends LightningElement {

connectedCallback(){
        loadScript(this,jquery)
        .then(()=>{
            console.log('Jquery Loaded');
            $(this.template.querySelector('[data-id="hand-l"]')).addClass('feathers');
            $(this.template.querySelector('[data-id="hand-r"]')).addClass('feathers');
        })
        .catch(error=>{
            console.log('Failed to Load Jquery -' +error);
        });
       
}

handlePasswordIn(){
    $(this.template.querySelector('[data-id="hand-l"]')).addClass('hand-left');
    $(this.template.querySelector('[data-id="hand-r"]')).addClass('hand-right');
    $(this.template.querySelector('[data-id="arm-l"]')).addClass('arm-left');
    $(this.template.querySelector('[data-id="arm-r"]')).addClass('arm-right');
  this.handleUsernameOut();
}

handlePasswordOut(){
    $(this.template.querySelector('[data-id="hand-l"]')).removeClass('hand-left');
    $(this.template.querySelector('[data-id="hand-r"]')).removeClass('hand-right');
    $(this.template.querySelector('[data-id="arm-l"]')).removeClass('arm-left');
    $(this.template.querySelector('[data-id="arm-r"]')).removeClass('arm-right');
    this.handleUsernameOut();
}

handleUsernameIn(){
    this.handlePasswordOut();
    $(this.template.querySelector('[data-id="hand-l"]')).removeClass('feathers');
    $(this.template.querySelector('[data-id="hand-r"]')).removeClass('feathers');
    $(this.template.querySelector('[data-id="arm-l"]')).addClass('wings');
    $(this.template.querySelector('[data-id="arm-r"]')).addClass('wings');
}

handleUsernameOut(){
    $(this.template.querySelector('[data-id="hand-l"]')).addClass('feathers');
    $(this.template.querySelector('[data-id="hand-r"]')).addClass('feathers');
    $(this.template.querySelector('[data-id="arm-l"]')).removeClass('wings');
    $(this.template.querySelector('[data-id="arm-r"]')).removeClass('wings');
}

}