# 可升级智能合约开发指南

本项目使用 OpenZeppelin 的可升级合约模式，实现了智能合约的无缝升级功能。

## 项目设置

1. 安装依赖
```bash
npm install
```

2. 配置环境变量
创建 `.env` 文件并添加以下配置：
```
PRIVATE_KEY=你的私钥
```

## 合约开发

### 合约编写规范

1. 所有可升级合约需要继承自相应的 Upgradeable 合约
```solidity
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract MyContract is ERC20Upgradeable, OwnableUpgradeable {
    // ...
}
```

2. 构造函数改为 initialize 函数
```solidity
function initialize() public initializer {
    __ERC20_init("MyToken", "MTK");
    __Ownable_init(msg.sender);
}
```

### 合约编译
```bash
npm run compile
```

## 部署和升级

### 部署合约

使用以下命令部署合约：

```bash
# 本地网络部署
CONTRACT=合约名称 npm run deploy:local

# Sepolia测试网部署
CONTRACT=合约名称 npm run deploy:sepolia
```

注意：CONTRACT 参数应该是合约声明的名称，而不是文件名。

例如：
```bash
CONTRACT=MetaCoinUpgradeable npm run deploy:local
```

### 升级合约

1. 修改合约代码（添加新功能或修复bug）

2. 执行升级命令：
```bash
# 本地网络升级
CONTRACT=合约名称 npm run upgrade:local

# Sepolia测试网升级
CONTRACT=合约名称 npm run upgrade:sepolia
```

### 部署信息

- 所有部署信息会自动保存在 `deployments` 目录下
- 本地网络部署信息：`deployments/localhost.json`
- 测试网部署信息：`deployments/sepolia.json`

## 开发建议

1. 先在本地网络（如 Ganache）上完成测试
2. 使用 `hardhat console` 进行交互式调试
3. 升级前确保新版本合约与旧版本兼容
4. 保存好所有部署地址信息

## 注意事项

1. 可升级合约不能有构造函数，必须使用 initialize 函数
2. 升级不会改变合约的地址，用户仍使用原来的地址
3. 状态变量的顺序不能改变
4. 新增的状态变量只能添加在现有变量之后
5. 不能删除已有的状态变量

## 常见问题

**Q: 为什么要使用可升级合约？**  
A: 可以在不改变合约地址的情况下修复bug或添加新功能。

**Q: 如何验证升级是否成功？**  
A: 检查新功能是否可用，同时确保原有数据和功能完整保留。

**Q: 部署后的代理地址在哪里查看？**  
A: 在 `deployments` 目录下对应网络的 JSON 文件中可以找到所有地址信息。

## 项目结构
```
├── contracts/          # 智能合约源码
├── scripts/           # 部署和升级脚本
├── deployments/       # 部署信息记录
├── test/             # 测试文件
└── hardhat.config.js  # Hardhat 配置文件
```