import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-ethers'
import '@typechain/hardhat'
import 'hardhat-watcher'
import 'solidity-coverage'
import 'dotenv/config'

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  watcher: {
    test: {
      tasks: [{ command: 'test', params: { testFiles: ['{path}'] } }],
      files: ['./test/**/*'],
      verbose: true,
      clearOnStart: true,
    },
  },
  defaultNetwork: 'goerli',
  networks: {
    hardhat: {},
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.API_KEY}`,
      accounts: [process.env.PRIVATE_KEY ?? ''],
    },
  },
  typechain: {
    outDir: 'types',
    target: 'ethers-v5',
  },
}

export default config
