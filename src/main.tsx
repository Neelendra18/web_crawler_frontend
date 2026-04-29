
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './providers/AuthProvider';
import './styles/tailwind.css';
import './styles/enterprise.css';

const Root = () => {
	const [appKey, setAppKey] = useState(0);
	// Listen for a custom event to force re-render on logout
	React.useEffect(() => {
		const handler = () => setAppKey(k => k + 1);
		window.addEventListener('airithm-logout', handler);
		return () => window.removeEventListener('airithm-logout', handler);
	}, []);
	return (
		<AuthProvider>
			<App key={appKey} />
		</AuthProvider>
	);
};

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
