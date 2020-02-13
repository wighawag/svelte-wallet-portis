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

PortisModule.prototype.setup = async function({chainId, fallbackUrl}) {
    let network;
    if (!this.forceFallbackUrl) {
        if(chainId == 1) {
            network = 'mainnet';
        } // TODO
    }
    
    if (!network && fallbackUrl) {
        network = {
            nodeUrl: fallbackUrl,
            chainId,
        };
        console.log('PORTIS with ' + network.nodeUrl + ' ' + chainId);
    }
    if (!network) {
        throw new Error('chain ' + chainId + ' not supported by portis');
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
