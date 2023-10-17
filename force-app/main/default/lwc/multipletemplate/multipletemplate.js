import { LightningElement } from 'lwc';
import templateone from './templateone.html'
import templatetwo from './templatetwo.html'

export default class Multipletemplate extends LightningElement {
    templateone = true;
    render(){

        return this.templateone ? templateone : templatetwo;

    }

    switchTemplate(){
        this.templateone = this.templateone === true ? false : true;
         
    }
}