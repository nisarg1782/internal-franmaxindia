import { toast } from 'react-toastify';

export default function validateBrandForm(form, state, city, category, agreed) {
  const errors = {};

  if (!form.brand_name.trim()) errors.brand_name = 'Brand name is required';
  if (!form.brand_mobile.trim()) errors.brand_mobile = 'Mobile is required';
  if (!form.brand_email.trim()) errors.brand_email = 'Email is required';
  if (!form.brand_password.trim()) errors.brand_password = 'Password is required';
  if (!state) errors.state = 'Select a state';
  if (!city) errors.city = 'Select a city';
  if (!category) errors.category = 'Select a category';
  if (!agreed) errors.terms = 'You must agree to the terms';

  return errors;
}
