import { LightningElement, api } from 'lwc';

export default class GreetingMessage extends LightningElement {
    @api name;
}