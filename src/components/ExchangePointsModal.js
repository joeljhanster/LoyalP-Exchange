import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, Modal } from "semantic-ui-react";

// INTERNAL IMPORT
import { LoyaltyExchangeContext } from "../context/LoyalPApp";

const ExchangePointsModal = ({
	open = false,
	setOpen,
	points,
	programPoints
}) => {
	const { exchangePoints, getDestPoints } = useContext(
		LoyaltyExchangeContext
	);
	const [originProgram, setOriginProgram] = useState(points);
	const [destProgram, setDestProgram] = useState(
		programPoints.filter(
			point => point.programAddress !== points.programAddress
		)[0]
	);
	const [originPoints, setOriginPoints] = useState(0);
	const [destPoints, setDestPoints] = useState(0);
	const [originMax, setOriginMax] = useState(0);

	const router = useRouter();

	useEffect(() => {
		setOriginMax(originProgram.points);
		console.log(originProgram.points);
	}, [originProgram]);

	useEffect(() => {
		if (originProgram.programAddress === destProgram.programAddress) {
			setDestProgram(
				programPoints.filter(
					program =>
						program.programAddress !== originProgram.programAddress
				)[0]
			);
		}
	}, [originProgram, programPoints]);

	useEffect(() => {
		if (originProgram.programAddress === destProgram.programAddress) {
			setOriginProgram(
				programPoints.filter(
					program =>
						program.programAddress !== destProgram.programAddress
				)[0]
			);
		}
	}, [destProgram, programPoints]);

	useEffect(() => {
		if (originProgram && destProgram) {
			console.log("Getting dest points");
			getDestPoints(
				originProgram.programAddress,
				destProgram.programAddress,
				originPoints
			).then(points => {
				console.log(points);
				setDestPoints(points);
			});
		}
	}, [originProgram, destProgram, originPoints]);

	const onOriginChange = e => {
		setOriginProgram(
			programPoints.filter(
				program => program.programAddress === e.target.value
			)[0]
		);
	};

	const onDestChange = e => {
		setDestProgram(
			programPoints.filter(
				program => program.programAddress === e.target.value
			)[0]
		);
	};

	const validateForm = () => {
		if (
			originPoints > 0 &&
			destPoints > 0 &&
			originProgram.programAddress !== destProgram.programAddress
		) {
			return true;
		}
		return false;
	};

	return (
		<Modal
			onClose={() => setOpen(false)}
			onOpen={() => setOpen(true)}
			open={open}
		>
			<Modal.Header>Exchange points</Modal.Header>
			<Modal.Content>
				<Form>
					<Form.Field>
						<Form.Field>
							<label>Origin Loyalty Program</label>
							<div className="fields">
								<div className="twelve wide field">
									<input
										type="number"
										min={0}
										max={originMax}
										value={originPoints}
										placeholder="Points to exchange from"
										onChange={e =>
											setOriginPoints(e.target.value)
										}
									/>
								</div>
								<div className="twelve wide field">
									<select
										class="ui fluid dropdown"
										value={originProgram.programAddress}
										onChange={onOriginChange}
									>
										{programPoints &&
											programPoints.map(program => {
												return (
													<option
														key={
															program.programAddress
														}
														value={
															program.programAddress
														}
													>
														{program.programName} (
														{program.points} points)
													</option>
												);
											})}
									</select>
								</div>
							</div>
						</Form.Field>
						<Form.Field>
							<label>Destination Loyalty Program</label>
							<div className="fields">
								<div className="twelve wide field">
									<input
										type="number"
										min={0}
										value={destPoints}
										placeholder="Points to exchange to"
										disabled
									/>
								</div>
								<div className="twelve wide field">
									<select
										class="ui fluid dropdown"
										value={destProgram.programAddress}
										onChange={onDestChange}
									>
										{programPoints &&
											programPoints.map(program => {
												return (
													<option
														value={
															program.programAddress
														}
													>
														{program.programName}
													</option>
												);
											})}
									</select>
								</div>
							</div>
						</Form.Field>
					</Form.Field>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button
						primary
						disabled={!validateForm()}
						onClick={async () => {
							await exchangePoints(
								originProgram.programAddress,
								destProgram.programAddress,
								originPoints
							);
							router.reload();
						}}
					>
						Exchange
					</Button>
				</Form>
			</Modal.Content>
		</Modal>
	);
};

export default ExchangePointsModal;
