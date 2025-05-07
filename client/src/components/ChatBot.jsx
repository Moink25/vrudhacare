import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Minimize2, Maximize2 } from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm VrudhaCare's support assistant. How can I help you today?",
      sender: "bot",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    if (messagesEndRef.current && isOpen && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  // Common questions and answers
  const botResponses = {
    hello: "Hello! How can I help you today?",
    hi: "Hi there! How can I assist you?",
    product:
      "We offer a variety of handcrafted products made by our elderly artisans. You can browse our collection in the Products section.",
    delivery:
      "We typically deliver products within 3-5 business days across India.",
    payment:
      "We accept various payment methods including Cash on Delivery, Credit/Debit cards, UPI, and Net Banking.",
    return:
      "We have a 7-day return policy. If you're not satisfied with your purchase, please contact us for return instructions.",
    contact:
      "You can reach our customer support team at support@vrudhacare.com or call us at +91-9876543210.",
    donation:
      "Your donations help provide better facilities, healthcare, and activities for our elderly residents. You can donate through the Donation page.",
    bye: "Thank you for chatting with us. Have a great day!",
    thanks: "You're welcome! Is there anything else I can help you with?",
    "thank you": "You're welcome! Is there anything else I can help you with?",
  };

  // Function to get bot response
  const getBotResponse = (message) => {
    const lowerCaseMsg = message.toLowerCase();

    // Check for keywords in the message
    for (const [keyword, response] of Object.entries(botResponses)) {
      if (lowerCaseMsg.includes(keyword)) {
        return response;
      }
    }

    // Default responses if no keyword matches
    const defaultResponses = [
      "I'm not sure I understand. Could you please rephrase that?",
      "For more specific assistance, please email us at support@vrudhacare.com.",
      "Would you like to know about our products, delivery, or donation process?",
    ];

    return defaultResponses[
      Math.floor(Math.random() * defaultResponses.length)
    ];
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const userMessage = {
      text: inputMessage,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Simulate bot typing with a delay
    setTimeout(() => {
      const botMessage = {
        text: getBotResponse(inputMessage),
        sender: "bot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-all"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl flex flex-col w-80 sm:w-96 transition-all">
          {/* Chat header */}
          <div className="bg-emerald-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              <h3 className="font-medium">Customer Support</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMinimize}
                className="hover:bg-emerald-700 rounded p-1"
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={toggleChat}
                className="hover:bg-emerald-700 rounded p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-4 overflow-y-auto max-h-80 space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.sender === "user"
                          ? "bg-emerald-100 text-gray-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat input */}
              <form onSubmit={handleSendMessage} className="border-t p-3 flex">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-r-md transition"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
