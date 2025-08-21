// Authentication system for Medical Care Alliance

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.apiBase = '/api'; // This would be your actual API endpoint
        this.tokenKey = 'mca_auth_token';
        this.userKey = 'mca_user_data';
        
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupAuthForms();
        this.setupLogout();
    }

    checkAuthStatus() {
        try {
            const token = localStorage.getItem(this.tokenKey);
            const userData = localStorage.getItem(this.userKey);
            
            if (token && userData) {
                this.currentUser = JSON.parse(userData);
                this.isLoggedIn = true;
                this.updateUIForLoggedInUser();
            }
        } catch (error) {
            console.warn('Error checking auth status:', error);
            this.clearAuthData();
        }
    }

    setupAuthForms() {
        // Enhanced login form handling
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        // Setup registration form if it exists
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegistration.bind(this));
        }

        // Setup forgot password form
        const forgotPasswordForm = document.getElementById('forgotPasswordForm');
        if (forgotPasswordForm) {
            forgotPasswordForm.addEventListener('submit', this.handleForgotPassword.bind(this));
        }

        // Setup OTP form
        const otpForm = document.getElementById('otpForm');
        if (otpForm) {
            otpForm.addEventListener('submit', this.handleOTPVerification.bind(this));
        }
    }

    setupLogout() {
        // Handle logout functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('logout-btn') || 
                e.target.closest('.logout-btn')) {
                e.preventDefault();
                this.handleLogout();
            }
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');

        // Validate inputs
        if (!this.validateEmail(email)) {
            this.showError(form, 'Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            this.showError(form, 'Password must be at least 6 characters');
            return;
        }

        this.showLoading(form);

        try {
            // Simulate API call - replace with actual authentication
            const response = await this.simulateAuth(email, password);
            
            if (response.success) {
                await this.handleLoginSuccess(response);
                this.hideLoading(form);
                this.closeModal('loginModal');
                this.showNotification('Login successful! Welcome back.', 'success');
            } else {
                this.hideLoading(form);
                this.showError(form, response.message || 'Login failed');
            }
        } catch (error) {
            this.hideLoading(form);
            this.showError(form, 'Network error. Please try again.');
            console.error('Login error:', error);
        }
    }

    async handleRegistration(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        // Extract form data
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

        // Validate registration data
        const validation = this.validateRegistration(userData);
        if (!validation.isValid) {
            this.showError(form, validation.message);
            return;
        }

        this.showLoading(form);

        try {
            // Simulate registration API call
            const response = await this.simulateRegistration(userData);
            
            if (response.success) {
                this.hideLoading(form);
                this.showNotification('Registration successful! Please verify your email.', 'success');
                this.closeModal('registerModal');
                // Redirect to email verification or login
            } else {
                this.hideLoading(form);
                this.showError(form, response.message || 'Registration failed');
            }
        } catch (error) {
            this.hideLoading(form);
            this.showError(form, 'Network error. Please try again.');
            console.error('Registration error:', error);
        }
    }

    async handleForgotPassword(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const email = formData.get('email');

        if (!this.validateEmail(email)) {
            this.showError(form, 'Please enter a valid email address');
            return;
        }

        this.showLoading(form);

        try {
            // Simulate forgot password API call
            const response = await this.simulateForgotPassword(email);
            
            if (response.success) {
                this.hideLoading(form);
                this.showNotification('Password reset instructions sent to your email.', 'success');
                this.closeModal('forgotPasswordModal');
            } else {
                this.hideLoading(form);
                this.showError(form, response.message || 'Request failed');
            }
        } catch (error) {
            this.hideLoading(form);
            this.showError(form, 'Network error. Please try again.');
            console.error('Forgot password error:', error);
        }
    }

    async handleOTPVerification(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const otp = formData.get('otp');
        const phone = formData.get('phone');

        if (!otp || otp.length !== 6) {
            this.showError(form, 'Please enter a valid 6-digit OTP');
            return;
        }

        this.showLoading(form);

        try {
            // Simulate OTP verification API call
            const response = await this.simulateOTPVerification(phone, otp);
            
            if (response.success) {
                await this.handleLoginSuccess(response);
                this.hideLoading(form);
                this.closeModal('otpModal');
                this.showNotification('Login successful!', 'success');
            } else {
                this.hideLoading(form);
                this.showError(form, response.message || 'Invalid OTP');
            }
        } catch (error) {
            this.hideLoading(form);
            this.showError(form, 'Network error. Please try again.');
            console.error('OTP verification error:', error);
        }
    }

    handleLogout() {
        // Clear authentication data
        this.clearAuthData();
        
        // Update UI
        this.updateUIForLoggedOutUser();
        
        // Redirect to home page or login
        window.location.href = '/';
        
        this.showNotification('You have been logged out successfully.', 'info');
    }

    async handleLoginSuccess(response) {
        // Store authentication data
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.userKey, JSON.stringify(response.user));
        
        // Update internal state
        this.currentUser = response.user;
        this.isLoggedIn = true;
        
        // Update UI
        this.updateUIForLoggedInUser();
        
        // Trigger auth change event
        this.dispatchAuthEvent('login', response.user);
    }

    clearAuthData() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.currentUser = null;
        this.isLoggedIn = false;
    }

    updateUIForLoggedInUser() {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn && this.currentUser) {
            loginBtn.innerHTML = `
                <div class="user-menu">
                    <img src="${this.currentUser.avatar || 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}" 
                         alt="User Avatar" class="user-avatar">
                    <span>${this.currentUser.firstName} ${this.currentUser.lastName}</span>
                    <div class="dropdown-menu user-dropdown">
                        <a href="#dashboard" class="dropdown-item">
                            <i class="fas fa-tachometer-alt"></i> Dashboard
                        </a>
                        <a href="#appointments" class="dropdown-item">
                            <i class="fas fa-calendar"></i> My Appointments
                        </a>
                        <a href="#favorites" class="dropdown-item">
                            <i class="fas fa-heart"></i> Favorites
                        </a>
                        <a href="#profile" class="dropdown-item">
                            <i class="fas fa-user"></i> Profile Settings
                        </a>
                        <div class="dropdown-divider"></div>
                        <button class="dropdown-item logout-btn">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            `;
            
            // Add user menu styles
            this.addUserMenuStyles();
        }
    }

    updateUIForLoggedOutUser() {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.innerHTML = 'Login';
            loginBtn.onclick = () => this.openModal('loginModal');
        }
    }

    addUserMenuStyles() {
        if (!document.getElementById('userMenuStyles')) {
            const styles = document.createElement('style');
            styles.id = 'userMenuStyles';
            styles.textContent = `
                .user-menu {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: #f3f4f6;
                    border-radius: 25px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .user-menu:hover {
                    background: #e5e7eb;
                }
                
                .user-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    object-fit: cover;
                }
                
                .user-dropdown {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                    min-width: 200px;
                    padding: 0.5rem 0;
                    border: 1px solid #e5e7eb;
                    z-index: 1000;
                }
                
                .user-menu:hover .user-dropdown {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }
                
                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1.5rem;
                    color: #374151;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    border: none;
                    background: none;
                    width: 100%;
                    text-align: left;
                    cursor: pointer;
                }
                
                .dropdown-item:hover {
                    background: #f3f4f6;
                    color: #2563eb;
                }
                
                .dropdown-divider {
                    height: 1px;
                    background: #e5e7eb;
                    margin: 0.5rem 0;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    // Validation methods
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    validateRegistration(userData) {
        if (!userData.firstName.trim()) {
            return { isValid: false, message: 'First name is required' };
        }
        
        if (!userData.lastName.trim()) {
            return { isValid: false, message: 'Last name is required' };
        }
        
        if (!this.validateEmail(userData.email)) {
            return { isValid: false, message: 'Please enter a valid email address' };
        }
        
        if (!this.validatePhone(userData.phone)) {
            return { isValid: false, message: 'Please enter a valid phone number' };
        }
        
        if (userData.password.length < 8) {
            return { isValid: false, message: 'Password must be at least 8 characters long' };
        }
        
        if (userData.password !== userData.confirmPassword) {
            return { isValid: false, message: 'Passwords do not match' };
        }
        
        return { isValid: true };
    }

    // Simulation methods (replace with actual API calls)
    async simulateAuth(email, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (email === 'demo@medicalcare.com' && password === 'password') {
                    resolve({
                        success: true,
                        token: 'demo-token-' + Date.now(),
                        user: {
                            id: 1,
                            firstName: 'John',
                            lastName: 'Doe',
                            email: email,
                            role: 'patient',
                            avatar: null
                        }
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Invalid email or password'
                    });
                }
            }, 1500);
        });
    }

    async simulateRegistration(userData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Registration successful'
                });
            }, 2000);
        });
    }

    async simulateForgotPassword(email) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Password reset email sent'
                });
            }, 1500);
        });
    }

    async simulateOTPVerification(phone, otp) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (otp === '123456') {
                    resolve({
                        success: true,
                        token: 'otp-token-' + Date.now(),
                        user: {
                            id: 2,
                            firstName: 'Jane',
                            lastName: 'Smith',
                            phone: phone,
                            role: 'patient',
                            avatar: null
                        }
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Invalid OTP'
                    });
                }
            }, 1500);
        });
    }

    // Utility methods
    showLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.dataset.originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        }
    }

    hideLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalText || 'Submit';
        }
    }

    showError(form, message) {
        // Remove existing error messages
        const existingError = form.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Create new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 0.75rem;
            border-radius: 6px;
            margin-bottom: 1rem;
            font-size: 0.875rem;
        `;
        errorDiv.textContent = message;

        form.insertBefore(errorDiv, form.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    showNotification(message, type) {
        // Use the notification system from main.js
        if (window.MedicalCareAlliance) {
            window.MedicalCareAlliance.prototype.showNotification.call(this, message, type);
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    dispatchAuthEvent(type, data) {
        const event = new CustomEvent('authStateChanged', {
            detail: { type, data }
        });
        document.dispatchEvent(event);
    }

    // Public API methods
    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return this.isLoggedIn;
    }

    getAuthToken() {
        return localStorage.getItem(this.tokenKey);
    }
}

// Initialize authentication manager
const authManager = new AuthManager();

// Listen for auth state changes
document.addEventListener('authStateChanged', (event) => {
    const { type, data } = event.detail;
    console.log(`Auth state changed: ${type}`, data);
    
    // Update any UI components that depend on auth state
    // This can be expanded based on specific needs
});

// Export for use in other modules
window.AuthManager = AuthManager;
window.authManager = authManager;