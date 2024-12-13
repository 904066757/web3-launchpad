// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 导入 OpenZeppelin 的 ERC20 标准实现
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MetaCoin
 * @dev 一个简单的 ERC20 代币合约
 */
contract MetaCoin is ERC20 {
    // 代币名称
    string public constant NAME = "YidengERC20Token";
    // 代币符号
    string public constant SYMBOL = "YD";
    // 初始发行量
    uint256 public constant INITIAL_SUPPLY = 10000;
    
    /**
     * @dev 构造函数，初始化代币并铸造初始供应量
     */
    constructor() ERC20(NAME, SYMBOL) {
        // 向合约部署者发放所有初始代币
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /**
     * @dev 设置代币精度为0，代币不可分割
     */
    function decimals() public view virtual override returns(uint8) {
        return 0;
    }

    /**
     * @dev 允许任何人销毁自己的代币
     * @param amount 要销毁的代币数量
     */
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}