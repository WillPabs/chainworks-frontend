import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { getUserData } from '@stacks/connect';
import { getStacksAccount } from '../../lib/account';
import { useConnect, userSessionStateAtom } from '../../lib/auth';
import {
  loginStatusAtom,
  stxAddressAtom,
  appStxAddressAtom,
  stxBnsNameAtom,
  userBalancesAtom,
} from '../../store/stacks';

export default function HeaderAuth() {
    const { handleOpenAuth } = useConnect();
    const [userSessionState] = useAtom(userSessionStateAtom);
    const [loginStatus] = useAtom(loginStatusAtom);
    const [stxAddress, setStxAddress] = useAtom(stxAddressAtom);
    const setAppStxAddress = useUpdateAtom(appStxAddressAtom);
    const setBnsName = useUpdateAtom(stxBnsNameAtom);
    const setUserBalances = useUpdateAtom(userBalancesAtom);
  
    useEffect(() => {
      const fetchUserData = async () => {
        if (loginStatus) {
          const userData = await getUserData(userSessionState);
          const stxAddress = userData.profile.stxAddress?.testnet;
          setStxAddress({ loaded: true, data: stxAddress });
          const { appStxAddress } = getStacksAccount(userData.appPrivateKey);
          setAppStxAddress({ loaded: true, data: appStxAddress });
        } else {
          setStxAddress({ loaded: false, data: '' });
          setAppStxAddress({ loaded: false, data: '' });
        }
      };
      fetchUserData();
    }, [loginStatus, setAppStxAddress, setStxAddress, userSessionState]);

    return {
        handleOpenAuth
    }
}