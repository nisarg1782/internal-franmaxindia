// File: src/utils/validatePartnerForm.js

export const validatePartnerForm = (form) => {
  const errors = [];

  if (!form.name.trim()) {
    errors.push("Name is required.");
  }

  if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.push("Valid email is required.");
  }

  if (!form.contact.trim() || !/^[6-9]\d{9}$/.test(form.contact)) {
    errors.push("Contact must be 10 digits starting with 6-9.");
  }

  if (!form.state_id || isNaN(form.state_id)) {
    errors.push("State is required.");
  }

  if (!form.city_id || isNaN(form.city_id)) {
    errors.push("City is required.");
  }

  if (!form.message.trim()) {
    errors.push("Message is required.");
  }

  return errors;
};
