// TODO load portis dynamically from cdn //
/*
<script
  src="https://cdn.jsdelivr.net/npm/@portis/web3@2.0.0-beta.2.0.0-beta.49/umd/index.js"
  integrity="sha256-eVldFSMA1ifYTEJo1QXYPK7v+V+CNCEP4Xsp5/aAVQ8="
  crossorigin="anonymous"
></script>
*/
const Portis = require('@portis/web3');

function PortisModule(dappId, config) {
    this.dappId = dappId;
    this.config = config;
}

PortisModule.prototype.use = function({chainId, fallbackUrl}) {
    let network = 'mainnet';
    if(chainId == 1) {
        network = 'mainnet';
    }
    if (!network && fallbackUrl) {
        network = {
            nodeUrl: fallbackUrl,
            chainId,
        };
    }
    if (!network) {
        throw new Error('chain ' + chainId + ' not supported by portis');
    }
    this.portis = new Portis(this.dappId, network, this.config);
    return this.portis.provider;
}

PortisModule.prototype.logout = async function() {
    return this.portis.logout();
}

PortisModule.prototype.isLoggedIn = async function() {
    return this.portis.isLoggedIn();
}

// TODO onError / onLogin / onLogout
// probably not necessary : onActiveWalletChanged

module.exports = PortisModule;
