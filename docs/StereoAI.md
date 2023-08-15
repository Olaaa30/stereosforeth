# Solidity API

## StereoAI

### _maxSupply

```solidity
uint256 _maxSupply
```

### _supplyAtLaunch

```solidity
uint256 _supplyAtLaunch
```

### _quarterOfMaxSupply

```solidity
uint256 _quarterOfMaxSupply
```

### _currentTotalSupply

```solidity
uint256 _currentTotalSupply
```

### _timeForOneWeek

```solidity
uint256 _timeForOneWeek
```

### _mintTimeAfterOneWeek

```solidity
uint256 _mintTimeAfterOneWeek
```

### _mintTimeAfterFourWeeks

```solidity
uint256 _mintTimeAfterFourWeeks
```

### taxForLiquidity

```solidity
uint256 taxForLiquidity
```

### _isExcludedFromFee

```solidity
mapping(address => bool) _isExcludedFromFee
```

### TokensMinted

```solidity
event TokensMinted(uint256 _amountMinted, uint256 _when)
```

### postLaunch

```solidity
function postLaunch() external
```

### constructor

```solidity
constructor() public
```

_Sets the values for {name} and {symbol}.

The default value of {decimals} is 18. To select a different value for
{decimals} you should overload it.

All two of these values are immutable: they can only be set once during
construction._

### mintAfterOneWeek

```solidity
function mintAfterOneWeek() public
```

_function to mint tokens a week after launch_

### mintAfterFourWeeks

```solidity
function mintAfterFourWeeks() public
```

_function to mint tokens four weeks after launch_

### getCurrentTotalSupply

```solidity
function getCurrentTotalSupply() public view returns (uint256)
```

