public with sharing class TimeSheetController {
    @AuraEnabled
    public static Boolean insertNameRecord(String name) {
        List<TimeSheet__c> existingRecords = [SELECT Id FROM TimeSheet__c WHERE Name__c = :name];
        return !existingRecords.isEmpty();
    }

    @AuraEnabled(cacheable=true)
    public static User__c getUserInfo(String username) {
        try {
            // Query the User__c object to fetch the Name based on the Username__c field
            return [SELECT Id, Name, Employee_Id__c FROM User__c WHERE Username__c = :username LIMIT 1];
        } catch (Exception ex) {
            // Handle any errors that occurred during the query
            System.debug('Error fetching user info: ' + ex.getMessage());
            return null;
        }
    }

    

  @AuraEnabled
    public static void saveTimeSheetRecord(String name, String employeeId, String description, String workdone, String projectname,Decimal totalhours ) {
        try {
            if (String.isNotBlank(name)) { // Check if name is not null or empty
                Timesheet__c timesheetRecord = new Timesheet__c(
                    Name__c = name,
                    Employee_Id__c = employeeId,
                    Description__c = description,
                     Work_Done__c = workdone,
                    Project_Name__c = projectname,
                    Total_Hours__c = totalhours
                );
                insert timesheetRecord;
                System.debug('Timesheet Record Inserted: ' + timesheetRecord);
            }
        } catch (Exception ex) {
            System.debug('Error Message: ' + ex.getMessage());
            System.debug('Stack Trace: ' + ex.getStackTraceString());
            throw ex;
        }
    }
}