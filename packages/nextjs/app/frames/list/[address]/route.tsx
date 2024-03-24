import { NextRequest, NextResponse } from "next/server";
import PinataClient from "@pinata/sdk";

const pinata = new PinataClient(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

export const GET = async (req: NextRequest, route: { params: { address: string } }) => {
  const owner = route.params.address;
  const userPins = await pinata.pinList({
    metadata: {
      keyvalues: {
        owner: {
          value: owner,
          op: "eq",
        },
        type: {
          value: "framework-frames",
          op: "eq",
        },
      },
    },
  });

  return NextResponse.json({ frames: userPins.rows });
};
