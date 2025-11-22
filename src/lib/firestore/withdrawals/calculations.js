/**
 * Calculate withdrawal breakdown with commission and GST
 * 
 * @param {number} grossAmount - The amount seller requests
 * @param {number} commissionRate - Commission percentage (e.g., 2 for 2%)
 * @returns {object} Breakdown of the withdrawal
 */
export function calculateWithdrawalBreakdown(grossAmount, commissionRate) {
  if (!grossAmount || grossAmount <= 0) {
    throw new Error("Gross amount must be greater than 0");
  }

  if (commissionRate < 0 || commissionRate > 100) {
    throw new Error("Commission rate must be between 0 and 100");
  }

  // Step 1: Calculate commission amount
  const commissionAmount = (grossAmount * commissionRate) / 100;

  // Step 2: Calculate GST on commission (18%)
  const gstOnCommission = (commissionAmount * 18) / 100;

  // Step 3: Total deduction (commission + GST)
  const totalDeduction = commissionAmount + gstOnCommission;

  // Step 4: Net payable to seller
  const netPayable = grossAmount - totalDeduction;

  return {
    grossAmount: parseFloat(grossAmount.toFixed(2)),
    commissionRate: parseFloat(commissionRate.toFixed(2)),
    commissionAmount: parseFloat(commissionAmount.toFixed(2)),
    gstOnCommission: parseFloat(gstOnCommission.toFixed(2)),
    totalDeduction: parseFloat(totalDeduction.toFixed(2)),
    netPayable: parseFloat(netPayable.toFixed(2))
  };
}

/**
 * Validate withdrawal request parameters
 */
export function validateWithdrawalRequest({ 
  sellerId, 
  amount, 
  availableBalance, 
  minWithdrawal = 100 
}) {
  const errors = [];

  if (!sellerId) {
    errors.push("Seller ID is required");
  }

  if (!amount || amount <= 0) {
    errors.push("Amount must be greater than 0");
  }

  if (amount < minWithdrawal) {
    errors.push(`Minimum withdrawal amount is ₹${minWithdrawal}`);
  }

  if (amount > availableBalance) {
    errors.push(`Insufficient balance. Available: ₹${availableBalance}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount, currency = "INR") {
  if (typeof amount !== "number") {
    return "₹0.00";
  }

  const formatted = amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return currency === "INR" ? `₹${formatted}` : formatted;
}

/**
 * Calculate platform earnings from withdrawal
 */
export function calculatePlatformEarnings(breakdown) {
  return {
    commissionEarned: breakdown.commissionAmount,
    gstCollected: breakdown.gstOnCommission,
    totalPlatformEarning: breakdown.totalDeduction
  };
}
