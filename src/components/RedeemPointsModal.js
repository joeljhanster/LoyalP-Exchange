import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Modal } from "semantic-ui-react";

const RedeemPointsModal = ({ open = false, setOpen, item, insufficient }) => {
	const [header, setHeader] = useState("");
	const [description, setDescription] = useState("");

	const router = useRouter();

	useEffect(() => {
		if (insufficient) {
			setHeader("Insufficient Points");
			setDescription(
				"Sorry! You do not have enough points to redeem the product."
			);
		} else {
			setHeader("Successful Redemption");
			setDescription(
				`You have successfully redeemed ${
					item.header
				} for ${item.price * item.rate} points!`
			);
		}
	}, [insufficient]);
	return (
		<Modal
			onClose={() => {
				setOpen(false);
				router.reload();
			}}
			onOpen={() => setOpen(true)}
			open={open}
		>
			<Modal.Header>{header}</Modal.Header>
			<Modal.Content>
				<Modal.Description>{description}</Modal.Description>
			</Modal.Content>
			<Modal.Content>
				<Button
					primary
					onClick={() => {
						setOpen(false);
						router.reload();
					}}
				>
					Okay
				</Button>
			</Modal.Content>
		</Modal>
	);
};

export default RedeemPointsModal;
