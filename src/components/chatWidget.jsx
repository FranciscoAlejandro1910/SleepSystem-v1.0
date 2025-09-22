// src/components/ChatWidget.jsx
import { useState } from "react";
import { MessageCircle, X } from "lucide-react"; 
import "./ChatWidget.css"; // importa el CSS
import { getResponse } from "../../scripts/chatApi";

export default function ChatWidget({ onSendMessage }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "¡Hola! SOY TU ASISTENTE DEL SUEÑO, ¿EN QUÉ TE AYUDO?" }
  ]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    try {
      const botResponse = await getResponse(input);
      setMessages([...newMessages, { sender: "bot", text: botResponse }]);
    } catch (error) {
      setMessages([...newMessages, { sender: "bot", text: "Error: " + error.message }]);
    }
  };

  return (
    <div className="chat-widget">
      {open ? (
        <div className="chat-box">
          {/* Header */}
          <div className="chat-header">
            <span>Asistente</span>
            <button onClick={() => setOpen(false)} className="close-btn">
              <X size={20} />
            </button>
          </div>

          {/* Mensajes */}
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-message ${
                  msg.sender === "user" ? "user" : "bot"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <form className="chat-input-row" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
            />
            <button type="submit" className="send-btn">
              Enviar
            </button>
          </form>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="chat-toggle">
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}
