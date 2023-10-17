import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import checkCredentials from '@salesforce/apex/LoginController.checkCredentials';
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
                    // Credentials are valid, navigate to the home page
                    this.navigateToHomePage();
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

    navigateToHomePage() {
        // Use the NavigationMixin to navigate to the specified URL
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName : 'c__HomePage',
            },
            state:{
                c__name:this.username,
            },
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