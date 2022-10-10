import { ethers } from "ethers"
import * as fs from "fs-extra"
import "dotenv/config"

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
  const abi = fs.readFileSync("./SimpleStorage.abi", "utf-8")
  const binary = fs.readFileSync("./SimpleStorage.bin", "utf-8")
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet)

  console.log("Deploying, Please wait...")
  const contract = await contractFactory.deploy()
  await contract.deployTransaction.wait(1)
  console.log(`Contract Address: ${contract.address}`)

  const currentFavoriteNumber = await contract.retrieve()
  console.log(`\nCurrent Favorite Number: ${currentFavoriteNumber.toString()}`)
  const transactionResponse = await contract.store("2333")
  const transactionReceipt = await transactionResponse.wait(1)
  const updatedFavoriteNumber = await contract.retrieve()
  console.log(`\Updated Favorite Number: ${updatedFavoriteNumber.toString()}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
