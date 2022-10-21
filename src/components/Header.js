import React, { useContext } from "react";
import { useRouter } from "next/router";
import { Image } from "next/image";
import { Dropdown, Menu } from "semantic-ui-react";

// INTERNAL IMPORT
import { LoyaltyExchangeContext } from "../context/LoyalPApp";
import MemberFormModal from "./MemberFormModal";
import PartnerFormModal from "./PartnerFormModal";
// import Logo from "../assets/logo.png";

const Header = () => {
	const {
		connectWallet,
		currentAccount,
		isRegisteredMember,
		isRegisteredPartner
	} = useContext(LoyaltyExchangeContext);

	const router = useRouter();

	return (
		<>
			<Menu style={{ marginTop: "10px" }} pointing secondary>
				<Menu.Item>
					<img class="ui tiny image" src="logo.png"></img>
				</Menu.Item>
				<Menu.Item
					link
					active={router.pathname == "/"}
					onClick={() => router.push("/")}
				>
					Summary
				</Menu.Item>
				{isRegisteredMember ? (
					<Menu.Item
						link
						active={router.pathname === "/shopping"}
						onClick={() => router.push("/shopping")}
					>
						Shopping
					</Menu.Item>
				) : isRegisteredPartner ? (
					<>
						<Menu.Item
							link
							active={router.pathname === "/my-program"}
							onClick={() => router.push("/my-program")}
						>
							My Program
						</Menu.Item>
						<Menu.Item
							link
							active={router.pathname === "/transactions"}
							onClick={() => router.push("/transactions")}
						>
							My Transactions
						</Menu.Item>
					</>
				) : null}

				<Menu.Menu position="right">
					{currentAccount ? (
						<>
							<div className="item" style={{ fontSize: 12 }}>
								<i>
									{`Logged into ${currentAccount.slice(
										0,
										10
									)}... ${
										isRegisteredMember
											? "as a Member"
											: isRegisteredPartner
											? "as a Partner"
											: ""
									}`}
								</i>
							</div>
							{!isRegisteredMember && !isRegisteredPartner ? (
								<Dropdown item simple text="Register">
									<Dropdown.Menu>
										<MemberFormModal />
										<PartnerFormModal />
									</Dropdown.Menu>
								</Dropdown>
							) : null}
						</>
					) : (
						<a className="item" onClick={connectWallet}>
							Metamask Login
						</a>
					)}
				</Menu.Menu>
			</Menu>
		</>
	);
};

export default Header;
