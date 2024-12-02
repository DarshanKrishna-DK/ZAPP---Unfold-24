import { useState } from 'react';
import './App.css'; // Make sure to include your styles
import { makeAgoricWalletConnection } from '@agoric/web-components';

function App() {
    const [walletConnected, setWalletConnected] = useState(false);
    const [userInput, setUser Input] = useState('');
    const [chatMessages, setChatMessages] = useState<{ user: string; bot: string }[]>([]);

    const connectWallet = async () => {
        try {
            await makeAgoricWalletConnection();
            setWalletConnected(true);
        } catch (error) {
            console.error('Wallet connection failed:', error);
        }
    };

    const handleSend = () => {
        if (userInput.trim() === '') return;

        // Add user message to chat
        setChatMessages([...chatMessages, { user: userInput, bot: '...' }]);
        
        // Simulate bot response (replace this with actual logic)
        setTimeout(() => {
            setChatMessages((prev) => {
                const lastMessage = prev[prev.length - 1];
                return [...prev.slice(0, -1), { ...lastMessage, bot: `Bot response to: ${userInput}` }];
            });
        }, 1000);

        setUser Input(''); // Clear input
    };

    return (
        <div className="app">
            <header className="app-header">
                <h1 className="app-title">ZAPP</h1>
                <button className="connect-wallet" onClick={connectWallet}>
                    {walletConnected ? 'Wallet Connected' : 'Connect Wallet'}
                </button>
            </header>
            <div className="chat-container">
                <div className="chat-window">
                    {chatMessages.map((msg, index) => (
                        <div key={index} className="chat-message">
                            <div className="user-message">{msg.user}</div>
                            <div className="bot-message">{msg.bot}</div>
                        </div>
                    ))}
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUser Input(e.target.value)}
                        placeholder="Type your message..."
                    />
                    <button onClick={handleSend}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default App;