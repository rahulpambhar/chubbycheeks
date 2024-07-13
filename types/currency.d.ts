type Fiat = {
    id: string,
    name: string,
    symbol: string,
    logo: string,
    bankInfo: { [key: string]: string }
}

type Token = {
    id: string,
    name: string,
    symbol: string,
    decimals: number,
    address: string,
    logo: string,
}

type txHistory = {
    id: number;
    username: string;
    address: string;
    spendCurrency: {
        name: string;
        symbol: string;
        address: string;
        decimals: number;
        logo: string;
    },
    spendAmount: number;
    receiveCurrency: {
        name: string;
        symbol: string;
        address: string;
        decimals: number;
        logo: string;
    };
    receiveAmount: number;
    status: 'PENDING' | 'SUCCESS' | 'CANCEL' | 'FAIL';
    date: string;
}