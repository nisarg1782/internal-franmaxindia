export const validateLeaseForm = (formData, toast) => {
  const nameRegex = /^[A-Za-z\s]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formData.ownerName.trim()) {
    toast.error("Owner name cannot be empty.");
    return false;
  }

  if (!nameRegex.test(formData.ownerName.trim())) {
    toast.error("Owner name must contain only letters and spaces.");
    return false;
  }

  if (!formData.contact || !phoneRegex.test(formData.contact)) {
    toast.error("Enter valid 10-digit contact number starting with 6-9.");
    return false;
  }

  if (!formData.email || !emailRegex.test(formData.email)) {
    toast.error("Enter a valid email address.");
    return false;
  }

  if (!formData.stateId || !formData.cityId) {
    toast.error("Please select both state and city.");
    return false;
  }

  if (!formData.address.trim()) {
    toast.error("Address cannot be empty.");
    return false;
  }

  if (!formData.expectedRent || parseFloat(formData.expectedRent) <= 0) {
    toast.error("Expected rent must be a positive number.");
    return false;
  }

  if (!formData.sqft) {
    toast.error("Please select property area.");
    return false;
  }

  if (!formData.propertyType) {
    toast.error("Please select a property type.");
    return false;
  }

  if (!formData.floorType) {
    toast.error("Please select a floor type.");
    return false;
  }

  return true;
};
