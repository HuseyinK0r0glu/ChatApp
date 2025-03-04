import React , {useState , useEffect , useRef} from "react";
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

const Chat = () => {

    const colors = ['#2196F3', '#32c787', '#00BCD4', '#ff5652', '#ffc107', '#ff85af', '#FF9800', '#39bbb0'];

    const [messages,setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [username, setUsername] = useState('');
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState('');

    const stompClientRef = useRef(null); 

    useEffect(() => {
        if (stompClientRef.current) {
            stompClientRef.current.activate();
          }

        return () => {
            if (stompClientRef.current) {
              stompClientRef.current.disconnect();
              stompClientRef.current = null;
            }
          };

    },[]);

    const sendMessage = (event) => {
        // to prevent the refresh of the page
        event.preventDefault();
        if (messageInput.trim() && connected && stompClientRef.current) {
            const chatMessage = {
                sender: username,
                content: messageInput,
            };
            stompClientRef.current.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));
            setMessageInput(''); // Reset input field
        }
    };

    const getAvatarColor = (messageSender) => {
        let hash = 0;
        for (let i = 0; i < messageSender.length; i++) {
          hash = 31 * hash + messageSender.charCodeAt(i);
        }
        const index = Math.abs(hash % colors.length);
        return colors[index];
      };

    const connect = (event) => {
        event.preventDefault();
        if (username.trim()) {
            const socket = new SockJS('http://localhost:8080/ws'); // Create WebSocket connection
            const client = Stomp.over(socket); // Use Stomp.js over SockJS
    
            client.connect({}, () => {
                setConnected(true); 
                stompClientRef.current = client; // Store client in ref
    
                client.subscribe('/topic/public', (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                });

                const joinMessage = {
                    sender : username,
                    type : 'JOIN',
                    content : `${username} has joined the chat`
                }

                client.send('/app/chat.addUser' , {} , JSON.stringify(joinMessage));

            }, onError); // Handle connection error
        } else {
            setError('Please enter a username');
        }
    };

    const onError = () => {
        setError('Could not connect to WebSocket server. Please refresh this page to try again!');
      };

    return (
        <div>
            {!connected ? (
            <div id="username-page">
                <form id="usernameForm" onSubmit={connect}>
                <input
                    type="text"
                    id="name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                />
                <button type="submit">Join Chat</button>
                </form>
                {error && <p>{error}</p>}
            </div>
            ) : (
            <div id="chat-page">
                <ul id="messageArea">
                <li className="welcome-message">Welcome to the Chat App!</li>
                {messages.map((msg, index) => (
                    <li key={index} className={msg.type === 'JOIN' || msg.type === 'LEAVE' ? 'event-message' : 'chat-message'}>
                    {msg.type === 'JOIN' ? (
                        <span>{msg.sender} has joined!</span>
                    ) : msg.type === 'LEAVE' ? (
                        <span>{msg.sender} has left!</span>
                    ) : (
                        <div className="message-container">
                            <i className="avatar" style={{ backgroundColor: getAvatarColor(msg.sender) }}>
                            {msg.sender[0]}
                            </i>
                            <div className="message-content">
                            <span className="sender">{msg.sender}</span>
                            <p className="content">{msg.content}</p>
                            </div>
                      </div>
                    )}
                    </li>
                ))}
                </ul>
                <form id="messageForm" onSubmit={sendMessage}>
                <input
                    type="text"
                    id="message"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Enter message"
                />
                <button type="submit">Send</button>
                </form>
            </div>
            )}
        </div>

    );
}

export default Chat;