import Fuse from 'fuse.js';
import { fyo } from 'src/initFyo';

interface PaymentRow {
  [key: string]: any;
}

interface Customer {
  name: string;
  email?: string;
  phone?: string;
  monthlyAmount: number;
}

interface VerificationResult {
  correct: (Customer & { paidAmount?: number; rawData?: PaymentRow; csvName?: string })[];
  incorrect: (Customer & { paidAmount: number; rawData?: PaymentRow; csvName?: string })[];
  missing: Customer[];
}

/**
 * Get dynamic threshold based on name length
 * Shorter names need stricter matching to avoid false positives
 */
function getDynamicThreshold(name: string): number {
  const length = name.trim().length;
  if (length < 6) return 0.15;  // Very strict for short names
  if (length < 12) return 0.25; // Moderate for medium names
  return 0.35;                   // More tolerant for long names
}

/**
 * Check if a match is good enough based on score
 */
function isGoodMatch(score: number | undefined, maxScore: number = 0.3): boolean {
  return score !== undefined && score <= maxScore;
}

/**
 * Verify payments from uploaded file against subscription customers
 */
export async function verifyPayments(
  paymentData: PaymentRow[],
  nameColumn: string,
  amountColumn: string
): Promise<VerificationResult> {
  // Get all subscription customers from database
  const customers = await getSubscriptionCustomers();

  const result: VerificationResult = {
    correct: [],
    incorrect: [],
    missing: [],
  };

  // Track which customers have been matched
  const matchedCustomers = new Set<string>();

  // Check each customer
  for (const customer of customers) {
    const dynamicThreshold = getDynamicThreshold(customer.name);

    // Configure Fuse.js with dynamic threshold for this customer
    const fuse = new Fuse(paymentData, {
      keys: [nameColumn],
      threshold: dynamicThreshold,
      ignoreLocation: true,
      includeScore: true,
    });

    const searchResults = fuse.search(customer.name);

    // Filter results by score quality
    const goodMatches = searchResults.filter(result =>
      isGoodMatch(result.score, 0.3)
    );

    if (goodMatches.length > 0) {
      // Take the best match (lowest score)
      const match = goodMatches[0];
      const paidAmount = parseAmount(match.item[amountColumn]);
      const csvName = match.item[nameColumn]; // Get the actual name from CSV

      if (Math.abs(paidAmount - customer.monthlyAmount) < 0.01) {
        // Amount matches (within 1 cent tolerance)
        result.correct.push({
          ...customer,
          paidAmount,
          rawData: match.item,
          csvName,
        });
      } else {
        // Amount mismatch
        result.incorrect.push({
          ...customer,
          paidAmount,
          rawData: match.item,
          csvName,
        });
      }

      matchedCustomers.add(customer.name);
    } else {
      // No good match found for this customer
      result.missing.push(customer);
    }
  }

  return result;
}

/**
 * Get all subscription customers from the database
 */
async function getSubscriptionCustomers(): Promise<Customer[]> {
  try {
    const customers = await fyo.db.getAll('SubscriptionCustomer', {
      fields: ['name', 'email', 'phone', 'monthlyAmount'],
    });

    return customers.map((c: any) => ({
      name: c.name as string,
      email: c.email as string | undefined,
      phone: c.phone as string | undefined,
      monthlyAmount: parseFloat(c.monthlyAmount || 0),
    }));
  } catch (error) {
    console.error('Error fetching subscription customers:', error);
    return [];
  }
}

/**
 * Parse amount from various formats
 * Handles: "40.00", "40,00", "40", 40, "40.50", "1.234,56"
 */
function parseAmount(value: any): number {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value !== 'string') {
    return 0;
  }

  // Remove currency symbols and spaces
  let cleaned = value.replace(/[€$£\s]/g, '');

  // Handle German format (1.234,56)
  if (cleaned.includes(',') && cleaned.includes('.')) {
    // If both comma and dot exist, assume German format
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (cleaned.includes(',')) {
    // Only comma, replace with dot
    cleaned = cleaned.replace(',', '.');
  }

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
