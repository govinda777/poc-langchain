import { celsiusToFahrenheit, fahrenheitToCelsius } from '../temperature';

describe('Temperature Converter', () => {
  test('converts Celsius to Fahrenheit correctly', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
    expect(celsiusToFahrenheit(100)).toBe(212);
    expect(celsiusToFahrenheit(-40)).toBe(-40);
  });

  test('converts Fahrenheit to Celsius correctly', () => {
    expect(fahrenheitToCelsius(32)).toBe(0);
    expect(fahrenheitToCelsius(212)).toBe(100);
    expect(fahrenheitToCelsius(-40)).toBe(-40);
  });

  test('handles decimals', () => {
      expect(celsiusToFahrenheit(37)).toBeCloseTo(98.6);
  });
});
