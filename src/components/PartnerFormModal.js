import React, { useContext, useState } from "react";
import { Button, Dropdown, Form, Modal } from "semantic-ui-react";

// INTERNAL IMPORT
import { LoyaltyExchangeContext } from "../context/LoyalPApp";

const PartnerFormModal = () => {
	const { registerPartner } = useContext(LoyaltyExchangeContext);
	const [open, setOpen] = useState(false);
	const [companyName, setCompanyName] = useState("");
	const [programName, setProgramName] = useState("");
	const [redemptionRate, setRedemptionRate] = useState(0);

	return (
		<Modal
			onClose={() => setOpen(false)}
			onOpen={() => setOpen(true)}
			open={open}
			trigger={<Dropdown.Item>As a partner</Dropdown.Item>}
		>
			<Modal.Header>Register as Exchange Partner</Modal.Header>
			<Modal.Content>
				<Form>
					<Form.Field>
						<label>Company Name</label>
						<input
							type="text"
							placeholder="Company Name"
							value={companyName}
							onChange={e => setCompanyName(e.target.value)}
						/>
					</Form.Field>
					<Form.Field>
						<label>Loyalty Program Name</label>
						<input
							type="text"
							placeholder="Loyalty Program Name"
							value={programName}
							onChange={e => setProgramName(e.target.value)}
						/>
					</Form.Field>
					<Form.Field>
						<label>Redemption Rate (points per USD)</label>
						<input
							type="number"
							min="0"
							placeholder="Redemption Rate (points per USD)"
							value={redemptionRate}
							onChange={e => setRedemptionRate(e.target.value)}
						/>
					</Form.Field>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button
						primary
						onClick={() =>
							registerPartner(
								companyName,
								programName,
								redemptionRate
							)
						}
					>
						Submit
					</Button>
				</Form>
			</Modal.Content>
		</Modal>
	);
};

export default PartnerFormModal;
