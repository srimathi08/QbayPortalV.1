public with sharing class LoginController {
    @AuraEnabled(cacheable=true)
    public static Boolean checkCredentials(String username, String password) {
        // Query the Login_Credentials__c custom object for the given username
        List<User__c> credentialsList = [SELECT Id, Password__c FROM User__c WHERE Username__c = :username LIMIT 1];

        if (!credentialsList.isEmpty()) {
            // If credentials are found, compare the provided password with the stored password
            User__c credentials = credentialsList[0];
            return credentials.Password__c == password;
        }
        // Return false if no credentials found for the given username
        return false;
    }
    
        @AuraEnabled(cacheable=true)
    public static User__c getUserInfo(String username, string name, string employeeid,string designation, date dateofjoining, string role,string email, date dateofbirth,string drivinglicensenumber, date licenseexpirydate, string ssnnumber, string sinnumber,string nationality, string status, string uannumber ) {
        try {
            // Query the User__c object to fetch the Name based on the Username__c field
            return [SELECT Id, Name, Employee_Id__c ,Designation__c, Date_Of_Joining__c, Role__c, Email__c, Date_Of_Birth__c,Driver_s_License_Number__c, License_Expiry_Date__c, SSN_Number__c, SIN_Number__c, Nationality__c, Status__c,Skill_Set__c,	P_UAN_Number__c FROM User__c WHERE Username__c = :username LIMIT 1];
        } catch (Exception ex) {
            // Handle any errors that occurred during the query
            System.debug('Error fetching user info: ' + ex.getMessage());
            return null;
        }
    }
    
    
}