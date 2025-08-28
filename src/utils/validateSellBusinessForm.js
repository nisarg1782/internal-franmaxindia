export const validateSellBusinessForm = (formData, toast) => {
  const { businessName, name, email, contact, stateId, cityId, expectedAmount, sectorId, address } = formData;

  if (!name.trim()) {
    toast.error("Owner name is required");
    return false;
  }

  if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
    toast.error("Valid email is required");
    return false;
  }

  if (!/^[6-9]\d{9}$/.test(contact)) {
    toast.error("Valid 10-digit mobile number is required");
    return false;
  }

  if (!stateId) {
    toast.error("Please select a State");
    return false;
  }

  if (!cityId) {
    toast.error("Please select a City");
    return false;
  }

  if (!expectedAmount.trim()) {
    toast.error("Expected amount is required");
    return false;
  }

  if (!sectorId) {
    toast.error("Please select a Sector");
    return false;
  }

  if (!address.trim()) {
    toast.error("Address is required");
    return false;
  }

  return true;
};
