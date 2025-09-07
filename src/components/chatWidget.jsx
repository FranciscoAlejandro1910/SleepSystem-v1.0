// src/components/ChatWidget.jsx
import { useState } from "react";
import { MessageCircle, X } from "lucide-react"; 
import "./ChatWidget.css"; // importa el CSS
import { getResponse } from "../../scripts/chatApi";

export default function ChatWidget({ onSendMessage }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    
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
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} className="send-btn">
              Enviar
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="chat-toggle">
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}
