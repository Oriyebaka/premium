/**
 * Premium Preversity - Form to Google Sheets
 * This script handles the submission of form data to Google Sheets
 */

// Configuration
const CONFIG = {
    // Replace with your Google Apps Script Web App URL
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxrjTgkAzoXttNjkTwgj4HeQpKYl8l6tqV4qlk_88I6k_PnWCUIaWc7YgRkBhqptWiX1w/exec',
    
    // Form and element IDs
    FORM_ID: 'registration-form',
    LOADING_SPINNER_ID: 'loading-spinner',
    VERIFICATION_CODE_ID: 'verification_code',
    HIDDEN_VERIFICATION_CODE_ID: 'hidden_verification_code',
    
    // Redirect URLs
    SUCCESS_PAGE: 'registration-success.html',
    ERROR_PAGE: 'registration-error.html',
    
    // Required fields for validation
    REQUIRED_FIELDS: [
      'first_name', 
      'last_name', 
      'gender', 
      'dob', 
      'phone1', 
      'address', 
      'state', 
      'country',
      'verification_code'
    ]
  };
  
  /**
   * Initialize the form submission handler
   */
  function initFormSubmission() {
    const form = document.getElementById(CONFIG.FORM_ID);
    
    if (!form) {
      console.error('Form not found with ID:', CONFIG.FORM_ID);
      return;
    }
    
    // Add submit event listener
    form.addEventListener('submit', handleFormSubmit);
    
    // Add input event listeners for validation
    CONFIG.REQUIRED_FIELDS.forEach(fieldName => {
      const field = form.elements[fieldName];
      if (field) {
        field.addEventListener('input', () => {
          validateField(field);
        });
      }
    });
    
    console.log('Form submission handler initialized');
  }
  
  /**
   * Validate a single form field
   */
  function validateField(field) {
    // Remove existing error messages
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // Remove error styling
    field.classList.remove('border-red-500');
    
    // Check if field is required and empty
    if (CONFIG.REQUIRED_FIELDS.includes(field.name) && !field.value.trim()) {
      // Add error styling
      field.classList.add('border-red-500');
      
      // Add error message
      const errorMsg = document.createElement('p');
      errorMsg.className = 'error-message text-red-500 text-sm mt-1';
      errorMsg.textContent = 'This field is required';
      field.parentNode.appendChild(errorMsg);
      
      return false;
    }
    
    return true;
  }
  
  /**
   * Validate the entire form
   */
  function validateForm(form) {
    let isValid = true;
    
    // Validate each required field
    CONFIG.REQUIRED_FIELDS.forEach(fieldName => {
      const field = form.elements[fieldName];
      if (field) {
        if (!validateField(field)) {
          isValid = false;
        }
      }
    });
    
    // Check attestation checkboxes
    const attestationCheckboxes = form.querySelectorAll('input[id^="attestation"]');
    let attestationsChecked = true;
    
    attestationCheckboxes.forEach(checkbox => {
      if (!checkbox.checked) {
        attestationsChecked = false;
      }
    });
    
    if (!attestationsChecked && form.querySelector('#form-attestation') && !form.querySelector('#form-attestation').classList.contains('hidden')) {
      // Show attestation error if we're on the attestation tab
      const errorContainer = document.createElement('div');
      errorContainer.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4';
      errorContainer.innerHTML = '<p>Please agree to all terms and conditions</p>';
      
      // Remove any existing error messages
      const existingError = form.querySelector('.attestation-error');
      if (existingError) {
        existingError.remove();
      }
      
      errorContainer.classList.add('attestation-error');
      form.querySelector('#form-attestation').appendChild(errorContainer);
      
      isValid = false;
    }
    
    return isValid;
  }
  
  /**
   * Handle form submission
   */
  function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    
    // Validate form
    if (!validateForm(form)) {
      // Scroll to the first error
      const firstError = form.querySelector('.error-message') || form.querySelector('.attestation-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // Copy verification code to hidden field
    const verificationCode = document.getElementById(CONFIG.VERIFICATION_CODE_ID).value;
    const hiddenVerificationCode = document.getElementById(CONFIG.HIDDEN_VERIFICATION_CODE_ID);
    if (hiddenVerificationCode) {
      hiddenVerificationCode.value = verificationCode;
    }
    
    // Show loading spinner
    const loadingSpinner = document.getElementById(CONFIG.LOADING_SPINNER_ID);
    if (loadingSpinner) {
      loadingSpinner.classList.remove('hidden');
    }
    
    // Get form data
    const formData = new FormData(form);
    
    // Submit form using one of two methods (try fetch first, fallback to iframe)
    submitFormWithFetch(formData)
      .catch(error => {
        console.warn('Fetch submission failed, trying iframe method:', error);
        return submitFormWithIframe(formData);
      })
      .then(result => {
        // Hide loading spinner
        if (loadingSpinner) {
          loadingSpinner.classList.add('hidden');
        }
        
        // Redirect to success page
        window.location.href = CONFIG.SUCCESS_PAGE;
      })
      .catch(error => {
        console.error('Form submission failed:', error);
        
        // Hide loading spinner
        if (loadingSpinner) {
          loadingSpinner.classList.add('hidden');
        }
        
        // Redirect to error page
        window.location.href = `${CONFIG.ERROR_PAGE}?message=${encodeURIComponent(error.message || 'Form submission failed')}`;
      });
  }
  
  /**
   * Submit form using fetch API (modern browsers)
   */
  function submitFormWithFetch(formData) {
    return new Promise((resolve, reject) => {
      // Convert FormData to URL-encoded string
      const data = new URLSearchParams(formData);
      
      fetch(CONFIG.SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // This is important for CORS issues
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data
      })
      .then(response => {
        // Since mode is no-cors, we can't actually read the response
        // We'll just assume it worked if we got here
        resolve({ success: true });
      })
      .catch(error => {
        reject(error);
      });
    });
  }
  
  /**
   * Submit form using iframe (fallback for older browsers or CORS issues)
   */
  function submitFormWithIframe(formData) {
    return new Promise((resolve, reject) => {
      try {
        // Create an invisible iframe
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        // Create a form inside the iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const iframeForm = iframeDoc.createElement('form');
        iframeForm.method = 'POST';
        iframeForm.action = CONFIG.SCRIPT_URL;
        
        // Add all form fields to the iframe form
        for (const pair of formData.entries()) {
          const input = iframeDoc.createElement('input');
          input.type = 'hidden';
          input.name = pair[0];
          input.value = pair[1];
          iframeForm.appendChild(input);
        }
        
        // Add the form to the iframe and submit it
        iframeDoc.body.appendChild(iframeForm);
        iframeForm.submit();
        
        // We can't really know if it worked, so we'll just assume it did after a delay
        setTimeout(() => {
          resolve({ success: true });
        }, 2000);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * Save form progress to localStorage
   */
  function saveFormProgress() {
    const form = document.getElementById(CONFIG.FORM_ID);
    if (!form) return;
    
    const formData = new FormData(form);
    const formValues = {};
    
    for (const pair of formData.entries()) {
      formValues[pair[0]] = pair[1];
    }
    
    localStorage.setItem('formProgress', JSON.stringify(formValues));
    
    // Show saved notification
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg';
    notification.textContent = 'Form progress saved';
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  /**
   * Load form progress from localStorage
   */
  function loadFormProgress() {
    const savedData = localStorage.getItem('formProgress');
    if (!savedData) return;
    
    const form = document.getElementById(CONFIG.FORM_ID);
    if (!form) return;
    
    const formValues = JSON.parse(savedData);
    
    // Fill form fields with saved values
    Object.keys(formValues).forEach(key => {
      const field = form.elements[key];
      if (field) {
        if (field.type === 'checkbox') {
          field.checked = formValues[key] === 'on';
        } else {
          field.value = formValues[key];
        }
      }
    });
    
    // Show loaded notification
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg';
    notification.textContent = 'Form progress loaded';
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  /**
   * Add auto-save functionality
   */
  function setupAutoSave() {
    const form = document.getElementById(CONFIG.FORM_ID);
    if (!form) return;
    
    // Save form data every 30 seconds
    setInterval(saveFormProgress, 30000);
    
    // Save when switching tabs
    document.querySelectorAll('[id^="next-to-"], [id^="back-to-"]').forEach(button => {
      button.addEventListener('click', saveFormProgress);
    });
    
    // Add save/load buttons
    const saveLoadContainer = document.createElement('div');
    saveLoadContainer.className = 'flex justify-between mt-4 mb-2';
    saveLoadContainer.innerHTML = `
      <button type="button" id="save-progress" class="text-sm text-gray-600 hover:text-primary flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        Save Progress
      </button>
      <button type="button" id="load-progress" class="text-sm text-gray-600 hover:text-primary flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Load Saved Progress
      </button>
    `;
    
    form.parentNode.insertBefore(saveLoadContainer, form);
    
    document.getElementById('save-progress').addEventListener('click', saveFormProgress);
    document.getElementById('load-progress').addEventListener('click', loadFormProgress);
  }
  
  // Initialize when the DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    initFormSubmission();
    setupAutoSave();
    
    // Try to load saved progress
    if (localStorage.getItem('formProgress')) {
      // Add a load button notification
      const notification = document.createElement('div');
      notification.className = 'bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4';
      notification.innerHTML = `
        <div class="flex justify-between items-center">
          <p>You have a saved form. Would you like to load it?</p>
          <button id="load-saved-form" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
            Load Saved Form
          </button>
        </div>
      `;
      
      const formContainer = document.getElementById('form-container');
      if (formContainer) {
        formContainer.parentNode.insertBefore(notification, formContainer);
        document.getElementById('load-saved-form').addEventListener('click', () => {
          loadFormProgress();
          notification.remove();
        });
      }
    }
  });