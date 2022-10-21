import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, Modal } from "semantic-ui-react";

// INTERNAL IMPORT
import { LoyaltyExchangeContext } from "../context/LoyalPApp";

const PaymentModal = ({ open = false, setOpen, partnership }) => {
	const { createPaymentTransaction } = useContext(LoyaltyExchangeContext);
	const [amountPaid, setAmountPaid] = useState(partnership.amountDue);
	const router = useRouter();

	return (
		<Modal
			onClose={() => setOpen(false)}
			onOpen={() => setOpen(true)}
			open={open}
		>
			<Modal.Header>Make New Payment</Modal.Header>
			<Modal.Content>
				<Form>
					<Form.Field>
						<label>
							Partner Name: {partnership.destPartnerName}
						</label>
						<label>
							Partner Address: {partnership.destAddress}
						</label>
						<label>Amount Due: {partnership.amountDue}</label>
						<label>Amount paid in USD:</label>
						<input
							type="number"
							min="0"
							max={partnership.amountDue}
							defaultValue={partnership.amountDue}
							value={amountPaid}
							onChange={e => setAmountPaid(e.target.value)}
						/>
					</Form.Field>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button
						primary
						disabled={
							amountPaid > partnership.amountDue ||
							amountPaid <= 0
						}
						onClick={async () => {
							await createPaymentTransaction(
								partnership.destAddress,
								amountPaid
							);
							router.reload();
						}}
					>
						Submit
					</Button>
				</Form>
			</Modal.Content>
		</Modal>
	);
};

export default PaymentModal;
