export const EXCHANGE_RATES: Record<string, number> = {
    'USD': 83.50,
    'EUR': 90.20,
    'GBP': 105.80,
    'AUD': 54.30,
    'CAD': 61.10,
    'JPY': 0.55,
    'INR': 1.00
};

export const getCurrencySymbol = (currency: string): string => {
    switch (currency?.toUpperCase()) {
        case 'USD': return '$';
        case 'EUR': return '€';
        case 'GBP': return '£';
        case 'INR': return '₹';
        default: return currency ? `${currency} ` : '₹';
    }
};

export const convertToINR = (amount: number, currency: string = 'USD'): number => {
    const rate = EXCHANGE_RATES[currency.toUpperCase()];
    if (!rate) {
        console.warn(`[Currency Warning] No exchange rate found for ${currency}, falling back to USD rate.`);
        return amount * EXCHANGE_RATES['USD'];
    }
    return amount * rate;
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${Number(amount).toFixed(2)}`;
};
