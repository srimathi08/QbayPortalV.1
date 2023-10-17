public with sharing class EmployeeController {
    @AuraEnabled(cacheable=true)
    public static List<Employee__c> getEmployeeBirthdaysByMonth(Integer month) {
        // Query Employee__c records where the birth month matches the provided month
        return [SELECT Id, Name, Date_Of_Birth__c FROM Employee__c WHERE CALENDAR_MONTH(Date_Of_Birth__c) = :month];
    }
    
    @AuraEnabled
public static void updateUser(String recordId, String username, String name, String employeeId, String designation, Date dateOfJoining, String role, String email, Date dateOfBirth, String driverLicenseNumber, Date licenseExpiryDate, String ssnNumber, String sinNumber, String nationality) {
    try {
        system.debug('email'+email);
        // Retrieve the record to update
        User__c recordToUpdate = [SELECT Id, Username__c, Name, Employee_Id__c, Designation__c, Date_Of_Joining__c, Role__c, Email__c, Date_Of_Birth__c, 	Driver_s_License_Number__c, License_Expiry_Date__c, SSN_Number__c, SIN_Number__c, Nationality__c
                                          FROM User__C
                                          WHERE Email__c = :email LIMIT 1];
        
        if (recordToUpdate != null) {
            // Update the record with new field values
            recordToUpdate.Username__c = username;
            recordToUpdate.Name = name;
            recordToUpdate.Employee_Id__c = employeeId;
            recordToUpdate.Designation__c = designation;
            recordToUpdate.Date_Of_Joining__c = dateOfJoining;
            recordToUpdate.Role__c = role;
            recordToUpdate.Email__c = email;
            recordToUpdate.Date_Of_Birth__c = dateOfBirth;
            recordToUpdate.Driver_s_License_Number__c = driverLicenseNumber;
            recordToUpdate.License_Expiry_Date__c = licenseExpiryDate;
            recordToUpdate.SSN_Number__c = ssnNumber;
            recordToUpdate.SIN_Number__c = sinNumber;
            recordToUpdate.Nationality__c = nationality;
            
            // Perform the update
            update recordToUpdate;
        }
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}

}