window.addEventListener("load", () => {
    window.dispatchEvent(new Event("eip6963:requestProvider"));
});

let providers = [];
window.addEventListener("eip6963:announceProvider", (event) => {
    console.log("received provider", event.detail.info);
    providers.push(event.detail);
    showProviderIcon(event.detail);
});

let provider;
window.addEventListener("load", () => {
    if (provider) {
        console.log("provider already set");
        return;
    }
    if (providers.length !== 0) {
        changeProvider(providers[0].provider, `${providers[0].info.name} ${providers[0].info.rdns} ${providers[0].info.uuid}`);
        return;
    }
    if (window.ethereum) {
        changeProvider(window.ethereum, `window.ethereum: ${window.ethereum.constructor.name}`);
        return;
    }
    console.log("no provider available");
});

const connectButton = document.querySelector('#button-connect-wallet');
const accountButton = document.querySelector('#button-account');

function changeProvider(newProvider, name) {
    if (provider === newProvider) {
        console.log("provider unchanged");
        return;
    }
    if (provider) {
        console.log("disconnecting provider")
        provider.off('accountsChanged', accountsChanged);
        provider.off('chainChanged', chainChanged);
    }

    provider = newProvider;
    console.log(`provider changed to ${name}`);

    provider.on('accountsChanged', accountsChanged);
    provider.on('chainChanged', chainChanged);

    getAccounts().then(accountsChanged).catch((msg) => {
        console.log("no accounts available");
        console.log(msg);
        connectButton.hidden = false;
        accountButton.hidden = true;
    })
    getChain().then(chainChanged).catch((msg) => {
        console.log("no chain available");
        console.log(msg);
        connectButton.hidden = false;
        accountButton.hidden = true;
    })
}

const accountBox = document.querySelector('#account-box');
let currentAccount;

function accountsChanged(accounts) {
    if (accounts.length === 0) {
        console.log("no accounts available");
        return;
    }
    if (accounts[0] === currentAccount) {
        console.log("account unchanged", currentAccount);
        return;
    }
    currentAccount = accounts[0];
    console.log("accountChanged", currentAccount);
    accountBox.textContent = currentAccount;

    connectButton.hidden = true;
    accountButton.hidden = false;

    window.dispatchEvent(new Event("web3AccountChanged"));
}

async function getAccounts() {
    return await provider.request({method: 'eth_requestAccounts'});
}

const chainBox = document.querySelector('#chain-box');
let currentChain;

function chainChanged(chain) {
    if (chain === currentChain) {
        console.log("chain unchanged", currentChain);
        return;
    }
    currentChain = chain;
    console.log("chainChanged", currentChain);
    chainBox.textContent = currentChain;

    connectButton.hidden = true;
    accountButton.hidden = false;

    window.dispatchEvent(new Event("web3ChainChanged"));
}

async function getChain() {
    return await provider.request({method: 'eth_chainId'});
}

const providerIconsDiv = document.querySelector('#provider-icons');

function showProviderIcon(provider) {
    let img = document.createElement('img');
    img.height = 32;
    img.src = provider.info.icon;
    img.title = provider.info.name;
    img.alt = provider.info.name;
    img.classList.add('provider-icon');
    img.addEventListener('click', function () {
        changeProvider(provider.provider, `${provider.info.name} ${provider.info.rdns} ${provider.info.uuid}`);
    });
    providerIconsDiv.appendChild(img);
}

function providerChanged() {
    if (!currentAccount || !currentChain) {
        console.log("no account or chain available");
        return;
    }

    // fetch(`/permit/sign-request/${currentAccount}/${currentChain}`, options)
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(data);
    //
    //         titleBox.innerText = data.title;
    //         document.title = data.title;
    //
    //         return data.request;
    //     })
    //     .then(data => {
    //         requestData = data;
    //         requestBox.innerText = JSON.stringify(data, null, 2);
    //         resultBox.innerText = "";
    //     })
    //     .catch(error => console.log("ERROR", error));
}

window.addEventListener("web3ProviderChanged", providerChanged);
window.addEventListener("web3AccountChanged", providerChanged);
window.addEventListener("web3ChainChanged", providerChanged);
