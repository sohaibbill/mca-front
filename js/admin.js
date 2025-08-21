// Admin Panel JavaScript functionality

class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.sidebarCollapsed = false;
        this.mobileMenuOpen = false;
        this.currentUser = null;
        this.users = [];
        this.appointments = [];
        this.content = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSidebarToggle();
        this.setupNavigation();
        this.setupModals();
        this.loadInitialData();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Sidebar toggle
        document.getElementById('sidebarToggle')?.addEventListener('click', this.toggleSidebar.bind(this));
        document.getElementById('mobileSidebarToggle')?.addEventListener('click', this.toggleMobileSidebar.bind(this));
        
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.dataset.section || e.target.closest('.nav-link').dataset.section;
                this.navigateToSection(section);
            });
        });

        // Modal controls
        document.getElementById('addUserBtn')?.addEventListener('click', () => this.openUserModal());
        document.getElementById('closeUserModal')?.addEventListener('click', () => this.closeModal('userModal'));
        document.getElementById('cancelUserForm')?.addEventListener('click', () => this.closeModal('userModal'));
        
        // Form submissions
        document.getElementById('userForm')?.addEventListener('submit', this.handleUserFormSubmit.bind(this));
        
        // Search and filters
        document.getElementById('userSearch')?.addEventListener('input', this.handleUserSearch.bind(this));
        document.getElementById('userStatusFilter')?.addEventListener('change', this.handleUserFilter.bind(this));
        document.getElementById('userRoleFilter')?.addEventListener('change', this.handleUserFilter.bind(this));
        
        // Header actions
        document.getElementById('notificationsBtn')?.addEventListener('click', this.showNotifications.bind(this));
        document.getElementById('settingsBtn')?.addEventListener('click', this.showSettings.bind(this));
        
        // Calendar navigation
        document.getElementById('prevMonth')?.addEventListener('click', this.navigatePrevMonth.bind(this));
        document.getElementById('nextMonth')?.addEventListener('click', this.navigateNextMonth.bind(this));
        
        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    setupSidebarToggle() {
        // Auto-collapse sidebar on smaller screens
        if (window.innerWidth <= 1024) {
            this.sidebarCollapsed = true;
            document.querySelector('.admin-sidebar').classList.add('collapsed');
        }
    }

    setupNavigation() {
        // Set initial active navigation
        this.setActiveNavigation('dashboard');
    }

    setupModals() {
        // Initialize modal functionality
        this.currentModalData = null;
    }

    checkAuthStatus() {
        // Check if admin is authenticated
        const adminToken = localStorage.getItem('admin_token');
        if (!adminToken) {
            // Redirect to login page
            window.location.href = 'admin-login.html';
            return;
        }
        
        // Load admin user data
        this.currentUser = JSON.parse(localStorage.getItem('admin_user') || '{}');
        this.updateAdminUI();
    }

    loadInitialData() {
        // Load dashboard data
        this.loadDashboardStats();
        this.loadUsers();
        this.loadAppointments();
        this.loadContent();
        this.loadRecentActivity();
    }

    // Navigation Methods
    navigateToSection(section) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(`${section}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Update page title
        this.updatePageTitle(section);
        
        // Set active navigation
        this.setActiveNavigation(section);
        
        this.currentSection = section;
    }

    setActiveNavigation(section) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[data-section="${section}"]`)?.closest('.nav-item');
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    updatePageTitle(section) {
        const titles = {
            dashboard: 'Dashboard',
            users: 'User Management',
            menu: 'Menu Management',
            content: 'Content Management',
            catalog: 'Catalog Management',
            academy: 'Academy Management',
            careers: 'Career Management',
            appointments: 'Appointment Management',
            newsletter: 'Newsletter Management',
            support: 'Support Tickets'
        };
        
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle && titles[section]) {
            pageTitle.textContent = titles[section];
        }
    }

    // Sidebar Methods
    toggleSidebar() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
        const sidebar = document.querySelector('.admin-sidebar');
        sidebar.classList.toggle('collapsed', this.sidebarCollapsed);
    }

    toggleMobileSidebar() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        const sidebar = document.querySelector('.admin-sidebar');
        sidebar.classList.toggle('mobile-open', this.mobileMenuOpen);
        
        // Prevent body scroll when mobile menu is open
        document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : 'auto';
    }

    // Data Loading Methods
    async loadDashboardStats() {
        // Simulate API call for dashboard statistics
        try {
            const stats = await this.fetchDashboardStats();
            this.updateDashboardStats(stats);
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    }

    async loadUsers() {
        try {
            const users = await this.fetchUsers();
            this.users = users;
            this.renderUsersTable(users);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    async loadAppointments() {
        try {
            const appointments = await this.fetchAppointments();
            this.appointments = appointments;
            this.renderAppointments(appointments);
        } catch (error) {
            console.error('Error loading appointments:', error);
        }
    }

    async loadContent() {
        try {
            const content = await this.fetchContent();
            this.content = content;
            this.renderContent(content);
        } catch (error) {
            console.error('Error loading content:', error);
        }
    }

    async loadRecentActivity() {
        try {
            const activity = await this.fetchRecentActivity();
            this.renderRecentActivity(activity);
        } catch (error) {
            console.error('Error loading recent activity:', error);
        }
    }

    // API Simulation Methods
    async fetchDashboardStats() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    totalUsers: 2847,
                    userGrowth: '+12%',
                    totalAppointments: 1254,
                    appointmentGrowth: '+8%',
                    productViews: 3678,
                    productGrowth: '-3%',
                    supportTickets: 89,
                    ticketGrowth: 'Same as last week'
                });
            }, 500);
        });
    }

    async fetchUsers() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        name: 'John Doe',
                        email: 'john.doe@email.com',
                        role: 'Patient',
                        status: 'Active',
                        registrationDate: '2025-03-15',
                        avatar: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
                    },
                    {
                        id: 2,
                        name: 'Sarah Johnson',
                        email: 'sarah.johnson@email.com',
                        role: 'Healthcare Provider',
                        status: 'Active',
                        registrationDate: '2025-03-14',
                        avatar: 'https://images.pexels.com/photos/4386476/pexels-photo-4386476.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
                    },
                    {
                        id: 3,
                        name: 'Michael Brown',
                        email: 'michael.brown@email.com',
                        role: 'Patient',
                        status: 'Inactive',
                        registrationDate: '2025-03-13',
                        avatar: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
                    }
                ]);
            }, 500);
        });
    }

    async fetchAppointments() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        patientName: 'Sarah Johnson',
                        type: 'Prosthetic Consultation',
                        category: 'Initial Assessment',
                        time: '09:00 AM',
                        duration: '60 min',
                        status: 'Confirmed',
                        date: '2025-03-20'
                    },
                    {
                        id: 2,
                        patientName: 'Michael Brown',
                        type: 'Follow-up',
                        category: 'Post-fitting Review',
                        time: '10:30 AM',
                        duration: '30 min',
                        status: 'Pending',
                        date: '2025-03-20'
                    }
                ]);
            }, 500);
        });
    }

    async fetchContent() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        title: 'About Us',
                        description: 'Company information and history',
                        lastUpdated: '2025-03-10',
                        status: 'Published'
                    },
                    {
                        id: 2,
                        title: 'Services Overview',
                        description: 'Comprehensive list of our medical services',
                        lastUpdated: '2025-03-08',
                        status: 'Draft'
                    }
                ]);
            }, 500);
        });
    }

    async fetchRecentActivity() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        type: 'user_registration',
                        description: 'New user registered: Sarah Johnson',
                        time: '5 minutes ago',
                        icon: 'fas fa-user-plus'
                    },
                    {
                        type: 'appointment_booking',
                        description: 'Appointment booked: Michael Brown - Prosthetic Consultation',
                        time: '12 minutes ago',
                        icon: 'fas fa-calendar'
                    },
                    {
                        type: 'content_update',
                        description: 'Content updated: About Us page modified',
                        time: '1 hour ago',
                        icon: 'fas fa-file-alt'
                    }
                ]);
            }, 500);
        });
    }

    // Rendering Methods
    updateDashboardStats(stats) {
        const statCards = document.querySelectorAll('.stat-card');
        
        if (statCards.length >= 4) {
            // Update total users
            statCards[0].querySelector('h3').textContent = stats.totalUsers.toLocaleString();
            statCards[0].querySelector('.stat-change').textContent = stats.userGrowth + ' this month';
            
            // Update appointments
            statCards[1].querySelector('h3').textContent = stats.totalAppointments.toLocaleString();
            statCards[1].querySelector('.stat-change').textContent = stats.appointmentGrowth + ' this week';
            
            // Update product views
            statCards[2].querySelector('h3').textContent = stats.productViews.toLocaleString();
            statCards[2].querySelector('.stat-change').textContent = stats.productGrowth + ' this month';
            
            // Update support tickets
            statCards[3].querySelector('h3').textContent = stats.supportTickets.toLocaleString();
            statCards[3].querySelector('.stat-change').textContent = stats.ticketGrowth;
        }
    }

    renderUsersTable(users) {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>
                    <div class="user-info">
                        <img src="${user.avatar}" alt="User" class="user-avatar">
                        <span>${user.name}</span>
                    </div>
                </td>
                <td>${user.email}</td>
                <td><span class="badge badge-info">${user.role}</span></td>
                <td><span class="status-badge ${user.status.toLowerCase()}">${user.status}</span></td>
                <td>${this.formatDate(user.registrationDate)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" title="View" onclick="adminPanel.viewUser(${user.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" title="Edit" onclick="adminPanel.editUser(${user.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" title="Delete" onclick="adminPanel.deleteUser(${user.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderAppointments(appointments) {
        const container = document.querySelector('.appointment-items');
        if (!container) return;
        
        container.innerHTML = appointments.map(appointment => `
            <div class="appointment-item">
                <div class="appointment-time">
                    <span class="time">${appointment.time}</span>
                    <span class="duration">${appointment.duration}</span>
                </div>
                <div class="appointment-details">
                    <h4>${appointment.patientName}</h4>
                    <p>${appointment.type}</p>
                    <span class="appointment-type">${appointment.category}</span>
                </div>
                <div class="appointment-status">
                    <span class="status-badge ${appointment.status.toLowerCase()}">${appointment.status}</span>
                </div>
                <div class="appointment-actions">
                    <button class="btn-icon" title="View Details" onclick="adminPanel.viewAppointment(${appointment.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" title="Edit" onclick="adminPanel.editAppointment(${appointment.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" title="Cancel" onclick="adminPanel.cancelAppointment(${appointment.id})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderContent(content) {
        const container = document.querySelector('.pages-grid');
        if (!container) return;
        
        container.innerHTML = content.map(page => `
            <div class="page-card">
                <div class="page-preview">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="page-info">
                    <h4>${page.title}</h4>
                    <p>${page.description}</p>
                    <div class="page-meta">
                        <span>Last updated: ${this.formatDate(page.lastUpdated)}</span>
                        <div class="page-actions">
                            <button class="btn-small" onclick="adminPanel.editContent(${page.id})">Edit</button>
                            <button class="btn-small btn-outline" onclick="adminPanel.previewContent(${page.id})">Preview</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderRecentActivity(activities) {
        const container = document.querySelector('.activity-list');
        if (!container) return;
        
        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p><strong>${activity.description}</strong></p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    // Modal Methods
    openUserModal(userData = null) {
        const modal = document.getElementById('userModal');
        const title = document.getElementById('userModalTitle');
        const form = document.getElementById('userForm');
        
        if (userData) {
            // Edit mode
            title.textContent = 'Edit User';
            this.populateUserForm(userData);
            this.currentModalData = userData;
        } else {
            // Add mode
            title.textContent = 'Add New User';
            form.reset();
            this.currentModalData = null;
        }
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    populateUserForm(userData) {
        document.getElementById('firstName').value = userData.firstName || '';
        document.getElementById('lastName').value = userData.lastName || '';
        document.getElementById('userEmail').value = userData.email || '';
        document.getElementById('userPhone').value = userData.phone || '';
        document.getElementById('userRole').value = userData.role || '';
        document.getElementById('userStatus').value = userData.status || '';
    }

    // Form Handling Methods
    async handleUserFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            role: formData.get('role'),
            status: formData.get('status')
        };
        
        try {
            this.showLoading(e.target);
            
            if (this.currentModalData) {
                // Update existing user
                await this.updateUser(this.currentModalData.id, userData);
                this.showNotification('User updated successfully!', 'success');
            } else {
                // Create new user
                await this.createUser(userData);
                this.showNotification('User created successfully!', 'success');
            }
            
            this.hideLoading(e.target);
            this.closeModal('userModal');
            this.loadUsers(); // Refresh users list
            
        } catch (error) {
            this.hideLoading(e.target);
            this.showNotification('Error saving user. Please try again.', 'error');
            console.error('Error saving user:', error);
        }
    }

    async createUser(userData) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Creating user:', userData);
                resolve({ success: true, id: Date.now() });
            }, 1000);
        });
    }

    async updateUser(userId, userData) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Updating user:', userId, userData);
                resolve({ success: true });
            }, 1000);
        });
    }

    // Search and Filter Methods
    handleUserSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredUsers = this.users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
        this.renderUsersTable(filteredUsers);
    }

    handleUserFilter() {
        const statusFilter = document.getElementById('userStatusFilter').value;
        const roleFilter = document.getElementById('userRoleFilter').value;
        
        let filteredUsers = this.users;
        
        if (statusFilter !== 'all') {
            filteredUsers = filteredUsers.filter(user => 
                user.status.toLowerCase() === statusFilter
            );
        }
        
        if (roleFilter !== 'all') {
            filteredUsers = filteredUsers.filter(user => 
                user.role.toLowerCase() === roleFilter
            );
        }
        
        this.renderUsersTable(filteredUsers);
    }

    // User Action Methods
    viewUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            alert(`Viewing user: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}`);
        }
    }

    editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            this.openUserModal(user);
        }
    }

    async deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await this.removeUser(userId);
                this.showNotification('User deleted successfully!', 'success');
                this.loadUsers();
            } catch (error) {
                this.showNotification('Error deleting user. Please try again.', 'error');
                console.error('Error deleting user:', error);
            }
        }
    }

    async removeUser(userId) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Deleting user:', userId);
                resolve({ success: true });
            }, 1000);
        });
    }

    // Appointment Methods
    viewAppointment(appointmentId) {
        const appointment = this.appointments.find(a => a.id === appointmentId);
        if (appointment) {
            alert(`Appointment Details:\nPatient: ${appointment.patientName}\nType: ${appointment.type}\nTime: ${appointment.time}\nStatus: ${appointment.status}`);
        }
    }

    editAppointment(appointmentId) {
        console.log('Edit appointment:', appointmentId);
        // Implementation would open appointment edit modal
    }

    async cancelAppointment(appointmentId) {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await this.updateAppointmentStatus(appointmentId, 'cancelled');
                this.showNotification('Appointment cancelled successfully!', 'success');
                this.loadAppointments();
            } catch (error) {
                this.showNotification('Error cancelling appointment. Please try again.', 'error');
                console.error('Error cancelling appointment:', error);
            }
        }
    }

    async updateAppointmentStatus(appointmentId, status) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Updating appointment status:', appointmentId, status);
                resolve({ success: true });
            }, 1000);
        });
    }

    // Content Methods
    editContent(contentId) {
        console.log('Edit content:', contentId);
        // Implementation would open content editor
    }

    previewContent(contentId) {
        console.log('Preview content:', contentId);
        // Implementation would open content preview
    }

    // Calendar Methods
    navigatePrevMonth() {
        console.log('Navigate to previous month');
        // Implementation would update calendar display
    }

    navigateNextMonth() {
        console.log('Navigate to next month');
        // Implementation would update calendar display
    }

    // Header Action Methods
    showNotifications() {
        alert('Notifications panel would open here');
    }

    showSettings() {
        alert('Settings panel would open here');
    }

    // Utility Methods
    updateAdminUI() {
        if (this.currentUser.name) {
            const adminName = document.querySelector('.admin-name');
            if (adminName) {
                adminName.textContent = this.currentUser.name;
            }
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

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
            submitBtn.textContent = submitBtn.dataset.originalText || 'Save';
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `admin-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    handleResize() {
        // Handle responsive behavior
        if (window.innerWidth <= 768) {
            // Mobile behavior
            if (this.mobileMenuOpen) {
                this.toggleMobileSidebar();
            }
        } else if (window.innerWidth <= 1024) {
            // Tablet behavior
            if (!this.sidebarCollapsed) {
                this.toggleSidebar();
            }
        } else {
            // Desktop behavior
            if (this.sidebarCollapsed && window.innerWidth > 1024) {
                this.toggleSidebar();
            }
        }
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
    
    // Add admin notification styles to head
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .admin-notification .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            transition: all 0.3s ease;
            margin-left: auto;
        }
        
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.2);
            color: white;
        }
    `;
    document.head.appendChild(notificationStyles);
});

// Export for potential use in other modules
window.AdminPanel = AdminPanel;