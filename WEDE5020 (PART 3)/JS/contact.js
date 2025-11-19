// Contact page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Contact form validation
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            let isValid = true;
            let errorMessage = '';
            
            // Validate full name
            if (fullName === '') {
                isValid = false;
                errorMessage = 'Please enter your full name.';
            } else if (fullName.length < 2) {
                isValid = false;
                errorMessage = 'Please enter a valid full name.';
            }
            
            // Validate email
            if (isValid && !validateEmail(email)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
            
            // Validate subject
            if (isValid && subject === '') {
                isValid = false;
                errorMessage = 'Please enter a subject for your message.';
            } else if (isValid && subject.length < 5) {
                isValid = false;
                errorMessage = 'Subject must be at least 5 characters long.';
            }
            
            // Validate message
            if (isValid && message === '') {
                isValid = false;
                errorMessage = 'Please enter your message.';
            } else if (isValid && message.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long.';
            }
            
            if (isValid) {
                // Simulate form submission
                showMessage('Thank you for your message! We will get back to you soon.', 'success');
                contactForm.reset();
            } else {
                showMessage(errorMessage, 'error');
            }
        });
    }

    // Form field real-time validation
    const formFields = document.querySelectorAll('input, textarea');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            clearFieldError(this);
        });
    });

    // Contact table enhancement
    const contactTable = document.querySelector('table');
    if (contactTable) {
        const rows = contactTable.querySelectorAll('tr');
        rows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#f8f9fa';
                this.style.transition = 'background-color 0.3s ease';
            });
            
            row.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
            });
        });
    }

    // Auto-resize textarea
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        messageTextarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }

    // Field validation functions
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        switch (field.type) {
            case 'text':
                if (field.id === 'fullname') {
                    isValid = value.length >= 2;
                } else if (field.id === 'subject') {
                    isValid = value.length >= 5;
                }
                break;
            case 'email':
                isValid = validateEmail(value);
                break;
            case 'textarea':
                isValid = value.length >= 10;
                break;
        }
        
        if (!isValid && value !== '') {
            showFieldError(field, getFieldErrorMessage(field));
        } else {
            clearFieldError(field);
        }
        
        return isValid;
    }

    function getFieldErrorMessage(field) {
        switch (field.type) {
            case 'text':
                if (field.id === 'fullname') {
                    return 'Please enter a valid name (at least 2 characters)';
                } else if (field.id === 'subject') {
                    return 'Subject must be at least 5 characters long';
                }
                break;
            case 'email':
                return 'Please enter a valid email address';
            case 'textarea':
                return 'Message must be at least 10 characters long';
            default:
                return 'Please fill out this field';
        }
    }

    function showFieldError(field, message) {
        clearFieldError(field);
        field.style.borderColor = '#d32f2f';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #d32f2f;
            font-size: 0.9em;
            margin-top: 5px;
            font-weight: bold;
        `;
        
        field.parentNode.appendChild(errorDiv);
    }

    function clearFieldError(field) {
        field.style.borderColor = '';
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // Utility functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            z-index: 10000;
            font-weight: bold;
            transition: all 0.3s ease;
            ${type === 'success' ? 'background: #2d5a27;' : 'background: #d32f2f;'}
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 4000);
    }
});