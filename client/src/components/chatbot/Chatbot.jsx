import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Minimize2, Maximize2 } from "lucide-react";

// Predefined responses for the chatbot
const responses = {
  greeting: [
    "Hi there! 👋 How can I help you today?",
    "Hello! Welcome to VrudhaCare. How may I assist you?",
  ],
  about: [
    "VrudhaCare is an initiative by an old age home to sell handmade products crafted by elderly residents and collect donations to support their care.",
  ],
  products: [
    "We offer a variety of handmade products including handicrafts, paintings, knitted items, and more. All made with love by our elderly residents! You can check our Products page for more details.",
  ],
  delivery: [
    "We typically deliver products within 3-5 business days. Shipping is free for all orders!",
  ],
  payment: [
    "We accept Cash on Delivery (COD) as well as online payments through Razorpay (credit/debit cards, UPI, net banking).",
  ],
  returns: [
    "We have a 7-day return policy. If you're not satisfied with your purchase, please email us at returns@vrudhacare.com.",
  ],
  donations: [
    "Your donations help provide better facilities, healthcare, and activities for our elderly residents. You can donate any amount on our Donation page.",
  ],
  contact: [
    "You can reach us at contact@vrudhacare.com or call us at +1 (555) 123-4567.",
  ],
  fallback: [
    "I'm not sure I understand. Could you rephrase your question?",
    "I'm still learning. Could you ask that in a different way?",
    "I don't have that information yet. Would you like to know about our products or donation process?",
  ],
};

// Function to get response based on user input
const getResponse = (message) => {
  const lowercaseMsg = message.toLowerCase();

  if (
    lowercaseMsg.includes("hello") ||
    lowercaseMsg.includes("hi") ||
    lowercaseMsg.includes("hey")
  ) {
    return responses.greeting[
      Math.floor(Math.random() * responses.greeting.length)
    ];
  } else if (
    lowercaseMsg.includes("about") ||
    lowercaseMsg.includes("who are you") ||
    lowercaseMsg.includes("what is vrudhacare")
  ) {
    return responses.about[0];
  } else if (
    lowercaseMsg.includes("product") ||
    lowercaseMsg.includes("items") ||
    lowercaseMsg.includes("sell") ||
    lowercaseMsg.includes("buy")
  ) {
    return responses.products[0];
  } else if (
    lowercaseMsg.includes("deliver") ||
    lowercaseMsg.includes("shipping") ||
    lowercaseMsg.includes("ship")
  ) {
    return responses.delivery[0];
  } else if (
    lowercaseMsg.includes("payment") ||
    lowercaseMsg.includes("pay") ||
    lowercaseMsg.includes("razorpay") ||
    lowercaseMsg.includes("cash")
  ) {
    return responses.payment[0];
  } else if (
    lowercaseMsg.includes("return") ||
    lowercaseMsg.includes("refund")
  ) {
    return responses.returns[0];
  } else if (
    lowercaseMsg.includes("donation") ||
    lowercaseMsg.includes("donate") ||
    lowercaseMsg.includes("giving") ||
    lowercaseMsg.includes("contribute")
  ) {
    return responses.donations[0];
  } else if (
    lowercaseMsg.includes("contact") ||
    lowercaseMsg.includes("email") ||
    lowercaseMsg.includes("phone") ||
    lowercaseMsg.includes("call")
  ) {
    return responses.contact[0];
  } else {
    return responses.fallback[
      Math.floor(Math.random() * responses.fallback.length)
    ];
  }
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add initial greeting when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          text: "👋 Hi there! I'm the VrudhaCare assistant. How can I help you today?",
          sender: "bot",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = { text: inputMessage, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage("");

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = { text: getResponse(inputMessage), sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 800);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-emerald-600 text-white rounded-full p-4 shadow-lg hover:bg-emerald-700 transition-colors"
          aria-label="Open chat"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden w-80 md:w-96 flex flex-col">
          {/* Chat header */}
          <div className="bg-emerald-600 text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              <h3 className="font-medium">VrudhaCare Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMinimize}
                className="text-white hover:text-emerald-200 transition-colors"
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={toggleChat}
                className="text-white hover:text-emerald-200 transition-colors"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Chat messages */}
          {!isMinimized && (
            <div className="p-4 h-72 overflow-y-auto bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-3 ${
                    message.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block px-3 py-2 rounded-lg max-w-[85%] ${
                      message.sender === "user"
                        ? "bg-emerald-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Chat input */}
          {!isMinimized && (
            <form
              onSubmit={handleSubmit}
              className="border-t border-gray-200 p-3 flex items-center"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 text-white px-3 py-2 rounded-r-md hover:bg-emerald-700 transition-colors"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
