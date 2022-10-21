import React, { useContext, useState } from "react";
import { Button, Dropdown, Form, Modal } from "semantic-ui-react";

// INTERNAL IMPORT
import { LoyaltyExchangeContext } from "../context/LoyalPApp";

const MemberFormModal = () => {
	const { registerMember } = useContext(LoyaltyExchangeContext);
	const [open, setOpen] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");

	return (
		<Modal
			onClose={() => setOpen(false)}
			onOpen={() => setOpen(true)}
			open={open}
			trigger={<Dropdown.Item>As a member</Dropdown.Item>}
		>
			<Modal.Header>Register as Exchange Member</Modal.Header>
			<Modal.Content>
				<Form>
					<Form.Field>
						<label>First Name</label>
						<input
							type="text"
							placeholder="First Name"
							value={firstName}
							onChange={e => setFirstName(e.target.value)}
						/>
					</Form.Field>
					<Form.Field>
						<label>Last Name</label>
						<input
							type="text"
							placeholder="Last Name"
							value={lastName}
							onChange={e => setLastName(e.target.value)}
						/>
					</Form.Field>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button
						primary
						onClick={() => registerMember(firstName, lastName)}
					>
						Submit
					</Button>
				</Form>
			</Modal.Content>
		</Modal>
	);
};

export default MemberFormModal;
