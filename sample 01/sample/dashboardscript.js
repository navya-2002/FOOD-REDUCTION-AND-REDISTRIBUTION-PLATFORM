import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js";

// Initialize Firebase
const firebaseConfig = {
    /* ... (your Firebase configuration) */
    apiKey: "AIzaSyAlJXmeKbCWEpkPxX0B4B724sEZJBxO6J0",
    authDomain: "inbound-study-378414.firebaseapp.com",
    databaseURL: "https://inbound-study-378414-default-rtdb.firebaseio.com",
    projectId: "inbound-study-378414",
    storageBucket: "inbound-study-378414.appspot.com",
    messagingSenderId: "680995727607",
    appId: "1:680995727607:web:34098f4cc3e1718c5acbf2",
    measurementId: "G-ERDVP3VCT1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Check if user is authenticated
onAuthStateChanged(auth, (user) => {
    if (user) {
    // Fetch and display additional user information
const userRef = ref(db, 'users/' + user.uid);
get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
        const userCredentials = snapshot.val();
        document.getElementById('user-name').textContent = userCredentials.name;
        document.getElementById('user-address').textContent = userCredentials.address;
        document.getElementById('user-city').textContent = userCredentials.city;
        document.getElementById('user-country').textContent = userCredentials.country;
        document.getElementById('user-email').textContent = userCredentials.email;
        document.getElementById('user-phone').textContent = userCredentials.phone;
        document.getElementById('user-type').textContent = userCredentials.userType;

        // Display the additional credentials
        document.getElementById('user-role').textContent = userCredentials.role; // Assuming you have a "role" field in your database
        document.getElementById('user-member-since').textContent = userCredentials.memberSince; // Assuming you have a "memberSince" field in your database

        // Display other credentials as needed
    } else {
        console.log('User credentials not found.');
    }
}).catch((error) => {
    console.error('Error fetching user credentials:', error);
});
    } else {
        window.location.replace('login.html'); // Redirect to login if not authenticated
    }
});

// Logout button
document.getElementById('logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.replace('login.html'); // Redirect to login after logout
    }).catch((error) => {
        console.error(error);
    });
});

// Function to fetch and display donation history from the database
function displayDonationHistory() {
    const donationsRef = ref(db, 'donations');
    
    get(donationsRef).then((snapshot) => {
        if (snapshot.exists()) {
            const donations = snapshot.val();
            const donationList = Object.values(donations);
            
            // Display donation history on the dashboard
            const donationHistoryContainer = document.getElementById('donation-history-container');
            donationHistoryContainer.innerHTML = ''; // Clear previous content
            
            donationList.forEach((donation) => {
                const donationItem = document.createElement('div');
                donationItem.classList.add('donation-item');
                donationItem.innerHTML = `
                    <p><strong>Amount:</strong> $${donation.amount}</p>
                    <p><strong>Date:</strong> ${donation.date}</p>
                `;
                donationHistoryContainer.appendChild(donationItem);
            });
        } else {
            console.log('No donation history found.');
        }
    }).catch((error) => {
        console.error('Error fetching donation history:', error);
    });
}

// Function to update user profile information in the database
function updateProfile() {
    const user = auth.currentUser;
    if (user) {
        const newPhone = document.getElementById('new-phone').value;
        const userRef = ref(db, 'users/' + user.uid);
        
        set(userRef, {
            phoneNumber: newPhone
        }).then(() => {
            console.log('Profile updated successfully.');
        }).catch((error) => {
            console.error('Error updating profile:', error);
        });
    }
}

// Function to change user password using Firebase Auth
function changePassword() {
    const user = auth.currentUser;
    if (user) {
        const newPassword = document.getElementById('new-password').value;
        
        user.updatePassword(newPassword).then(() => {
            console.log('Password changed successfully.');
        }).catch((error) => {
            console.error('Error changing password:', error);
        });
    }
}

// Function to fetch and display notifications from the database
function showNotifications() {
    const notificationsRef = ref(db, 'notifications');
    
    get(notificationsRef).then((snapshot) => {
        if (snapshot.exists()) {
            const notifications = snapshot.val();
            const notificationsList = Object.values(notifications);
            
            // Display notifications on the dashboard
            const notificationsContainer = document.getElementById('notifications-container');
            notificationsContainer.innerHTML = ''; // Clear previous content
            
            notificationsList.forEach((notification) => {
                const notificationItem = document.createElement('div');
                notificationItem.classList.add('notification-item');
                notificationItem.innerHTML = `
                    <p>${notification.message}</p>
                    <p><em>${notification.timestamp}</em></p>
                `;
                notificationsContainer.appendChild(notificationItem);
            });
        } else {
            console.log('No notifications found.');
        }
    }).catch((error) => {
        console.error('Error fetching notifications:', error);
    });
}

// Function to calculate and display donation statistics
function displayDonationStatistics() {
    const donationsRef = ref(db, 'donations');

    get(donationsRef).then((snapshot) => {
        if (snapshot.exists()) {
            const donations = snapshot.val();
            const totalDonations = Object.values(donations).reduce((sum, donation) => sum + donation.amount, 0);
            const numDonations = Object.keys(donations).length;
            
            // Display statistics on the dashboard
            document.getElementById('total-donations').textContent = `$${totalDonations}`;
            document.getElementById('num-donations').textContent = numDonations.toString();
        } else {
            console.log('No donation statistics available.');
        }
    }).catch((error) => {
        console.error('Error fetching donation statistics:', error);
    });
}

// Function to navigate to the community forum page
function navigateToCommunityForum() {
    // Redirect the user to the community forum page
    window.location.href = 'community-forum.html'; // Replace with the actual URL
}

// Function to provide personalized donation recommendations
function showPersonalizedRecommendations() {
    const user = auth.currentUser;
    if (user) {
        const userDonationsRef = ref(db, 'userDonations/' + user.uid);
        
        get(userDonationsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const userDonations = snapshot.val();
                const donationHistory = Object.values(userDonations);
                
                // Implement your logic to analyze donation history and provide recommendations
                // For example, you could recommend similar causes or organizations
                
                const recommendationsContainer = document.getElementById('recommendations-container');
                recommendationsContainer.innerHTML = ''; // Clear previous content
                
                donationHistory.forEach((donation) => {
                    // Implement your recommendation display logic here
                    const recommendationItem = document.createElement('div');
                    recommendationItem.classList.add('recommendation-item');
                    recommendationItem.innerHTML = `
                        <p>Recommended: ${donation.cause}</p>
                    `;
                    recommendationsContainer.appendChild(recommendationItem);
                });
                
            } else {
                console.log('No donation history available for recommendations.');
            }
        }).catch((error) => {
            console.error('Error fetching user donation history:', error);
        });
    }
}

// Add event listeners for feature tiles
document.getElementById('donation-history').addEventListener('click', displayDonationHistory);
document.getElementById('update-profile').addEventListener('click', updateProfile);
document.getElementById('change-password').addEventListener('click', changePassword);
document.getElementById('notifications').addEventListener('click', showNotifications);
document.getElementById('donation-stats').addEventListener('click', displayDonationStatistics);
document.getElementById('community-forum').addEventListener('click', navigateToCommunityForum);
document.getElementById('recommendations').addEventListener('click', showPersonalizedRecommendations);


    document.getElementById("submit").addEventListener('click', function(e){
        e.preventDefault();
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;

        set(ref(db, 'user/' + username),
        {
            username: username,
            email: email,
            PhoneNumber: phone
        });

        alert("Login Successful!");

        // Determine the user's role or type and redirect accordingly
        get(ref(db, 'userRoles/' + username)).then((snapshot) => {
            if (snapshot.exists()) {
                const userType = snapshot.val().type;
                if (userType === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'user-dashboard.html';
                }
            } else {
                console.log('User role not found.');
            }
        }).catch((error) => {
            console.error('Error fetching user role:', error);
        });
    });
