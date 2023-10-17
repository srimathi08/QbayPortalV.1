import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import checkCredentials from '@salesforce/apex/LoginController.checkCredentials';
import getUserInfo from '@salesforce/apex/LoginController.getUserInfo';
import { NavigationMixin } from 'lightning/navigation';

 

export default class Login extends NavigationMixin(LightningElement) {
    @track username = '';
    @track password = '';
    @track error = '';

 

    handleUsernameChange(event) {
        this.username = event.target.value;
    }

 

    handlePasswordChange(event) {
        this.password = event.target.value;
    }

 

    handleLogin() {
        // Call the Apex method to check credentials
        checkCredentials({ username: this.username, password: this.password })
            .then(result => {
                if (result) {
                    // Credentials are valid, fetch user info and navigate to the home page
                    this.fetchUserInfo();
                } else {
                    // Credentials are invalid, show error message
                    this.error = 'Invalid username or password.';
                }
            })
            .catch(error => {
                // Handle any error that occurred during Apex call
                console.error('Error: ' + error);
                this.showToast('Error', 'An error occurred while processing the request.', 'error');
            });
    }

 

    fetchUserInfo() {
        getUserInfo({ username: this.username })
            .then(result => {
                if (result) {
                    // Assuming that 'user__c' object has a field 'Name' which contains the user's name
                    const name = result.Name;
                    this.navigateToHomePage(name);
                }
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
            });
    }

 

    navigateToHomePage(name) {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Checkinpage'
            },
            state: {
                c__name: name // Pass the user's name to the home page
            }
        });
    }

 

    showToast(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(toastEvent);
    }
}