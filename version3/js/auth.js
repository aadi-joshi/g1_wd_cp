class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('gstUsers')) || [];
    }

    register(shop, email, password, gstin) {
        if (this.validateGSTIN(gstin) && this.validateEmail(email) && this.validatePassword(password)) {
            this.users.push({
                shop,
                email,
                password,
                gstin,
                products: [],
                bills: [],
                created: new Date().toISOString()
            });
            localStorage.setItem('gstUsers', JSON.stringify(this.users));
            return true;
        }
        return false;
    }

    login(email, password) {
        return this.users.find(u => u.email === email && u.password === password);
    }

    validateGSTIN(gstin) {
        const pattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!pattern.test(gstin)) {
            alert('Invalid GSTIN format! Example: 22AAAAA0000A1Z5');
            return false;
        }
        return true;
    }

    validateEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!pattern.test(email)) {
            alert('Please enter a valid email address');
            return false;
        }
        return true;
    }

    validatePassword(password) {
        if (password.length < 6) {
            alert('Password must be at least 6 characters');
            return false;
        }
        return true;
    }
}

const userManager = new UserManager();

function showRegister() {
    $('#loginForm').addClass('d-none');
    $('#registerForm').removeClass('d-none');
}

function showLogin() {
    $('#registerForm').addClass('d-none');
    $('#loginForm').removeClass('d-none');
}

function register() {
    const shop = $('#regShop').val();
    const email = $('#regEmail').val();
    const password = $('#regPassword').val();
    const gstin = $('#regGSTIN').val();

    if (userManager.register(shop, email, password, gstin)) {
        alert('Registration successful! Please login.');
        showLogin();
    }
}

function login() {
    const email = $('#loginEmail').val();
    const password = $('#loginPassword').val();

    const user = userManager.login(email, password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'billing.html';
    } else {
        alert('Invalid email or password!');
    }
}