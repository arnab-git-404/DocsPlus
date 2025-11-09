

export const COMPANY_LOCATIONS = {
  BIHAR: {
    name: 'HACKENCE SERVICES',
    address: 'Balbhadrapur, Laheriasarai',
    city: 'Darbhanga',
    state: 'Bihar',
    pincode: '846004',
    phone: '+91 9472948357',
    email: 'hackence.services@gmail.com',
    website: 'www.hackence.com',
    gstin: '', // Add if available
  },
  KOLKATA: {
    name: 'HACKENCE SERVICES',
    address: 'Sonargaon gate number 1, Sonarpur',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700150',
    phone: '+91 9472948357',
    email: 'hackence.services@gmail.com',
    website: 'www.hackence.com',
    gstin: '', // Add Kolkata GSTIN if available
  },
};


export type CompanyLocationType = keyof typeof COMPANY_LOCATIONS;

export const getCompanyDetails = (location: CompanyLocationType) => {
  return COMPANY_LOCATIONS[location];
};