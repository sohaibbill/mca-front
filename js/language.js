// Language switching functionality for Medical Care Alliance

class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.rtlLanguages = ['ar'];
        this.translations = {};
        
        this.init();
    }

    init() {
        this.setupLanguageButtons();
        this.loadLanguageFromStorage();
        this.updateLanguageDisplay();
    }

    setupLanguageButtons() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                this.switchLanguage(lang);
            });
        });
    }

    switchLanguage(lang) {
        if (lang === this.currentLanguage) return;
        
        this.currentLanguage = lang;
        this.saveLanguageToStorage(lang);
        this.updateLanguageDisplay();
        this.updateDocumentDirection();
        this.updateLanguageButtons();
        
        // Trigger custom event for other components
        const event = new CustomEvent('languageChanged', {
            detail: { language: lang }
        });
        document.dispatchEvent(event);
    }

    updateLanguageDisplay() {
        const elements = document.querySelectorAll('[data-en][data-ar]');
        
        elements.forEach(element => {
            const key = this.currentLanguage === 'ar' ? 'data-ar' : 'data-en';
            const translation = element.getAttribute(key);
            
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else if (element.tagName === 'OPTION') {
                    element.textContent = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // Update document language attribute
        document.documentElement.lang = this.currentLanguage;
    }

    updateDocumentDirection() {
        const isRTL = this.rtlLanguages.includes(this.currentLanguage);
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        
        // Update body class for additional styling if needed
        document.body.classList.toggle('rtl', isRTL);
    }

    updateLanguageButtons() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === this.currentLanguage) {
                btn.classList.add('active');
            }
        });
    }

    saveLanguageToStorage(lang) {
        try {
            localStorage.setItem('mca_language', lang);
        } catch (error) {
            console.warn('Could not save language preference:', error);
        }
    }

    loadLanguageFromStorage() {
        try {
            const savedLang = localStorage.getItem('mca_language');
            if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
                this.currentLanguage = savedLang;
            }
        } catch (error) {
            console.warn('Could not load language preference:', error);
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    isRTL() {
        return this.rtlLanguages.includes(this.currentLanguage);
    }

    // Method to add new translations dynamically
    addTranslations(translations) {
        this.translations = { ...this.translations, ...translations };
    }

    // Method to get translation for a key
    translate(key, fallback = key) {
        const langTranslations = this.translations[this.currentLanguage];
        if (langTranslations && langTranslations[key]) {
            return langTranslations[key];
        }
        return fallback;
    }

    // Method to format numbers based on language
    formatNumber(number) {
        const locale = this.currentLanguage === 'ar' ? 'ar-SA' : 'en-US';
        return new Intl.NumberFormat(locale).format(number);
    }

    // Method to format dates based on language
    formatDate(date, options = {}) {
        const locale = this.currentLanguage === 'ar' ? 'ar-SA' : 'en-US';
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(date);
    }

    // Method to format currency based on language
    formatCurrency(amount, currency = 'USD') {
        const locale = this.currentLanguage === 'ar' ? 'ar-SA' : 'en-US';
        const currencyCode = this.currentLanguage === 'ar' ? 'SAR' : currency;
        
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyCode
        }).format(amount);
    }

    // Method to handle form validation messages
    getValidationMessage(field, type) {
        const messages = {
            en: {
                required: `${field} is required`,
                email: 'Please enter a valid email address',
                phone: 'Please enter a valid phone number',
                password: 'Password must be at least 8 characters long'
            },
            ar: {
                required: `${field} مطلوب`,
                email: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
                phone: 'يرجى إدخال رقم هاتف صحيح',
                password: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل'
            }
        };
        
        return messages[this.currentLanguage][type] || messages.en[type];
    }

    // Method to update placeholder text for dynamic elements
    updatePlaceholders() {
        const placeholders = {
            en: {
                search: 'Search...',
                selectDate: 'Select date',
                selectTime: 'Select time',
                enterName: 'Enter your name',
                enterEmail: 'Enter your email',
                enterPhone: 'Enter your phone number',
                enterMessage: 'Enter your message'
            },
            ar: {
                search: 'بحث...',
                selectDate: 'اختر التاريخ',
                selectTime: 'اختر الوقت',
                enterName: 'أدخل اسمك',
                enterEmail: 'أدخل بريدك الإلكتروني',
                enterPhone: 'أدخل رقم هاتفك',
                enterMessage: 'أدخل رسالتك'
            }
        };

        const currentPlaceholders = placeholders[this.currentLanguage];
        
        // Update search inputs
        document.querySelectorAll('input[type="search"]').forEach(input => {
            input.placeholder = currentPlaceholders.search;
        });
        
        // Update other form inputs based on their context
        document.querySelectorAll('input[name="patientName"]').forEach(input => {
            input.placeholder = currentPlaceholders.enterName;
        });
        
        document.querySelectorAll('input[type="email"]').forEach(input => {
            input.placeholder = currentPlaceholders.enterEmail;
        });
        
        document.querySelectorAll('input[type="tel"]').forEach(input => {
            input.placeholder = currentPlaceholders.enterPhone;
        });
        
        document.querySelectorAll('textarea').forEach(textarea => {
            if (!textarea.placeholder) {
                textarea.placeholder = currentPlaceholders.enterMessage;
            }
        });
    }
}

// Initialize language manager
const languageManager = new LanguageManager();

// Listen for language changes to update dynamic content
document.addEventListener('languageChanged', (event) => {
    const newLanguage = event.detail.language;
    
    // Update any dynamic content that depends on language
    languageManager.updatePlaceholders();
    
    // Update any number/date/currency displays
    document.querySelectorAll('[data-number]').forEach(element => {
        const number = parseFloat(element.dataset.number);
        element.textContent = languageManager.formatNumber(number);
    });
    
    document.querySelectorAll('[data-date]').forEach(element => {
        const date = new Date(element.dataset.date);
        element.textContent = languageManager.formatDate(date);
    });
    
    document.querySelectorAll('[data-currency]').forEach(element => {
        const amount = parseFloat(element.dataset.currency);
        element.textContent = languageManager.formatCurrency(amount);
    });
    
    // Trigger any custom updates needed by other components
    if (window.MedicalCareAlliance) {
        // Notify main app about language change
        console.log(`Language switched to: ${newLanguage}`);
    }
});

// Export for use in other modules
window.LanguageManager = LanguageManager;
window.languageManager = languageManager;