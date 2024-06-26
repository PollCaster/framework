# 🌊 PollCaster

<p align="center">
  <img src="packages/nextjs/public/OIG1.FHfNT-logo-filled.png" width="350">
</p>

<div align="center">
  <a href="https://docs.scaffoldeth.io">Deck</a> |
  <a href="https://pollcaster-frame.vercel.app">Dashboard Live Demo</a> |
  <a href="https://scaffoldeth.io">Frame Example</a> |
  <a href="https://scaffoldeth.io">Demo Video</a> 
</div>

## Overview

Platform for no-code creation and management of Farcaster Frames, including but not limited to:

- Polls
- Quizzes
- 'Story'-like frames including few pages with interactive images and text
- 'Time-gated' content - frames are only available for a day, after a deadline passes it's no longer possible to view / interact with Frame's content
- Base chain interaction - configuration for user Frame polls is stored in the smart contracts deployed to Base Sepolia network in order to provide more transparency
Developed using `NEXT`, `frames.js`, `Pinata` and compatible with `Open Frames` standard.

### Developed using NEXT, frames.js, Pinata and compatible with Open Frames standard.

- User wanting to create a Frame Poll visits the web app url. The web app prompts user to input details for the poll and returns IPFS hash from the backend API which is calling Pinata API. 

- Dynamic frame generation happens using frame.js NEXT.js routing.

- The details of the Frame Polls for each user and poll votes from users are stored in the smart contracts written in Solidity.

- The smart contracts for configuration of user frames and metadata for frames have been deployed to the Base Sepolia chain.

# Base Sepolia Contract Address
[0x4828256e2aD7796528A5Ee0A6378ADa8B159D794](https://sepolia.basescan.org/address/0x4828256e2aD7796528A5Ee0A6378ADa8B159D794)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/scaffold-eth/scaffold-eth-2.git
cd scaffold-eth-2
yarn install
```

2. Start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

3. Once the form has been filled out and the Frame link has been generated paste it to ![Farcaster Debug](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1). In order for that to work your `NEXT_PUBLIC_APP_API_URL` has to be set to something else than a localhost, for exmaple publicly available vercel deployment url.
