
export function convertUnits(value: number, from: string, to: string): string {
    const fromUnit = from.toLowerCase().trim();
    const toUnit = to.toLowerCase().trim();

    // Mapping to base units
    // Length: base = meters (m)
    // Weight: base = kilograms (kg)

    const lengthFactors: { [key: string]: number } = {
        'm': 1,
        'km': 1000,
        'cm': 0.01,
        'mm': 0.001,
        'mi': 1609.34,
        'ft': 0.3048,
        'in': 0.0254
    };

    const weightFactors: { [key: string]: number } = {
        'kg': 1,
        'g': 0.001,
        'lbs': 0.453592,
        'lb': 0.453592,
        'oz': 0.0283495
    };

    // Check if it is a length conversion
    if (lengthFactors[fromUnit] && lengthFactors[toUnit]) {
        const valueInMeters = value * lengthFactors[fromUnit];
        const convertedValue = valueInMeters / lengthFactors[toUnit];
        return `${parseFloat(convertedValue.toFixed(4))} ${toUnit}`;
    }

    // Check if it is a weight conversion
    if (weightFactors[fromUnit] && weightFactors[toUnit]) {
        const valueInKg = value * weightFactors[fromUnit];
        const convertedValue = valueInKg / weightFactors[toUnit];
        return `${parseFloat(convertedValue.toFixed(4))} ${toUnit}`;
    }

    throw new Error(`Unsupported conversion: ${fromUnit} to ${toUnit}`);
}
