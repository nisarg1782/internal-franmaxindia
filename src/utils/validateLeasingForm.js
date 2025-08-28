export default function validateLeasingForm(form, selectedState, selectedCity, agreed) {
  const errors = {};

  if (!form.lease_name || !form.lease_name.trim()) {
    errors.lease_name = "Name is required";
  }

  if (!form.lease_mobile || !/^\d{10}$/.test(form.lease_mobile)) {
    errors.lease_mobile = "Valid 10-digit mobile required";
  }

  if (!form.lease_email || !/\S+@\S+\.\S+/.test(form.lease_email)) {
    errors.lease_email = "Valid email required";
  }

  if (!selectedState) {
    errors.state = "Please select a state";
  }

  if (!selectedCity) {
    errors.city = "Please select a city";
  }

  if (!agreed) {
    errors.terms = "You must agree to the terms";
  }

  return errors;
}
