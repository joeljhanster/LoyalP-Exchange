import "../styles/globals.css";

// INTERNAL IMPORT
import { LoyaltyExchangeProvider } from "../context/LoyalPApp";

const MyApp = ({ Component, pageProps }) => {
	return (
		<LoyaltyExchangeProvider>
			<div>
				<Component {...pageProps} />
			</div>
		</LoyaltyExchangeProvider>
	);
};

export default MyApp;
