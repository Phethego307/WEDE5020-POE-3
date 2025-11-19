// Volunteer page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Volunteer form validation
    const volunteerForm = document.querySelector('form');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim();
            const role = document.getElementById('role').value;
            
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
            
            // Validate role selection
            if (isValid && role === '') {
                isValid = false;
                errorMessage = 'Please select a volunteer role.';
            }
            
            if (isValid) {
                // Simulate form submission
                showMessage('Thank you for your interest in volunteering! We will contact you soon.', 'success');
                volunteerForm.reset();
            } else {
                showMessage(errorMessage, 'error');
            }
        });
    }

    // Table row interaction
    const activityTable = document.querySelector('table');
    if (activityTable) {
        const rows = activityTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.addEventListener('click', function() {
                rows.forEach(r => r.style.backgroundColor = '');
                this.style.backgroundColor = '#e8f5e8';
            });
        });
    }

    // Role selection enhancement
    const roleSelect = document.getElementById('role');
    if (roleSelect) {
        roleSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption.value !== '') {
                showMessage(`You've selected: ${selectedOption.text}`, 'info');
            }
        });
    }

    // Blockquote styling enhancement
    const blockquotes = document.querySelectorAll('blockquote');
    blockquotes.forEach(blockquote => {
        blockquote.style.cssText = `
            border-left: 4px solid #4a7c59;
            padding-left: 20px;
            margin: 20px 0;
            font-style: italic;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
        `;
    });

    // Utility functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = message;
        
        const colors = {
            success: '#2d5a27',
            error: '#d32f2f',
            info: '#1976d2'
        };
        
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
            background: ${colors[type] || colors.info};
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