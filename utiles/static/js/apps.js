document.addEventListener('DOMContentLoaded', function () {
    // Handle the signup form
    const signupForm = document.getElementById('signupForm');
    const message = document.getElementById('msg');
    if (signupForm) {
        signupForm.addEventListener('submit', async function (event) {
            event.preventDefault(); // Prevent the default form submission

            const email = document.getElementById('stremail').value;

            if (email) {
                try {
                    const response = await fetch('/account-control/user/email-checker', {
                        method: 'POST',
                        body: JSON.stringify({ email: email }),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }
                    });

                    const result = await response.json();

                    if (response.ok) {
                        // Email check was successful, proceed with form submission or next steps
                        sessionStorage.setItem('tempEmail', email); // Store the email in session storage
                        window.location.href = '/register-process'; // Redirect to the next page
                    } else {
                        // Handle errors returned from the server
                        message.style.color = "red";
                        message.innerText = result.message;

                    }
                } catch (e) {
                    butterup.toast({
                        title: 'Unknown Error',
                        message: 'An error occurred while processing request',
                        type: 'error',
                    });
                }
            } else {
                alert('Please enter an email.');
            }
        });
    }

    const signupContinueForm = document.getElementById('signup-continue');
    if (signupContinueForm) {
        signupContinueForm.addEventListener('submit', async function (event) {
            event.preventDefault(); // Prevent the default form submission
            const email = sessionStorage.getItem('tempEmail');
            const form = event.target;
            const formData = new FormData(form);
            formData.append('email', email);

            // Password confirmation validation
            if (formData.get('password') !== formData.get('confirm_password')) {
                butterup.toast({
                    title: 'Registration Error',
                    message: 'Passwords do not match!',
                    type: 'error',
                });
                return;
            }

            try {
                const response = await fetch('/account-control/user/create', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json',
                        // No need for 'Content-Type': 'multipart/form-data' when using FormData
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    // Handle success (e.g., redirect, show a message)
                    localStorage.setItem('user', result.token)
                    window.location.href = '/';
                } else {
                    // Handle errors
                    const errorData = await response.json();
                    if (errorData.errors && Array.isArray(errorData.errors)) {
                        errorData.errors.forEach(error => {
                            butterup.toast({
                                title: 'Registration Error',
                                message: error,
                                type: 'error',
                            });
                        });
                    } else {
                        butterup.toast({
                            title: 'Registration Error',
                            message: 'An unknown error occurred. Please try again.',
                            type: 'error',
                        });
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                butterup.toast({
                    title: 'Registration Error',
                    message: 'An error occurred while submitting the form.',
                    type: 'error',
                });
            }
        });
    }
   

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault(); // Prevent the default form submission

            const form = event.target;
            const formData = new FormData(form);


            try {
                const response = await fetch('/account-control/user/login ', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json',

                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    const lastUrl = sessionStorage.getItem('currenturl')
                    // Handle success (e.g., redirect, show a message)
                    if (lastUrl) {

                        window.location.href = lastUrl;
                    }
                    else {
                        window.location.href = '/';
                    }

                    localStorage.setItem('user', JSON.stringify(result.user));

                } else {
                    // Handle errors
                    const errorData = await response.json();
                    if (errorData.errors && Array.isArray(errorData.errors)) {
                        errorData.errors.forEach(error => {
                            butterup.toast({
                                title: 'Login Error',
                                message: error,
                                type: 'error',
                            });
                        });
                    } else {
                        butterup.toast({
                            title: 'Login Error',
                            message: 'An unknown error occurred. Please try again.',
                            type: 'error',
                        });
                    }
                }
            } catch (error) {
                butterup.toast({
                    title: 'Login Error',
                    message: 'An error occurred while submitting the form.',
                    type: 'error',
                });
            }
        });
    }

    let studentDetails = document.getElementById("student-details");

    if (studentDetails) {
        let user_data = localStorage.getItem('user');
        let user = JSON.parse(user_data);

        (async () => {
            try {
                const response = await fetch('/account-control/user/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token.access}`
                    }
                });

                if (response.ok) {
                    const result = await response.json();

                    // Clear any existing data
                    patientsData.innerHTML = '';

                    // Initialize an incremental counter
                    let counter = 1;

                    // Iterate over the result and create HTML elements for each patient
                    result.forEach(patient => {


                        // Create the patient item element
                        let patientItem = document.createElement('div');
                        patientItem.className = 'patient-item';
                        patientItem.id = `patient-item-${counter}`;
                        patientItem.dataset.id = patient._id;
                        patientItem.textContent = `${patient.first_name} ${patient.last_name}`;

                        // Create the line separator element
                        let lineSeparator = document.createElement('div');
                        lineSeparator.className = 'line';

                        // Append the patient item and line separator to the patientsData container
                        patientsData.appendChild(patientItem);
                        patientsData.appendChild(lineSeparator);

                        // Increment the counter for the next patient
                        counter++;
                    });

                    // Success message

                } else {
                    const errorData = await response.json();

                    if (errorData.errors && Array.isArray(errorData.errors)) {
                        errorData.errors.forEach(error => {
                            butterup.toast({
                                title: 'Error',
                                message: error,
                                type: 'error',
                            });
                        });
                    } else if (errorData.message) {
                        butterup.toast({
                            title: 'Error',
                            message: errorData.message,
                            type: 'error',
                        });
                    } else {
                        butterup.toast({
                            title: 'Error',
                            message: 'An unknown error occurred. Please try again.',
                            type: 'error',
                        });
                    }
                }
            } catch (error) {
                console.error('Fetch error:', error); // Log the error to the console for debugging
                butterup.toast({
                    title: 'Error',
                    message: 'An error occurred while fetching patient data. Please check your network connection and try again.',
                    type: 'error',
                });
            }
        })();
    }

    const utiles = document.getElementById('utiles');
    const user = localStorage.getItem('user');

    const languageDropdown = `
            <div class="dropdown" style="position: relative; padding-right: 20px;">
                <a class="btn btn-outline-secondary" 
                   style="border-radius: 50%; width: 35px; height: 35px; padding: 0.385rem 0.55rem;" 
                   href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                   <i class="fi fi-rr-globe" style="font-size: 16px;"></i>
                </a>
                <ul class="dropdown-menu" style="left: -176px;">
                    <li><a class="dropdown-item" href="#">Language Option</a></li>
                </ul>
            </div>`;

    const notificationDropdown = `
            <div class="dropdown" style="position: relative; padding-right: 20px;">
                <a class="btn btn-outline-secondary" 
                   style="border-radius: 50%; width: 35px; height: 35px; padding: 0.385rem 0.55rem;" 
                   href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                   <i class="fi fi-rr-bell" style="font-size: 16px;"></i>
                </a>
                <ul class="dropdown-menu" style="left: -175px;">
                    <li><a class="dropdown-item" href="#">All notifications</a></li>
                </ul>
            </div>`;

    const userDropdown = `
            <div class="dropdown" style="position: relative;">
                <a class="btn btn-outline-secondary" 
                   style="border-radius: 50%; width: 35px; height: 35px; padding: 0.385rem 0.55rem;" 
                   href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                   <i class="fi fi-rr-user" style="font-size: 16px;"></i>
                </a>
                <ul class="dropdown-menu" style="left: -178px;">
                    <li><a class="dropdown-item" href="/nakiese/accounts/settings">Manage Account</a></li>
                    <li><a class="dropdown-item" href="#">Reviews</a></li>
                    <li><a class="dropdown-item" href="#">Saved</a></li>
                    <li><a class="dropdown-item" id="logout" href="#">Logout</a></li>
                </ul>
            </div>`;

    if (user) {
        utiles.innerHTML = `
                ${languageDropdown}
                ${notificationDropdown}
                ${userDropdown}
            `;
        attachLogoutListener(); // Attach the logout event listener
    } else {
        const loginButton = `
                <div style="padding-right: 20px;">
                    <a href="/login" class="btn-nakiese text-light text-center">Login</a>
                </div>`;

        const signUpButton = `
                <div>
                    <a href="/register" class="btn-nakiese text-light text-center">Sign Up</a>
                </div>`;

        utiles.innerHTML = `
                ${languageDropdown}
                ${loginButton}
                ${signUpButton}
            `;
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const logout = document.getElementById("logout");

    if (logout) {
        logout.addEventListener('click', function (event) {
            // event.preventDefault(); // Prevent default link behaviorn
            localStorage.removeItem('user');
            window.location.href = '/login';
        });
    } else {
        console.error("Logout button not found");
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const ids = ['account-personal', 'account-security', 'account-notification', 'account-payment', 'account-preferences'];
    const links = {
        'account-personal': "/nakiese/accounts/settings/persoanl-details",
        'account-security': "/nakiese/accounts/settings/security",
        'account-notification': "/nakiese/accounts/settings/email-notification",
        'account-payment': "/nakiese/accounts/settings/payment-handle",
        'account-preferences': "/nakiese/accounts/settings/preferences"
    };

    ids.forEach(function(id) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', function(event) {
          
                const link = links[id];
                if (link) {
                    window.location.href = link; // Navigate to the specified URL
                } else {
                    console.error(`No link found for id: ${id}`);
                }
            });
        } else {
            console.error(`Element with id ${id} not found`);
        }
    });

   
});

document.addEventListener('DOMContentLoaded', async function () {
    let user = localStorage.getItem('user');

    if (user) {
        try {
            // Parse the user object if it's stored as a JSON string
            user = JSON.parse(user);
            
            const response = await fetch('/account-control/user/profile', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token.access}`  // Make sure the token is correct
                }
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result); // For debugging

                // Populate the HTML elements with data
                const nameElement = document.getElementById('fullname');
                const emailElement = document.getElementById('email');
                const phnoElement = document.getElementById('phno');
                const dobElement = document.getElementById('dob');
                const nationalityElement = document.getElementById('nationality');
                const genderElement = document.getElementById('gender');
                const addressElement = document.getElementById('address');

                if (nameElement) nameElement.textContent = `${result.first_name || 'Add name'} ${result.last_name || 'Add name'}`;
                if (emailElement) emailElement.textContent = result.email || 'Add email';
                if (phnoElement) phnoElement.textContent = result.phone_no || 'Add phone number';
                if (dobElement) dobElement.textContent = result.date_of_birth ? result.date_of_birth : 'Add date of birth';
                if (nationalityElement) nationalityElement.textContent = result.nationality || 'Add nationality';
                if (genderElement) genderElement.textContent = result.gender || 'Add gender';
                if (addressElement) addressElement.textContent = result.address || 'Add address';
                
            } else {
                const errorResult = await response.json();
                console.error('Error:', errorResult.message || 'An error occurred');
                // Optional: Display error to the user
                alert('An error occurred: ' + (errorResult.message || 'Unknown error'));
            }
        } catch (e) {
            // Error handling
            console.error('Request failed', e);
            alert('An error occurred while processing the request');
        }
    } 
});
