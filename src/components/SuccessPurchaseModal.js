import React, { useEffect, useState } from "react";
import { Button, Modal } from "semantic-ui-react";

const SuccessPurchaseModal = ({ open = false, setOpen, item }) => {
	const [header, setHeader] = useState("Make Purchase");
	const [description, setDescription] = useState(
		"Placing an order... Please wait..."
	);
	const [done, setDone] = useState(false);

	useEffect(() => {
		if (open) {
			setTimeout(() => {
				setHeader("Purchase Successful");
				setDescription(
					`You have successfully paid USD ${item.price} for ${item.header}!`
				);
				setDone(true);
			}, 1000);
		} else {
			setHeader("Make Purchase");
			setDescription("Placing an order... Please wait...");
			setDone(false);
		}
	}, [open]);

	return (
		<Modal
			onClose={() => setOpen(false)}
			onOpen={() => setOpen(true)}
			open={open}
		>
			<Modal.Header>{header}</Modal.Header>
			<Modal.Content>
				<Modal.Description>{description}</Modal.Description>
			</Modal.Content>
			{done && (
				<Modal.Content>
					<Button primary onClick={() => setOpen(false)}>
						Done
					</Button>
				</Modal.Content>
			)}
		</Modal>
	);
};

export default SuccessPurchaseModal;
