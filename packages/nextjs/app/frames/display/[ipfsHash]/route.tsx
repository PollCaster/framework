import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const GET = async (req: NextRequest, route: { params: { ipfsHash: string } }) => {
  const ipfsHash = route.params.ipfsHash;
  const { data } = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);

  return NextResponse.json(data);
};
