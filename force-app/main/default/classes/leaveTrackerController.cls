public class leaveTrackerController {
               @AuraEnabled(cacheable=true)
    public static User__c getUserInfo(String username) {
        try {
            // Query the User__c object to fetch the Name based on the Username__c field
            return [SELECT Id, Name FROM User__c WHERE Username__c = :username LIMIT 1];
        } catch (Exception ex) {
            // Handle any errors that occurred during the query
            System.debug('Error fetching user info: ' + ex.getMessage());
            return null;
        }
    }
    
        @AuraEnabled(cacheable=true)
    public static List<Leave_Request__c> getLeaveRequests(){
        try {
            List<Leave_Request__c> myLeaves=new List<Leave_Request__c>();
            myLeaves=[SELECT Id,Name__c ,From__c,To__c,Reason_for_Leave__c,Status__c FROM Leave_Request__c
           ];
            return myLeaves;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}