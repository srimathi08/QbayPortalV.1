import { LightningElement, wire,api } from 'lwc';
import getpassportRecords from '@salesforce/apex/PassPortPreview.getPassportRecords';

export default class PassPortList extends LightningElement {
    passportRecords;
    @api userName
    @api name
    @wire(getpassportRecords,{userName:'$userName'})
    wiredgetpassportRecords({ error, data }) {
        if (data) {
            this.passportRecords = data;
        } else if (error) {
            console.error('Error retrieving time tracker records:', error);
        }
    }
//     wiredpassportRecords({ error, data }) {
//         if (data) {
//             console.log('Fetched records:', data);
//             const filteredRecords = data.filter(record => record.Name__c === this.Name);
//             console.log('Filtered records:', filteredRecords);
//             this.passportRecords= filteredRecords;
//         } else if (error) {
//             console.error('Error retrieving time tracker records:', error);
//         }
//     }
 }