import { NextRequest, NextResponse } from "next/server";
import PinataClient from "@pinata/sdk";
import { createWalletClient, getContract, http } from "viem";
import { baseSepolia } from "viem/chains";
import deployedContracts from "~~/contracts/deployedContracts";

const pinata = new PinataClient(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

const wallet = createWalletClient({
  key: process.env.SIGNER_PRIVATE_KEY,
  chain: baseSepolia,
  transport: http(),
});
const contract = getContract({
  abi: deployedContracts[84532].PollResults.abi,
  address: deployedContracts[84532].PollResults.address,
  walletClient: wallet,
  publicClient: wallet,
});

export const POST = async (req: NextRequest) => {
  let frame, owner: string;
  try {
    const data = await req.json();
    frame = data.frame;
    owner = data.owner;
    if (!frame || !owner || !frame.correctOptions || !frame.correctOptions.length) {
      throw new Error("Invalid JSON");
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const options = {
    pinataMetadata: {
      name: frame.name,
      keyvalues: {
        type: "framework-frames",
        owner,
      } as any,
    },
  };
  const { IpfsHash } = await pinata.pinJSONToIPFS(frame, options);

  const address = (await wallet.getAddresses())[0];

  // create the poll on the blockchain
  await contract.write.createPoll([IpfsHash, frame.correctOptions], { account: address });

  return NextResponse.json({ hash: IpfsHash });
};
