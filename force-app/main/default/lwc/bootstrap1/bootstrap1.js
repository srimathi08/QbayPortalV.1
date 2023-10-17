import { LightningElement,api,track } from 'lwc';
import companylogo from '@salesforce/resourceUrl/companylogo';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import checkCredentials from '@salesforce/apex/LoginController.checkCredentials';

import getUserInfo from '@salesforce/apex/LoginController.getUserInfo';

import { NavigationMixin } from 'lightning/navigation';
// import { loadStyle } from 'lightning/platformResourceLoader';
// import MY_STATIC_RESOURCE from '@salesforce/resourceUrl/myStaticResource';

export default class Bootstrap1 extends LightningElement {
    //from sris org
    
    @track username = '';

    @track password = '';

    @track error = '';

    @track employeeId;

    //untill this

    @api companylogoSrc = companylogo;

    
    canvas;
    ctx;
    particles = [];
    mouseX;
    mouseY;

    renderedCallback() {
        if (this.canvas) {
            return; // Prevent multiple renders
        }

        this.canvas = this.template.querySelector("canvas");
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.ctx = this.canvas.getContext("2d");

        // Initialize the particles and start the animation
        this.init();
        this.draw();

        // Add a mousemove event listener
        this.canvas.addEventListener("mousemove", (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            setTimeout(() => {
                if (this.mouseX === e.clientX && this.mouseY === e.clientY) {
                    for (let i = 0; i < this.particles.length; i += 1) {
                        let x = this.particles[i].x;
                        let y = this.particles[i].y;
                        const x1 = e.clientX;
                        const y1 = e.clientY;
                        const dist = this.getDist(x, y, x1, y1);

                        if (dist < 200) {
                            if (x < x1) {
                                x -= 2;
                            } else {
                                x += 2;
                            }
                            if (y < y1) {
                                y -= 2;
                            } else {
                                y += 2;
                            }
                        }
                        this.particles[i].x = x;
                        this.particles[i].y = y;
                    }
                }
            }, 10);
        });

        // Add a setInterval to update neighbors
        setInterval(() => {
            const copy = [...this.particles];
            for (let i = 0; i < this.particles.length; i += 1) {
                const x = this.particles[i].x;
                const y = this.particles[i].y;

                copy.sort((a, b) => {
                    const x1 = a.x;
                    const x2 = b.x;
                    const y1 = a.y;
                    const y2 = b.y;
                    const dist1 = this.getDist(x, y, x1, y1);
                    const dist2 = this.getDist(x, y, x2, y2);
                    return dist1 - dist2;
                });

                this.particles[i].neighbors = copy.slice(0, 10);
            }
        }, 250);
    }

    getDist(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    init() {
        for (let i = 0; i < 300; i += 1) {
            const x = Math.floor(Math.random() * this.canvas.width);
            const y = Math.floor(Math.random() * this.canvas.height);
            const speedX = Math.random();
            const speedY = Math.random();
            const dirX = Math.random() > 0.5 ? 1 : -1;
            const dirY = Math.random() > 0.5 ? 1 : -1;

            this.particles.push({
                x,
                y,
                speedX: dirX * speedX,
                speedY: dirY * speedY,
                neighbors: [],
            });
        }
    }

    draw() {
        this.ctx.fillStyle = "rgba(0,0,0,0.5)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#b1c900";
        this.ctx.strokeStyle = "rgba(255,255,255,0.1)";
        for (let i = 0; i < this.particles.length; i += 1) {
            let x = this.particles[i].x + this.particles[i].speedX;
            let y = this.particles[i].y + this.particles[i].speedY;
            if (x < 0 || x > this.canvas.width || y < 0 || y > this.canvas.height) {
                x = Math.floor(Math.random() * this.canvas.width);
                y = Math.floor(Math.random() * this.canvas.height);
            }

            const x1 = this.mouseX || 2000;
            const y1 = this.mouseY || 2000;
            const dist = this.getDist(x, y, x1, y1);
            if (dist < 200) {
                if (x < x1) {
                    x -= 2;
                } else {
                    x += 2;
                }
                if (y < y1) {
                    y -= 2;
                } else {
                    y += 2;
                }
            }

            this.ctx.moveTo(x, y);
            this.ctx.arc(x, y, 2, 0, Math.PI * 2);
            this.particles[i].x = x;
            this.particles[i].y = y;
        }
        this.ctx.fill();

        for (let i = 0; i < this.particles.length; i += 1) {
            const x = this.particles[i].x;
            const y = this.particles[i].y;
            const neighbors = this.particles[i].neighbors;
            for (let j = 0; j < neighbors.length; j += 1) {
                const x1 = neighbors[j].x;
                const y1 = neighbors[j].y;
                const dist = this.getDist(x, y, x1, y1);
                if (dist < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, y);
                    this.ctx.lineTo(x1, y1);
                    this.ctx.stroke();
                }
            }
        }
        requestAnimationFrame(this.draw.bind(this));
    }


    //Sris code----------------------------------------------------------------------
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

        getUserInfo({ username: this.username })

            .then(result => {

                if (result) {

                    // Assuming that 'user__c' object has a field 'Name' which contains the user's name

                    const name = result.Name;
                    const employeeId = result.Employee_Id__c;
                    this.name = result.Name;
                    this.employeeId = result.Employee_Id__c;

                    this.navigateToHomePage(name, employeeId );

                }

            })

            .catch(error => {

                console.error('Error fetching user info:', error);

            });

    } 

    navigateToHomePage(name, employeeId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'QBPortal'
            },
            state: {
                c__name: name,// Pass the user's name to the home page
                c__employeeId: employeeId
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