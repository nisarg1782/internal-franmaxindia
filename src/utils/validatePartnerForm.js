export default function validatePartnerForm(form, state, city, agreed) {
  const errors = {};

  // ✅ Updated to use the correct, shorter field names
  const name = form?.name?.trim?.() || "";
  const mobile = form?.mobile?.trim?.() || "";
  const email = form?.email?.trim?.() || "";
  const password = form?.password?.trim?.() || "";

  if (!name) errors.name = "Full Name is required";
  if (!mobile) errors.mobile = "Mobile number is required";
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";

  if (!state) errors.state = "Please select a state";
  if (!city) errors.city = "Please select a city";
  if (!agreed) errors.terms = "You must agree to the Terms & Conditions";

  return errors;
}
