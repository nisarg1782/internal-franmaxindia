import { toast } from 'react-toastify';

export default function validateInvestorForm(form, state, city, sector, agreed) {
  let isValid = true;

  if (!form.investor_name.trim()) {
    toast.error('Full Name is required');
    isValid = false;
  }

  if (!form.investor_mobile) {
    toast.error('Mobile number is required');
    isValid = false;
  } else if (!/^[6-9][0-9]{9}$/.test(form.investor_mobile)) {
    toast.error('Mobile must start with 6/7/8/9 and be 10 digits');
    isValid = false;
  }

  if (!form.investor_email) {
    toast.error('Email is required');
    isValid = false;
  } else if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(form.investor_email)) {
    toast.error('Invalid email format');
    isValid = false;
  }

  if (!form.investor_password || form.investor_password.length < 6) {
    toast.error('Password must be at least 6 characters');
    isValid = false;
  }

  if (!state) {
    toast.error('Please select a State');
    isValid = false;
  }

  if (!city) {
    toast.error('Please select a City');
    isValid = false;
  }

  if (!sector) {
    toast.error('Please select a Sector');
    isValid = false;
  }

  if (!agreed) {
    toast.error('You must agree to the Terms & Conditions');
    isValid = false;
  }

  return isValid;
}
