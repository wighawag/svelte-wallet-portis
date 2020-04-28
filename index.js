// TODO load portis dynamically from cdn //
/*
<script
  src="https://cdn.jsdelivr.net/npm/@portis/web3@2.0.0-beta.2.0.0-beta.49/umd/index.js"
  integrity="sha256-eVldFSMA1ifYTEJo1QXYPK7v+V+CNCEP4Xsp5/aAVQ8="
  crossorigin="anonymous"
></script>
*/
const Portis = require('@portis/web3');

function PortisModule({dappId, config, forceFallbackUrl}) {
    this.dappId = dappId;
    this.config = config;
    this.forceFallbackUrl = forceFallbackUrl;
    this.id = 'portis';
}

const knownChainIds = {
    '0x01': 'mainnet',
    '0x03': 'ropsten',
    '0x04': 'rinkeby',
    '0x05': 'goerli',
    '0x08': 'ubiq',
    '0x12': 'thundercoreTestnet',
    // TODO chainId '0x': 'orchid',
    // TODO chainId '0x': 'orchidTestnet',
    '0x2a': 'kovan',
    '0x3d': 'classic',
    '0x4d': 'sokol',
    '0x63': 'core',
    '0x64': 'xdai',
    '0x6c': 'thundercore',
    // TODO chainId '0x': 'fuse',
    '0xa3': 'lightstreams',
    // TODO chainId '0x': 'maticAlpha',
    // TODO chainId '0x': 'maticTestnet' // is that testnet3 ?
}

PortisModule.prototype.setup = async function({chainId, fallbackUrl}) {
    let network;
    if (!this.forceFallbackUrl) {
        network = knownChainIds[chainId];
    }

    const portisChainId = parseInt(chainId.slice(2), 16);
    
    if (!network && fallbackUrl) {
        network = {
            nodeUrl: fallbackUrl,
            chainId: portisChainId,
        };
        console.log('PORTIS with ' + network.nodeUrl + ' ' + chainId);
    }
    if (!network) {
        throw new Error('chain ' + portisChainId + ' (' + chainId  + ') not supported by portis');
    }
    this.portis = new Portis(this.dappId, network, this.config);
    window.portis = this.portis;
    this.portis.onError((error) => {
        console.error('PORTIS ERROR:');
        console.error(error);
    });
    this.portis.onActiveWalletChanged((walletAddress) => {
        console.log('PORTIS address: ' + walletAddress);
    });
    this.portis.onLogout(() => {
        console.log('PORTIS logout ');
    });
    this.portis.onLogin((walletAddress, email, reputation) => {
        console.log('PORTIS login: ' + walletAddress + ',' + email);
    });
    return {
        web3Provider: this.portis.provider,
        chainId
    };
}

PortisModule.prototype.logout = async function() {
    return this.portis.logout();
}

PortisModule.prototype.isLoggedIn = async function() {
    return this.portis.isLoggedIn();
}

PortisModule.prototype.onAccountsChanged = function(f) { // TODO ability remove listener ?
    this.portis.onActiveWalletChanged((newAddress) => {
        f([newAddress]);
    });
}

// TODO onError / onLogin / onLogout
// probably not necessary : onActiveWalletChanged

module.exports = PortisModule;
