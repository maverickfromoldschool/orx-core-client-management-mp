import {Product} from './types';

/**
 * Generate mock products for testing and development
 */
export const generateMockProducts = (count = 10): Product[] => {
  const productNames = [
    'Deposit',
    'ACH Credits Received',
    'Telephone Transfer Debit',
    'Teller Cashed Check',
    'Bill Pay Check',
    'Wire Transfer',
    'ATM Withdrawal',
    'Debit Card Purchase',
    'Online Banking Transfer',
    'Mobile Deposit'
  ];

  const productGroups = ['ANLYS-GEN', 'TRANS-FEE', 'MAINT-CHG', 'SERV-FEE'];

  const productGroupLinks = ['Account Services', 'Transaction Services', 'Maintenance Services', 'Service Fees'];

  const productTypes = ['Standard Unit (STD)', 'Premium Unit (PRM)', 'Basic Unit (BSC)'];

  const chargeTypes = ['Usage Based', 'Fixed Fee', 'Tiered Pricing'];

  const statuses: ('active' | 'inactive' | 'pending' | undefined)[] = [
    'active',
    'active',
    'active',
    'inactive',
    'pending',
    undefined
  ];

  const products: Product[] = [];

  for (let i = 0; i < count; i += 1) {
    const productIndex = i % productNames.length;
    const groupIndex = i % productGroups.length;

    products.push({
      id: `${i + 1}`,
      product: productNames[productIndex] || 'Unknown Product',
      productCode: `00${220 + i}`,
      productGroup: productGroups[groupIndex] || 'Unknown Group',
      productGroupLink: productGroupLinks[groupIndex],
      productType: productTypes[i % productTypes.length] || 'Standard Unit (STD)',
      chargeType: chargeTypes[i % chargeTypes.length] || 'Usage Based',
      effectiveDate: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}/2024`,
      status: statuses[i % statuses.length]
    });
  }

  return products;
};

/**
 * Sample products for quick testing
 */
export const sampleProducts: Product[] = [
  {
    id: '1',
    product: 'Deposit',
    productCode: '00220',
    productGroup: 'ANLYS-GEN',
    productGroupLink: 'Account Services',
    productType: 'Standard Unit (STD)',
    chargeType: 'Usage Based',
    effectiveDate: '01/15/2024',
    status: 'active'
  },
  {
    id: '2',
    product: 'ACH Credits Received',
    productCode: '00221',
    productGroup: 'ANLYS-GEN',
    productGroupLink: 'Account Services',
    productType: 'Standard Unit (STD)',
    chargeType: 'Usage Based',
    effectiveDate: '02/20/2024',
    status: 'active'
  },
  {
    id: '3',
    product: 'Telephone Transfer Debit',
    productCode: '00222',
    productGroup: 'ANLYS-GEN',
    productGroupLink: 'Account Services',
    productType: 'Standard Unit (STD)',
    chargeType: 'Usage Based',
    effectiveDate: '03/10/2024',
    status: 'inactive'
  },
  {
    id: '4',
    product: 'Teller Cashed Check',
    productCode: '00223',
    productGroup: 'TRANS-FEE',
    productGroupLink: 'Transaction Services',
    productType: 'Premium Unit (PRM)',
    chargeType: 'Fixed Fee',
    effectiveDate: '04/05/2024',
    status: 'active'
  },
  {
    id: '5',
    product: 'Bill Pay Check',
    productCode: '00224',
    productGroup: 'TRANS-FEE',
    productGroupLink: 'Transaction Services',
    productType: 'Standard Unit (STD)',
    chargeType: 'Usage Based',
    effectiveDate: '05/12/2024',
    status: 'pending'
  }
];
