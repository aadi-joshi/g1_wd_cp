class Auth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('gstUsers')) || [];
        this.initEvents();
    }

    initEvents() {
        $('[data-tab]').click(function() {
            $('[data-tab]').removeClass('active');
            $(this).addClass('active');
            $('.auth-form').addClass('d-none');
            $(`#${$(this).data('tab')}Form`).removeClass('d-none');
        });
    }

    register() {
        const user = {
            name: $('#regName').val(),
            email: $('#regEmail').val(),
            password: $('#regPassword').val(),
            gstin: $('#regGSTIN').val(),
            created: new Date().toISOString()
        };

        if(this.validateUser(user)) {
            this.users.push(user);
            localStorage.setItem('gstUsers', JSON.stringify(this.users));
            alert('Registration successful! Please login.');
            $('[data-tab="login"]').click();
        }
    }

    login() {
        const email = $('#loginEmail').val();
        const password = $('#loginPassword').val();
        const user = this.users.find(u => u.email === email && u.password === password);

        if(user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'billing.html';
        } else {
            alert('Invalid credentials!');
        }
    }

    validateUser(user) {
        // Add proper validation
        return user.email && user.password && user.gstin;
    }
}

const auth = new Auth();

function register() { auth.register(); }
function login() { auth.login(); }