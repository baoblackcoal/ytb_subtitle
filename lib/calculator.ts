/**
 * Calculator module for performing basic arithmetic operations
 * Supports addition and subtraction operations
 */

/**
 * Performs addition of two numbers
 * @param a First number
 * @param b Second number
 * @returns Sum of the two numbers
 */
function add(a: number, b: number): number {
  return a + b;
}

/**
 * Performs subtraction of two numbers
 * @param a First number
 * @param b Second number
 * @returns Difference between the two numbers
 */
function subtract(a: number, b: number): number {
  return a - b;
}

/**
 * Parse and evaluate a simple arithmetic expression
 * @param expression The arithmetic expression as a string (e.g., "3+5" or "10-4")
 * @returns The result of the evaluation or throws an error for invalid expressions
 */
function evaluateExpression(expression: string): number {
  // Remove all whitespace from the expression
  const cleanExpression = expression.replace(/\s+/g, '');
  
  // Check if the expression is empty
  if (!cleanExpression) {
    throw new Error('Empty expression');
  }

  // Special case for double minus: convert "--" to "+"
  const normalizedExpression = cleanExpression.replace(/--/g, '+');
  
  // Count the number of operators to ensure we only have one operation
  const plusCount = (normalizedExpression.match(/\+/g) || []).length;
  const minusCount = (normalizedExpression.match(/\-/g) || []).length;
  
  // If we have more than one plus sign, it's an invalid expression
  if (plusCount > 1) {
    throw new Error('Invalid addition expression format');
  }
  
  // For minus signs, we need to be more careful as they can also indicate negative numbers
  // If we have more than 1 minus sign (after normalizing double minus), it's likely an invalid expression like "2-3-4"
  // Unless the first minus is for a negative number, in which case we can have at most 1
  if (minusCount > 1 && normalizedExpression[0] !== '-') {
    throw new Error('Invalid numbers in subtraction expression');
  }

  // Check for addition operation
  if (normalizedExpression.includes('+')) {
    const parts = normalizedExpression.split('+');
    
    // Validate the expression format
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      throw new Error('Invalid addition expression format');
    }
    
    // Parse the numbers
    const a = parseFloat(parts[0]);
    const b = parseFloat(parts[1]);
    
    // Validate the parsed numbers
    if (isNaN(a) || isNaN(b)) {
      throw new Error('Invalid numbers in addition expression');
    }
    
    return add(a, b);
  }
  
  // Check for subtraction operation
  if (normalizedExpression.includes('-')) {
    // Handle negative numbers and subtraction more carefully
    
    // First, check if it's just a single negative number
    if (normalizedExpression.startsWith('-') && normalizedExpression.lastIndexOf('-') === 0) {
      const num = parseFloat(normalizedExpression);
      if (!isNaN(num)) {
        return num;
      }
    }
    
    // Handle expressions like "a-b" or "-a-b"
    // Strategy: find the first minus sign that is not at the beginning
    // This will be our subtraction operator
    
    let operatorIndex = -1;
    
    // If the expression starts with a minus, we need to skip it
    const startIndex = normalizedExpression.startsWith('-') ? 1 : 0;
    
    // Find the first minus that is our subtraction operator
    operatorIndex = normalizedExpression.indexOf('-', startIndex);
    
    // If no subtraction operator found after the first character
    if (operatorIndex === -1) {
      // It might be just a single number
      const num = parseFloat(normalizedExpression);
      if (!isNaN(num)) {
        return num;
      }
      throw new Error('Invalid subtraction expression format');
    }
    
    // Parse the left and right parts
    const leftPart = normalizedExpression.substring(0, operatorIndex);
    const rightPart = normalizedExpression.substring(operatorIndex + 1);
    
    const a = parseFloat(leftPart);
    const b = parseFloat(rightPart);
    
    if (isNaN(a) || isNaN(b)) {
      throw new Error('Invalid numbers in subtraction expression');
    }
    
    return subtract(a, b);
  }
  
  // If no operation was found, check if it's a valid number
  const num = parseFloat(normalizedExpression);
  if (!isNaN(num)) {
    return num;
  }
  
  // If we get here, the expression is invalid
  throw new Error('Invalid expression format');
}

// Export functions using CommonJS
module.exports = {
  add,
  subtract,
  evaluateExpression
};
