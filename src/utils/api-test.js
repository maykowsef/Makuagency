import { api } from '../config/api';

export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test getting companies
    const companies = await api.getCompanies();
    console.log('✅ Companies loaded:', companies.length);
    
    // Test getting contacts
    const contacts = await api.getContacts();
    console.log('✅ Contacts loaded:', contacts.length);
    
    // Test getting selling points
    const sellingPoints = await api.getSellingPoints();
    console.log('✅ Selling points loaded:', sellingPoints.length);
    
    return { success: true, companies, contacts, sellingPoints };
  } catch (error) {
    console.error('❌ API connection failed:', error);
    return { success: false, error };
  }
};
