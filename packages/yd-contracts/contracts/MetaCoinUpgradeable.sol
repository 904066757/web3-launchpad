// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract MetaCoinUpgradeable is ERC20Upgradeable, OwnableUpgradeable {
    function initialize() public initializer {
        __ERC20_init("YidengERC20Token", "YD");
        // 将调用者设置为所有者
        __Ownable_init(msg.sender);
        _mint(msg.sender, 10000);
    }

    function decimals() public view virtual override returns(uint8) {
        return 0;
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}