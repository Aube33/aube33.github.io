---
layout: default
title: RootMe - Ethereum - Tutoreum
permalink: /programming/ethereum-tutoreum
---

# Ethereum - Tutoreum

## Statement
An introduction to Ethereum smart contracts before getting to the heart of the matter.

Source code
```solidity
pragma solidity ^0.5.0;
    
contract Tutoreum {
    
    string public key;
    bool public locked = true;
    
    constructor(string memory _key) public {
        key = _key;
    }
    
    function own(string memory _key) public {
        if(keccak256(bytes(key)) == keccak256(bytes(_key))) {
            locked = false;
        }
    }
    
}
```

## Analyze
Solidity is an OOP language. It's the primary language used in smart contracts on the Ethereum blockchain.

Let's analyze the code:
```solidity
pragma solidity ^0.5.0;
    
contract Tutoreum { // Here we have the name of our contract
    
    // Our attributes
    string public key;
    bool public locked = true;
    
    // Our constructor
    constructor(string memory _key) public {
        key = _key;
    }
    
    // Our methods
    function own(string memory _key) public {
        if(keccak256(bytes(key)) == keccak256(bytes(_key))) {
            locked = false;
        }
    }
    
}
```
The objective is to change `locked` from `true` to **false**. We can see that the function `own` is used for changing this `locked` attribute.

But `own` only works if the correct `key` is passed as an argument...


## Exploitation
⚠️ For this exercise, you need Metamask with `eth_sign` available and enabled. On Firefox I installed **v12.0.6** ([Firefox Metamask History](https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/versions/))

So, we need to retrieve this `key` attribute. Fortunately `key` is public ! We can get its value from developer console.

Open Dev Console of your browser and type:
```js
>> await level

Object { constructor: TruffleContract(), abi: (4) […], contract: {…}, key: contract(), locked: contract(), own: contract(), sendTransaction: contract(), send: send(value)
, allEvents: BoundFunctionObject, address: "0x****************************************", … }
​
abi: Array(4) [ {…}, {…}, {…}, … ]
​
address: "0x****************************************"
​
allEvents: BoundFunctionObject { … }
​
constructor: function TruffleContract()​
contract: Object { _eth: {…}, transactionHash: null, address: "0x****************************************", … }
​
key: function contract()​
locked: function contract()​
own: function contract()​
send: function send(value)​
sendTransaction: function contract()
​
transactionHash: null
​
<prototype>: Object {  }
```
Everything in public is reachable, so `key` is reachable here:
```js
key: function contract()​
```

All we have left to do is to call `own` with `level.key()` as an argument:
```js
>> await level.own(await level.key())
(Transaction x confirmed !)
```

And once "Check" button clicked we get:

`Well done! Flag for this level is: ***********`

## How does it work ?
We can see that `level.key` is typed as function, this is because our Smart Contract is **stored** and **executed** on Ethereum Virtual Machine ([EVM](https://ethereum.org/en/developers/docs/evm/)). These Virtual Machines are executed on Node through Etheureum blockchain, call our attribute `key` cost "gas fee" for preventing abuse, measuring the computational effort and fair transaction processing.