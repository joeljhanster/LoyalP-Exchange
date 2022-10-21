import React from "react";
import { useRouter } from "next/router";
import { Button, Modal } from "semantic-ui-react";

const IssuePointsModal = ({ open = false, setOpen, item }) => {
	const router = useRouter();

	return (
		<Modal
			onClose={() => setOpen(false)}
			onOpen={() => setOpen(true)}
			open={open}
		>
			<Modal.Header>Successful Points Issuance</Modal.Header>
			<Modal.Content>
				<Modal.Description>
					You have successfully issued {item.points} points to{" "}
					{item.memberAddress}!
				</Modal.Description>
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

export default IssuePointsModal;
