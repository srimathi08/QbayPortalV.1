public class CheckinReminder {
    public static void sendCheckinReminders() {
        // Get the start of today's date
        Date today = Date.today();
        
        // Calculate the datetime for 11:00 AM today
        DateTime elevenAM = DateTime.newInstance(today, Time.newInstance(11, 0, 0, 0));
        
        // Query for employees who did not Checkin today and whose Start_time__c is null
        List<User__c> employeesToRemind = [
            SELECT Id, Email__c
            FROM User__c
            WHERE Id IN (
                SELECT Employee__c
                FROM Time_Tracker__c
                WHERE Start_Time__c = NULL AND CreatedDate >= :elevenAM AND CreatedDate <= :DateTime.now()
            )
        ];
        
        // Iterate through employees and send reminders
        List<Messaging.SingleEmailMessage> emailMessages = new List<Messaging.SingleEmailMessage>();
        for (User__c emp : employeesToRemind) {
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(new String[] {emp.Email__c});
            email.setSubject('Reminder: Please Check In Today');
            email.setPlainTextBody('Hello ' + emp.Email__c + ',\n\nThis is a friendly reminder to complete your check-in today.\n\nThank you!');
            
            emailMessages.add(email);
        }
        
        // Send the email reminders
        Messaging.SendEmailResult[] sendResults = Messaging.sendEmail(emailMessages);
        
        // Handle send results (if needed)
        for (Messaging.SendEmailResult result : sendResults) {
            if (result.isSuccess()) {
                System.debug('Email sent successfully.');
            } else {
                System.debug('Email sending failed: ' + result.getErrors()[0].getMessage());
            }
        }
    }
}