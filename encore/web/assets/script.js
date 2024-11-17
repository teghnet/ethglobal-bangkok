window.addEventListener("load", () => {
    window.dispatchEvent(new Event("eip6963:requestProvider"));
});

let providers = [];
window.addEventListener("eip6963:announceProvider", (event) => {
    console.log("received provider", event.detail.info);
    providers.push(event.detail);
    // showProviderIcon(event.detail);
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
// const ticketButton = document.querySelector('#button-ticket');
const proveButton = document.querySelector('#TLSNotaryProve');
const vProveButton = document.querySelector('#vLayerProve');
const vVerifyButton = document.querySelector('#vLayerVerify');

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

    window.dispatchEvent(new Event("web3ProviderChanged"));
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

    window.dispatchEvent(new Event("web3AccountChanged"));
}

async function getAccounts() {
    return await provider.request({method: 'eth_requestAccounts'});
}

const chainBox = document.querySelector('#chain-box');
let currentChain;

function chainChanged(chain) {
    if (chain === currentChain) {
        console.log("chain still the same", currentChain);
        return;
    }
    currentChain = chain;
    console.log("chainChanged", currentChain);
    chainBox.textContent = currentChain;

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

const options = {
    headers: {
        'Content-Type': 'application/json'
    },
};

async function providerChanged() {
    if (!currentAccount || !currentChain) {
        console.log("no account or chain available");

        connectButton.hidden = false;
        accountButton.hidden = true;

        return;
    }

    console.log("provider changed");

    connectButton.hidden = true;
    accountButton.hidden = false;

    proveButton.hidden = true;
    vProveButton.hidden = true;
    vVerifyButton.hidden = true;
    // ticketButton.hidden = true;
}

window.addEventListener("web3ProviderChanged", providerChanged);
window.addEventListener("web3AccountChanged", providerChanged);
window.addEventListener("web3ChainChanged", providerChanged);

window.addEventListener("extWebProveDebug", (event) => {
    console.log("received extWebProveDebug", event.detail);
    proveButton.disabled=true
});
let extWebProof;
window.addEventListener("extWebProof", (event) => {
    extWebProof = event.detail;
    console.log("received extWebProof", extWebProof);
    proveButton.hidden = true;
    vProveButton.hidden = false;
    vVerifyButton.hidden = true;
    // ticketButton.hidden = true;
});

window.addEventListener("vLayerProveDebug", (event) => {
    console.log("received vLayerProveDebug", event.detail);
    vProveButton.disabled=true
});
window.addEventListener("vLayerProof", (event) => {
    console.log("received vLayerProof", event.detail);
    proveButton.hidden = true;
    vProveButton.hidden = true;
    vVerifyButton.hidden = false;
    // ticketButton.hidden = true;
});
window.addEventListener("vLayerVerifyDebug", (event) => {
    console.log("received vLayerVerifyDebug", event.detail);
    vVerifyButton.disabled=true
});
window.addEventListener("vLayerVerification", (event) => {
    console.log("received vLayerVerification", event.detail);
    proveButton.hidden = true;
    vProveButton.hidden = true;
    vVerifyButton.hidden = true;
    // ticketButton.hidden = false;

    votingButtons.forEach((button) => {
        button.hidden = false;
        button.addEventListener('click', function () {
            console.log("vote", button.id);
        });
    });
});

const votingButtons = document.querySelectorAll('.voting-button');
votingButtons.forEach((button) => {
    button.addEventListener('click', function () {
        console.log("vote", button.id);
    });
});

let ethClient;
window.addEventListener("ethClient", (event) => {
    // wait in loop until current account is available
    const interval = setInterval(() => {
        if (currentAccount) {
            clearInterval(interval);
            getBalance(currentAccount);
        }
        console.log("waiting for account");
    }, 1000);
});


// Function to get the balance of an address
async function getBalance(address) {
    const interval = setInterval(() => {
        if (currentAccount) {
            clearInterval(interval);
            window.dispatchEvent(new CustomEvent("verifyVotingPower", { detail: address }));
            proveButton.disabled = true;
        }
        console.log("waiting for account");
    }, 1000);
}

window.addEventListener("noVotingPower", () => {
    proveButton.disabled = false;
    proveButton.hidden = false;
});

