import { LightningElement, track, wire } from 'lwc';
import saveTimeTrackerRecord from '@salesforce/apex/TimeTrackerController.saveTimeTrackerRecord';
import { CurrentPageReference} from 'lightning/navigation';

export default class TimeTrackerLWC extends LightningElement {
  @track isCheckInDisabled = false;
  @track isCheckOutDisabled = true;
  @track startTime = '';
  @track endTime = '';

  handleCheckIn() {
    this.startTime = new Date().toLocaleString();
    this.isCheckInDisabled = true;
    this.isCheckOutDisabled = false;
  }

  handleCheckOut() {
    this.endTime = new Date().toLocaleString();
    this.isCheckOutDisabled = true;
    const totalHours = ((new Date(this.endTime) - new Date(this.startTime)) / (1000 * 60 * 60)).toFixed(2);
    this.saveTimeTrackerRecordToSalesforce(totalHours);
  }

  saveTimeTrackerRecordToSalesforce(totalHours) {
    saveTimeTrackerRecord({ startTime: this.startTime, endTime: this.endTime, totalHours })
      .then(() => {
        // Reset values after successful save
        this.startTime = '';
        this.endTime = '';
        this.isCheckInDisabled = false;
        this.isCheckOutDisabled = true;
        // Show a success toast or perform any other actions upon successful save
      })
      .catch((error) => {
        console.error('Error while saving time tracker record:', error);
        // Show an error toast or perform any other error handling
      });
  }
  @wire(CurrentPageReference)
  setCurrentPageReference(currentPageReference){
    if (currentPageReference){
      const state = currentPageReference.state;
      if(state.c__name){
        this.name = state.c__name;
      }
    }
  }
}