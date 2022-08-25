import React from "react";
import { Layout, Row, Col, Button } from "antd";
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	LoginOutlined,
	LogoutOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import HeaderAuth from '../sections/HeaderAuth'

import { connectWallet, disconnectWallet } from "../../actions";
import { isMobile } from "react-device-detect";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";


const { Header } = Layout;

const HeaderSection = (props) => {
	const toggle = () => {
		if(!isMobile){
			props.setCollapsed(!props.collapsed);
		}
	};

	const appDetail = {
		name: "Chainworks",
		icon: '',
	}

	const selector = useSelector((state) => state.walletConfig);
	// console.log(selector)
	const dispatch = useDispatch();

	const [userData, setUserData] = useState(undefined);
    const address = userData?.profile?.stxAddress?.testnet;

    const appConfig = new AppConfig(['store_write']);
    const userSession = new UserSession({ appConfig });

    useEffect(() => {
        if (userSession.isSignInPending()) {
            userSession.handlePendingSignIn().then((userData) => {
                setUserData(userData);
            });
        } else if (userSession.isUserSignedIn()) {
            // setLoggedIn(true);
            setUserData(userSession.loadUserData());
        }
    }, []);
	
    console.log({ userData, address });

    const handleLogin = async () => {
        showConnect({
            appDetail,
            onFinish: () => window.location.reload(),
            userSession,
        });
    }

    const logUserOut = async () => {
        userSession.signUserOut();
        window.location.reload();
    }


	const handleOnClick = (e) => {
		e.preventDefault();
		showConnect({
			appDetail,
			redirectTo: "/",
			onFinish: () => {
			  let userData = userSession.loadUserData();
			  // Save or otherwise utilize userData post-authentication
			},
			userSession: userSession,
		  });
		// if (selector.wallet.connected) {
		// 	dispatch(disconnectWallet());
		// } else {
		// 	dispatch(connectWallet());
		// }
	};

	return (
		<Header
			className="site-layout-background-header"
			style={{ padding: 0, position: "fixed", zIndex: 1, width: "100%" }}
		>
			<Row justify="space-between">
				<Row>
					<Col>
						<span className="trigger" onClick={toggle}>
							{props.collapsed ? (
								<MenuFoldOutlined />
							) : (
								<MenuUnfoldOutlined />
							)}
						</span>
					</Col>
					<Col>
						<div className="logo">CHAINWORKS</div>
					</Col>
				</Row>
				<Col style={{ marginRight: "15px" }}>
					<HeaderAuth></HeaderAuth>
					<Button
						type="primary"
						icon={
							selector.wallet.connected ? (
								<LogoutOutlined />
							) : (
								<LoginOutlined />
							)
						}
						onClick={handleLogin}
						shape="round"
					>
						{selector.wallet.connected
							? "Disconnect Wallet"
							: "Connect Wallet"}
					</Button>
				</Col>
			</Row>
		</Header>
	);
};

export default HeaderSection;
