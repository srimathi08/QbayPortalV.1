import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import checkCredentials from '@salesforce/apex/LoginController.checkCredentials';
import getUserInfo from '@salesforce/apex/LoginController.getUserInfo';
import { NavigationMixin } from 'lightning/navigation';
import Qbaylogo from '@salesforce/resourceUrl/Qbaylogo';
export default class Secondloginpage extends NavigationMixin(LightningElement)  {
    @track username = '';
    @track password = '';
    @track error = '';
    @api Qbaylogo = Qbaylogo;
    @track employeeId;
    @track designation;
    @track role;
    @track email;
    @track dataofjoining;
    @track dateofbirth;
    @track driverlicencenumber;
    @track licenceexpirydate;
    @track ssnnumber;
    @track sinnumber;
    @track nationality;

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
        console.log('username valied'+this.username);
        getUserInfo({ username: this.username })
            .then(result => {
                if (result) {
                    // Assuming that 'user__c' object has a field 'Name' which contains the user's name
                    console.log('results'+result);
                    const name = result.Name;
                    console.log('Inide seconloginpage infoe')
                    const employeeId = result.Employee_Id__c;
                    console.log('employeeId'+result)
                    const designation = result.Designation__c;
                    const role = result.Role__c;
                    console.log('employeeId'+result.Role__c)
                    const email = result.Email__c;
                    const dateofjoining = result.Date_Of_Joining__c;
                    const dateofbirth = result.Date_Of_Birth__c;
                    const driverlicencenumber = result.Driver_s_License_Number__c ;
                    const licenceexpirydate = result.License_Expiry_Date__c;
                    const ssnnumber = result.SSN_Number__c;
                    const  sinnumber = result.SIN_Number__c;
                    const  nationality = result.Nationality__c;


                    this.name = result.Name;
                    this.employeeId = result.Employee_Id__c;
                    this.designation = result.Designation__c;
                    this.role = result.Role__c;
                    this.email = result.Email__c;
                    this.dateofjoining = result.Date_Of_Joining__c;
                    this.dateofbirth = result.Date_Of_Birth__c;
                    this.driverlicencenumber = result.Driver_s_License_Number__c ;
                    this.licenceexpirydate = result.License_Expiry_Date__c;
                    this.ssnnumber = result.SSN_Number__c;
                    this.sinnumber = result.SIN_Number__c;
                    this.nationality = result.Nationality__c;
 

                    this.navigateToHomePage(name, employeeId, designation, role, email, dateofjoining, dateofbirth, driverlicencenumber,  licenceexpirydate,ssnnumber, sinnumber,nationality );

 

                }
            })
            .catch(error => {
  console.error('Error fetching user info:', error);
            });
    }
    
    handlesignup(){
        alert("Hi Your in sign-up page")
    }

    navigateToHomePage(name, employeeId, designation, role, email, dateofjoining, dateofbirth, driverlicencenumber ,licenceexpirydate ,ssnnumber , sinnumber ,nationality ) {

        this[NavigationMixin.Navigate]({

            type: 'standard__navItemPage',

            attributes: {

                apiName: 'QBPortal'

            },

            state: {

                c__name: name,// Pass the user's name to the home page

                c__employeeId: employeeId,
                c__designation: designation,
                c__role: role,
                c__email:email,
                c__dateofjoining:dateofjoining,
                c__dateofbirth:dateofbirth,
                c__driverlicencenumber:driverlicencenumber,
                c__licenceexpirydate:licenceexpirydate,
                c__ssnnumber:ssnnumber,
                c__sinnumber:sinnumber,
                c__nationality:nationality



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