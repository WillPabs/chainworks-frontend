import React from "react";
import { Layout, Row, Col, Button } from "antd";
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	LoginOutlined,
	LogoutOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";

import { isMobile } from "react-device-detect";
import { getStacksAccount } from '../../lib/account';
import { getUserData } from "@stacks/connect";
import { useConnect, userSessionStateAtom } from '../../lib/auth';
import { isMainnet } from '../../lib/stacks';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { 
	loginStatusAtom,
	stxAddressAtom,
	appStxAddressAtom,
} from "../../store/stacks";


const { Header } = Layout;

const HeaderSection = (props) => {
	const toggle = () => {
		if(!isMobile){
			props.setCollapsed(!props.collapsed);
		}
	};

	const { handleOpenAuth } = useConnect();
	const { handleSignOut } = useConnect();
	const [userSessionState] = useAtom(userSessionStateAtom);
	const [stxAddress, setStxAddress] = useAtom(stxAddressAtom);
	const setAppStxAddress = useUpdateAtom(appStxAddressAtom);
	const [loginStatus] = useAtom(loginStatusAtom);

    useEffect(() => {
		const fetchUserData = async () => {
			if (loginStatus) {
				const userData = await getUserData(userSessionState);
				const stxAddress = userData.profile.stxAddress[isMainnet ? 'mainnet' : 'testnet'];
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

	const handleOnClick = (e) => {
		e.preventDefault();
		if (loginStatus) {
			handleSignOut();
		} else {
			handleOpenAuth();
		}
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
					<Button
						type="primary"
						icon={
							loginStatus ? (
								<LogoutOutlined />
							) : (
								<LoginOutlined />
							)
						}
						onClick={handleOnClick}
						shape="round"
					>
						{loginStatus
							? "Disconnect Wallet"
							: "Connect Wallet"}
					</Button>
				</Col>
			</Row>
		</Header>
	);
};

export default HeaderSection;
