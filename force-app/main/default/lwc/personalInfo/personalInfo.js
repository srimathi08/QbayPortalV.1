import { LightningElement, api, wire, track } from 'lwc';

// import TIMESHEET_OBJECT from '@salesforce/schema/Timseheet__c';
import NAME_FIELD from '@salesforce/schema/Timesheet__c.Name__c';
import DATE_FIELD from '@salesforce/schema/Timesheet__c.Date__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Timesheet__c.Description__c';
import createTimesheet from '@salesforce/apex/TimeSheetController.createTimesheet';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class PersonalInfo extends LightningElement {
    @track name = NAME_FIELD;
    @track date = DATE_FIELD;
    @track description = DESCRIPTION_FIELD;
    
        Name = this.name
        Date = this.date
        Description = this.description
    

    handleNameChange(event) {
        this.Name = event.target.value;
        console.log("name1", this.Name);
    }
    
    handleDateChange(event) {
        this.Date = event.target.value;
        console.log("Date", this.Date);
    }
    
    handleDesChange(event) {
        this.Description = event.target.value;
        console.log("Description", this.Description);
    }

    handleClick() {
        createTimesheet({ Name : this.Name,iDate:this.Date,Description : this.Description })
            .then(result => {
                this.message = result;
                console.log(this.message)
                this.error = undefined;
                if(this.message !== undefined) {
                    console.log('Inside success')
                    this.Name = '';
                    this.Date = '';
                    this.Description = '';
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Account created',
                            variant: 'success',
                        }),
                    );
                }
                
                console.log(JSON.stringify(result));
                console.log("result", this.message);
            })
            .catch(error => {
                this.message = undefined;
                this.error = error;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
                console.log("error", JSON.stringify(this.error));
            });
    }

}