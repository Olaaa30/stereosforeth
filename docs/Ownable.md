# Solidity API

## Ownable

### OwnershipTransferred

```solidity
event OwnershipTransferred(address previousOwner, address newOwner)
```

### constructor

```solidity
constructor() internal
```

_initializes the contract setting the deployer as the initial owner._

### owner

```solidity
function owner() public view virtual returns (address)
```

_returns the address of the current owner._

### onlyOwner

```solidity
modifier onlyOwner()
```

_throws if called by any account other than the owner._

### renounceOwnership

```solidity
function renounceOwnership() public virtual
```

_Leaves the contract without owner. It will not be possible to call
`onlyOwner` functions anymore. Can only be called by the current owner.

NOTE: Renouncing ownership will leave the contract without an owner,
thereby removing any functionality that is only available to the owner._

### transferOwnership

```solidity
function transferOwnership(address newOwner) public virtual
```

_Transfers ownership of the contract to a new account (`newOwner`).
Can only be called by the current owner._

### _transferOwnership

```solidity
function _transferOwnership(address newOwner) internal virtual
```

_Transfers ownership of the contract to a new account (`newOwner`).
Internal function without access restriction._

