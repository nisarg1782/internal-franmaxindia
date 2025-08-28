export function validateConnectForm(formData) {
  const errors = {};

  if (!formData.brand_connect_name) errors.brand_connect_name = 'Name is required';
  if (!formData.brand_connect_mobile) errors.brand_connect_mobile = 'Phone number is required';
  if (!formData.brand_connect_email || !/\S+@\S+\.\S+/.test(formData.brand_connect_email)) {
    errors.brand_connect_email = 'Valid email is required';
  }
  if (!formData.brand_connect_state) errors.brand_connect_state = 'State is required';
  if (!formData.brand_connect_city) errors.brand_connect_city = 'City is required';
  if (!formData.brand_connect_message) errors.brand_connect_message = 'Message is required';

  return errors;
}
