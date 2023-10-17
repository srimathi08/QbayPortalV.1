trigger RemainingLeave on Leave_Request__c (before insert, before update) {
    Map<String, Map<Id, Decimal>> userLeaveTypeTotalMap = new Map<String, Map<Id, Decimal>>();
    Set<String> userLeaveTypeKeys = new Set<String>();

    // Collect user and leave type combinations from the leave requests being processed
    for (Leave_Request__c leaveRequest : Trigger.new) {
        String userLeaveTypeKey = leaveRequest.Employee_Name__c + '_' + leaveRequest.Leave_Type__c;
        if (!userLeaveTypeTotalMap.containsKey(userLeaveTypeKey)) {
            userLeaveTypeTotalMap.put(userLeaveTypeKey, new Map<Id, Decimal>());
            userLeaveTypeKeys.add(userLeaveTypeKey);
        }
        userLeaveTypeTotalMap.get(userLeaveTypeKey).put(leaveRequest.Id, leaveRequest.No_of_Leaves__c);
    }

    // Construct userNames and userLeaveTypes sets for the query
    Set<String> userNames = new Set<String>();
    Set<String> userLeaveTypes = new Set<String>();
    for (String userLeaveTypeKey : userLeaveTypeKeys) {
        List<String> parts = userLeaveTypeKey.split('_');
        userNames.add(parts[0]);
        userLeaveTypes.add(parts[1]);
    }

    // Query existing leave requests for the affected users and leave types
    List<Leave_Request__c> existingLeaveRequests = [
        SELECT Id, Employee_Name__c, Leave_Type__c, Remaining_Leave__c, No_of_Leaves__c
        FROM Leave_Request__c
        WHERE Employee_Name__c IN :userNames AND Leave_Type__c IN :userLeaveTypes
    ];

    // Populate userLeaveTypeTotalMap with queried data
    for (Leave_Request__c existingLeaveRequest : existingLeaveRequests) {
        String userLeaveTypeKey = existingLeaveRequest.Employee_Name__c + '_' + existingLeaveRequest.Leave_Type__c;
        if (!userLeaveTypeTotalMap.containsKey(userLeaveTypeKey)) {
            userLeaveTypeTotalMap.put(userLeaveTypeKey, new Map<Id, Decimal>());
        }
        userLeaveTypeTotalMap.get(userLeaveTypeKey).put(existingLeaveRequest.Id, existingLeaveRequest.No_of_Leaves__c);
    }

    // Calculate remaining leave for the current leave requests
    for (Leave_Request__c leaveRequest : Trigger.new) {
        String userLeaveTypeKey = leaveRequest.Employee_Name__c + '_' + leaveRequest.Leave_Type__c;
        Decimal totalLeavesApplied = 0;
        if (userLeaveTypeTotalMap.containsKey(userLeaveTypeKey)) {
            Map<Id, Decimal> userLeaveTypeMap = userLeaveTypeTotalMap.get(userLeaveTypeKey);
            for (Decimal leavesApplied : userLeaveTypeMap.values()) {
                totalLeavesApplied += leavesApplied;
            }
        }
        
        if (totalLeavesApplied <= leaveRequest.Total_Leave__c) {
            leaveRequest.Remaining_Leave__c = leaveRequest.Total_Leave__c - totalLeavesApplied;
        } else {
            // If the total applied leaves exceed the total leave balance, prevent leave application
            leaveRequest.Remaining_Leave__c = 0;
            leaveRequest.addError('Insufficient remaining leave balance.');
        }
    }
}