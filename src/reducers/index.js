import { combineReducers } from "redux";
import Wallet from "@project-serum/sol-wallet-adapter";
import { Connection } from "@solana/web3.js";
// import { useEffect, useState } from "react";
// import HeaderAuth from '../components/sections/HeaderAuth'
// import { AppConfig, showConnect, UserSession, AuthOptions } from '@stacks/connect';

const cluster = "https://stacks-node-api.testnet.stacks.co/";
// const appDetails: AuthOptions["appDetails"] = {
//   name: "Chainworks",
//   icon: "https://freesvg.org/img/youk-k-Beanstalk.png",
// }

// function Auth() {
//   const [userData, setUserData] = useState<UserData | undefined>(undefined);
//   const address = userData?.profile?.stxAddress?.testnet;

//   const appConfig = new AppConfig(['store_write']);
//   const userSession = new UserSession({ appConfig });

//   const handleLogin = async () => {
//     showConnect({
//       appDetails,
//       onFinish: () => window.location.reload(),
//       userSession,
//     });
//   }
// }

const walletConfig = {
  wallet: new Wallet("https://wallet.hiro.so/", cluster),
  connection: new Connection(cluster, "confirmed"),
};

const connectWalletReducer = (state = walletConfig, action) => {
  switch (action.type) {
    case "WALLET_CONNECT":
      return { ...state, wallet: action.payload.wallet };
    case "WALLET_DISCONNECT":
      return { ...state, wallet: action.payload.wallet };
    default:
      return state;
  }
};

const createStreamReducer = (state = { result: false, id: null }, action) => {
  switch (action.type) {
    case "CREATE_RESPONSE":
      return {
        result: true,
        id: action.id,
      };
    case "CREATE_FAILED":
      return { ...state, result: false, id: null };
    case "CLEAR_RESPONSE":
      return {
        result: false,
        id: null,
      };
    default:
      return state;
  }
};
const getStreamReducer = (state = { sending: [], receiving: [] }, action) => {
  switch (action.type) {
    case "DATA_RECEIVED":
      // console.log(action);
      return {...state, 
        sending: action.result.sending,
        receiving: action.result.receiving,
      };
    case "DATA_NOT_RECEIVED":
      return { sending: [], receiving: [] };
    default:
      return state;
  }
};

const withDrawStatus = (state=false , action) => {
    switch (action.type) {
		case "WITHDRAW_SUCCESS":
		  return true;
		case "WITHDRAW_FAILED":
		  return false;
		default:
		  return state;
	  }
}

const cancelStatus = (state=false , action) => {
    switch (action.type) {
		case "CANCEL_SUCCESS":
		  return true;
		case "CANCEL_FAILED":
		  return false;
		default:
		  return state;
	  }
}


export default combineReducers({
  walletConfig: connectWalletReducer,
  createStream: createStreamReducer,
  streamData: getStreamReducer,
  withdrawStatus: withDrawStatus,
  cancelStatus: cancelStatus
});
