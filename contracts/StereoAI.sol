// SPDX-License-Identifier: MIT
//       ___      ___         ___         ___         ___         ___         ___
//      /\  \    /\  \       /\  \       /\  \       /\  \       /\  \       /\  \        ___
//     /::\  \   \:\  \     /::\  \     /::\  \     /::\  \     /::\  \     /::\  \      /\  \
//    /:/\ \  \   \:\  \   /:/\:\  \   /:/\:\  \   /:/\:\  \   /:/\:\  \   /:/\:\  \     \:\  \
//   _\:\~\ \  \  /::\  \ /::\~\:\  \ /::\~\:\  \ /::\~\:\  \ /:/  \:\  \ /::\~\:\  \    /::\__\
//  /\ \:\ \ \__\/:/\:\__/:/\:\ \:\__/:/\:\ \:\__/:/\:\ \:\__/:/__/ \:\__/:/\:\ \:\__\__/:/\/__/
//  \:\ \:\ \/__/:/  \/__\:\~\:\ \/__\/_|::\/:/  \:\~\:\ \/__\:\  \ /:/  \/__\:\/:/  /\/:/  /
//   \:\ \:\__\/:/  /     \:\ \:\__\    |:|::/  / \:\ \:\__\  \:\  /:/  /     \::/  /\::/__/
//    \:\/:/  /\/__/       \:\ \/__/    |:|\/__/   \:\ \/__/   \:\/:/  /      /:/  /  \:\__\
//     \::/  /              \:\__\      |:|  |      \:\__\      \::/  /      /:/  /    \/__/
//      \/__/                \/__/       \|__|       \/__/       \/__/       \/__/
//
//                                  https://stereoai.app/
//                                  https://t.me/stereoAI
//                              https://twitter.com/StereoAIapp

pragma solidity ^0.8.19;

//imports
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StereoAI is ERC20, Ownable {
    //Tokenomics Start
    // =======================================================>
    string private _name = "Stereo AI";
    string private _symbol = "STAI";
    uint256 private _decimals = 18;
    uint256 _maxSupply = 1000000000; // one billion
    uint256 _supplyAtLaunch = _maxSupply / 2;
    uint256 _quarterOfMaxSupply = _maxSupply / 4;
    uint256 _currentTotalSupply = 0;
    uint256 _timeForOneWeek = 604800;
    // uint256 _tenSeconds = 10;
    uint256 _mintTimeAfterOneWeek = block.timestamp + _timeForOneWeek;
    // uint256 _mintTimeAfterTenSeconds = block.timestamp + _tenSeconds;
    uint256 _mintTimeAfterFourWeeks = block.timestamp + (_timeForOneWeek * 4);
    uint256 public taxForLiquidity = 47; //sniper protection, to be lowered after launch
    mapping(address => bool) public _isExcludedFromFee;

    event TokensMinted(uint256 _amountMinted, uint256 _when);

    function postLaunch() external onlyOwner {
        taxForLiquidity = 1;
    }

    // TOKENOMICS END
    // ====================================================>

    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * The default value of {decimals} is 18. To select a different value for
     * {decimals} you should overload it.
     *
     * All two of these values are immutable: they can only be set once during
     * construction.
     */

    constructor() ERC20(_name, _symbol) {
        _mint(msg.sender, _supplyAtLaunch * 10 ** _decimals);
        _currentTotalSupply = _supplyAtLaunch;
        emit TokensMinted(_supplyAtLaunch, block.timestamp);
    }

    /**
     * @dev function to mint tokens a week after launch
     */
    function mintAfterOneWeek() public onlyOwner {
        require(
            block.timestamp > _mintTimeAfterOneWeek,
            "Minting too early, It hasn't been a week since launch"
        );
        require(
            _currentTotalSupply <= _maxSupply,
            "maxSupply cannot be exceeded"
        );
        _mint(msg.sender, _quarterOfMaxSupply * 10 ** _decimals);
        emit TokensMinted(_quarterOfMaxSupply, block.timestamp);
    }

    /**
     * @dev function to mint tokens four weeks after launch
     */
    function mintAfterFourWeeks() public onlyOwner {
        require(
            block.timestamp > _mintTimeAfterFourWeeks,
            "Minting too early, It hasn't been four weeks since launch"
        );
        require(
            _currentTotalSupply <= _maxSupply,
            "maxSupply cannot be exceeded"
        );
        _mint(msg.sender, _quarterOfMaxSupply *10 ** _decimals);
        emit TokensMinted(_quarterOfMaxSupply, block.timestamp);
    }

    /**
     * @dev mint tokens after tenSeconds
     */
    // function mintAfterTenSeconds() public onlyOwner {
    //     require(block.timestamp > _tenSeconds, "minting too early");
    //     require(
    //         _currentTotalSupply <= _maxSupply,
    //         "maxSupply cannot be exceeded "
    //     );
    //     _mint(msg.sender, _quarterOfMaxSupply * 10 ** _decimals);
    // }

    /**
     * @dev returns current total number of tokens in circulation
     */
    function getCurrentTotalSupply() public view returns (uint256) {
        return _currentTotalSupply;
    }
}
