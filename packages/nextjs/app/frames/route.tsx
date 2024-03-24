import { NextRequest, NextResponse } from "next/server";
import PinataClient from "@pinata/sdk";

const pinata = new PinataClient(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

export const POST = async (req: NextRequest) => {
  let frame, owner: string;
  try {
    const data = await req.json();
    frame = data.frame;
    owner = data.owner;
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

  return NextResponse.json({ hash: IpfsHash });
};
