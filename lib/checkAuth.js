export function checkCustomer() {
    if (!localStorage.getItem('customerId')) {
      alert('Please log in.');
      window.location.href = '/customer/login';
    }
  }
  
  export function checkStaff() {
    if (!localStorage.getItem('staffId')) {
      alert('Staff login required.');
      window.location.href = '/staff/login';
    }
  }
  