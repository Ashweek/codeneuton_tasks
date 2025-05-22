document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const dayInput = document.getElementById('day');
    const monthSelect = document.getElementById('month');
    const yearInput = document.getElementById('year');
    const resultDiv = document.getElementById('result');
    const ageResult = document.getElementById('age-result');
    
    // Error elements
    const dayError = document.getElementById('day-error');
    const monthError = document.getElementById('month-error');
    const yearError = document.getElementById('year-error');
    
    // Set maximum year to current year
    yearInput.max = new Date().getFullYear();
    
    calculateBtn.addEventListener('click', function() {
        // Reset errors
        dayError.style.display = 'none';
        monthError.style.display = 'none';
        yearError.style.display = 'none';
        
        // Validate inputs
        let isValid = true;
        
        const day = parseInt(dayInput.value);
        const month = monthSelect.value;
        const year = parseInt(yearInput.value);
        const currentYear = new Date().getFullYear();
        
        if (isNaN(day) || day < 1 || day > 31) {
            dayError.style.display = 'block';
            isValid = false;
        }
        
        if (month === '') {
            monthError.style.display = 'block';
            isValid = false;
        }
        
        if (isNaN(year) || year < 1900 || year > currentYear) {
            yearError.style.display = 'block';
            yearError.textContent = `Please enter a valid year (1900-${currentYear})`;
            isValid = false;
        }
        
        if (!isValid) {
            resultDiv.style.display = 'none';
            return;
        }
        
        // Calculate age
        const birthDate = new Date(year, parseInt(month), day);
        const today = new Date();
        
        // Validate the date (e.g., Feb 30)
        if (birthDate.getDate() !== day || 
            birthDate.getMonth() !== parseInt(month) || 
            birthDate.getFullYear() !== year) {
            dayError.style.display = 'block';
            dayError.textContent = 'Invalid date for the selected month/year';
            resultDiv.style.display = 'none';
            return;
        }
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        // Display result
        ageResult.textContent = `You are ${age} years old`;
        resultDiv.style.display = 'block';
    });
    
    // Additional validation for day input based on month selection
    monthSelect.addEventListener('change', function() {
        const month = parseInt(monthSelect.value);
        const day = parseInt(dayInput.value);
        
        if (isNaN(day)) return;
        
        // Check for months with 30 days
        if ([3, 5, 8, 10].includes(month) && day > 30) {
            dayError.style.display = 'block';
            dayError.textContent = 'This month only has 30 days';
        } 
        // Check for February
        else if (month === 1) {
            const year = parseInt(yearInput.value);
            if (!isNaN(year)) {
                const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
                if ((isLeapYear && day > 29) || (!isLeapYear && day > 28)) {
                    dayError.style.display = 'block';
                    dayError.textContent = isLeapYear ? 
                        'February has only 29 days in leap years' : 
                        'February has only 28 days this year';
                }
            }
        } else {
            dayError.style.display = 'none';
        }
    });
});