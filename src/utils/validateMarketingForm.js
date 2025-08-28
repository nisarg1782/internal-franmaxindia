export const validateMarketingForm = (form) => {
  const errors = [];

  if (!form.name.trim()) errors.push("Name is required.");
  if (!form.brand_name.trim()) errors.push("Brand name is required.");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email || !emailRegex.test(form.email)) errors.push("Valid email is required.");
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!form.contact || !phoneRegex.test(form.contact)) errors.push("Phone must start with 6-9 and be 10 digits.");
  if (!form.state_id) errors.push("Select a state.");
  if (!form.city_id) errors.push("Select a city.");

  return errors;
};
