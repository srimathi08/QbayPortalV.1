import { LightningElement, track, wire,api } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getUserInfo from '@salesforce/apex/LoginController.getUserInfo';
import { NavigationMixin } from 'lightning/navigation';

export default class Contactinfo extends NavigationMixin(LightningElement) {
@track name;
@track employeeId;
@api name;
@api employeeId;
@track dateofjoining;
@track dateofbirth;
@track email;
@track role;
 @track designation;


@wire(CurrentPageReference)

setCurrentPageReference(currentPageReference) {

if (currentPageReference) {

  const state = currentPageReference.state;

  if (state.c__name  && state.c__employeeId && state.c__role && state.c__email && state.c__dateofjoining && state.c__dateofbirth && state.c__designation) {

    this.name = state.c__name;

    this.employeeId = state.c__employeeId;
    this.dateofjoining = state.c__dateofjoining;
    this.dateofbirth = state.c__dateofbirth;
    this.email = state.c__email;
    this.role = state.c__role;
    this.designation = state.c__designation;

    this.loadUserInfo();

  }

}

currentPageReference;

}

loadUserInfo() {

getUserInfo ({ username: this.name, employeeId: this.employeeId, role:this.role, designation:this.designation, email:this.email, dateofjoining:this.dateofjoining, dateofbirth:this.dateofbirth })

.then(result => {

  if (result) {

    // Assuming that 'user__c' object has a field 'Name' which contains the user's name

    this.name = result.Name;

    this.employeeId = result.Employee_Id__c;
    this.dateofjoining = result.Date_Of_Joining__c;
    this.dateofbirth = result.Date_Of_Birth__c;
    this.email= result.Email__c;
    this.role = result.Role__c;
    this.designation = result.Designation__c;

  }

})

.catch(error => {

  console.error('Error fetching user info:', error)

 });

}
}