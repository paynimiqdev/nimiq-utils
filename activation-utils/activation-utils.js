export default class ActivationUtils {
    static get API_ROOT() { return 'https://activate.nimiq-network.com' }

    static async fetchBalance(ethAddress) {
        const response = await fetch(`https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xcfb98637bcae43C13323EAa1731cED2B716962fD&tag=latest&address=${ethAddress}`)
        return (await response.json()).result;
    }

    static async nim2ethAddress(address) {
        const hash = await Nimiq.Hash.sha256(address.serialize());
        return '0x' + Nimiq.BufferUtils.toHex(hash.subarray(0, 20));
    }

    static getUnfriendlyAddress(friendlyAddress) {
        return Nimiq.Address.fromUserFriendlyAddress(friendlyAddress);
    }

    async getDashboardData(dashboardToken) {
        const request = fetch(
            `${ActivationUtils.API_ROOT}/list/${dashboardToken}`,
            { method: 'GET' }
        );

        const response = await request.then(response => response.json());
        this.onDashboardDataResult(response);
    }

    async isValidToken(activationToken) {
        const request = fetch(
            `${ActivationUtils.API_ROOT}/activate/${activationToken}`,
            { method: 'GET' }
        );
        try {
            const response = await request;
            this.onIsValidToken(response.ok);
        } catch (e) {
            this.onIsValidToken(false);
        }
    }

    async activateAddress(activationToken, ethAddress, nimiqAddress) {
        const request = fetch(
            `${ActivationUtils.API_ROOT}/activate/address`,
            { 
                method: 'POST',
                body: JSON.stringify({
                    'activation_token': activationToken,
                    'nimiq_address': nimiqAddress
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }
        );

        const response = await request;
        this.onActivateAddress(response.ok);
    }
}