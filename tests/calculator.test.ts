/**
 * Tests for the calculator module
 */
import { add, subtract, evaluateExpression } from '../lib/calculator';

describe('Calculator Basic Operations', () => {
  // Test addition function
  describe('add function', () => {
    test('adds two positive numbers correctly', () => {
      expect(add(2, 3)).toBe(5);
    });

    test('adds a positive and a negative number correctly', () => {
      expect(add(5, -3)).toBe(2);
    });

    test('adds two negative numbers correctly', () => {
      expect(add(-2, -3)).toBe(-5);
    });

    test('adds zero correctly', () => {
      expect(add(5, 0)).toBe(5);
      expect(add(0, 5)).toBe(5);
      expect(add(0, 0)).toBe(0);
    });

    test('adds decimal numbers correctly', () => {
      expect(add(1.5, 2.5)).toBe(4);
      expect(add(0.1, 0.2)).toBeCloseTo(0.3); // Using toBeCloseTo for floating point precision issues
    });
  });

  // Test subtraction function
  describe('subtract function', () => {
    test('subtracts two positive numbers correctly', () => {
      expect(subtract(5, 3)).toBe(2);
    });

    test('subtracts a negative number from a positive number correctly', () => {
      expect(subtract(5, -3)).toBe(8);
    });

    test('subtracts a positive number from a negative number correctly', () => {
      expect(subtract(-5, 3)).toBe(-8);
    });

    test('subtracts two negative numbers correctly', () => {
      expect(subtract(-5, -3)).toBe(-2);
    });

    test('subtracts zero correctly', () => {
      expect(subtract(5, 0)).toBe(5);
      expect(subtract(0, 5)).toBe(-5);
      expect(subtract(0, 0)).toBe(0);
    });

    test('subtracts decimal numbers correctly', () => {
      expect(subtract(4, 1.5)).toBe(2.5);
      expect(subtract(0.3, 0.1)).toBeCloseTo(0.2);
    });
  });
});

describe('Expression Evaluation', () => {
  // Test expression evaluation
  describe('evaluateExpression function', () => {
    // Addition expressions
    test('evaluates simple addition expressions correctly', () => {
      expect(evaluateExpression('2+3')).toBe(5);
      expect(evaluateExpression('10+20')).toBe(30);
    });

    test('evaluates addition expressions with spaces correctly', () => {
      expect(evaluateExpression('2 + 3')).toBe(5);
      expect(evaluateExpression(' 10 + 20 ')).toBe(30);
    });

    test('evaluates addition expressions with negative numbers correctly', () => {
      expect(evaluateExpression('-2+3')).toBe(1);
      expect(evaluateExpression('2+-3')).toBe(-1);
      expect(evaluateExpression('-2+-3')).toBe(-5);
    });

    test('evaluates addition expressions with decimal numbers correctly', () => {
      expect(evaluateExpression('1.5+2.5')).toBe(4);
      expect(evaluateExpression('0.1+0.2')).toBeCloseTo(0.3);
    });

    // Subtraction expressions
    test('evaluates simple subtraction expressions correctly', () => {
      expect(evaluateExpression('5-3')).toBe(2);
      expect(evaluateExpression('20-10')).toBe(10);
    });

    test('evaluates subtraction expressions with spaces correctly', () => {
      expect(evaluateExpression('5 - 3')).toBe(2);
      expect(evaluateExpression(' 20 - 10 ')).toBe(10);
    });

    test('evaluates subtraction expressions with negative numbers correctly', () => {
      expect(evaluateExpression('-5-3')).toBe(-8);
      expect(evaluateExpression('5--3')).toBe(8); // 5-(-3) = 5+3 = 8
    });

    test('evaluates subtraction expressions with decimal numbers correctly', () => {
      expect(evaluateExpression('4-1.5')).toBe(2.5);
      expect(evaluateExpression('0.3-0.1')).toBeCloseTo(0.2);
    });

    // Error cases
    test('throws error for empty expressions', () => {
      expect(() => evaluateExpression('')).toThrow('Empty expression');
      expect(() => evaluateExpression(' ')).toThrow('Empty expression');
    });

    test('throws error for invalid addition expressions', () => {
      expect(() => evaluateExpression('+')).toThrow('Invalid addition expression format');
      expect(() => evaluateExpression('2+')).toThrow('Invalid addition expression format');
      expect(() => evaluateExpression('+3')).toThrow('Invalid addition expression format');
      expect(() => evaluateExpression('2+3+4')).toThrow('Invalid addition expression format');
    });

    test('throws error for invalid subtraction expressions', () => {
      expect(() => evaluateExpression('-')).toThrow('Invalid subtraction expression format');
      expect(() => evaluateExpression('2-3-4')).toThrow(); // Just check that it throws any error
    });

    test('throws error for non-numeric expressions', () => {
      expect(() => evaluateExpression('abc')).toThrow('Invalid expression format');
      expect(() => evaluateExpression('2+abc')).toThrow('Invalid numbers in addition expression');
      expect(() => evaluateExpression('abc-2')).toThrow('Invalid numbers in subtraction expression');
    });
  });
});
