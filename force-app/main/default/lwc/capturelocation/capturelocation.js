import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import checkIn from '@salesforce/apex/CheckInOutController.checkIn';

export default class CheckInCheckOutPortal extends LightningElement {
    @track status = 'Not Checked In';
    @track location = '';
    @api userId; // Pass the user's ID from the Lightning component or parent component

    handleCheckIn()
     {
        this.getLocation()
            .then((coords) => {
                const location = `Latitude: ${coords.latitude}, Longitude: ${coords.longitude}`;
                this.location = location;

                // Call the Apex method to save the location
                checkIn({ location: location, userId: this.userId })
                    .then(() => {
                        this.status = 'Checked In';
                        this.showToast('Success', 'Checked in successfully', 'success');
                    })
                    .catch((error) => {
                        console.error('Error saving check-in: ', error);
                        this.showToast('Error', 'An error occurred while checking in', 'error');
                    });
            })
            .catch((error) => {
                console.error('Error getting location: ', error);
                this.showToast('Error', 'Unable to get location', 'error');
            });
    }

    handleCheckOut() {
        // Perform check-out logic here
        // You can call another Apex method to handle check-out if needed
        this.status = 'Checked Out';
        this.location = '';
    }

    getLocation() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve(position.coords);
                    },
                    (error) => {
                        reject(error);
                    }
                );
            } else {
                reject('Geolocation is not supported by this browser.');
            }
        });
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}
