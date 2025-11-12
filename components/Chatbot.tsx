import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { ChatMessage } from '../types';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { Lucide } = (window as any);
  const MessageCircle = Lucide?.MessageCircle;
  const X = Lucide?.X;
  const Send = Lucide?.Send;
  const Bot = Lucide?.Bot;
  const User = Lucide?.User;

  useEffect(() => {
    if (isOpen && !chatRef.current) {
        if (!process.env.API_KEY) {
            console.error("API_KEY not found for chatbot.");
            return;
        }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are a friendly and helpful assistant for a children\'s coloring book app. Keep your answers concise and cheerful.',
        },
      });
      setMessages([
        { id: 'initial', role: 'model', text: 'Hello! I can help you with questions about coloring or anything else!' }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        if (!chatRef.current) throw new Error("Chat not initialized");
        const response = await chatRef.current.sendMessage({ message: input });
        const modelMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: response.text };
        setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
        console.error("Chatbot error:", error);
        const errorMessage: ChatMessage = { id: 'error', role: 'model', text: 'Oops! Something went wrong. Please try again.' };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-rose-500 text-white rounded-full p-4 shadow-lg hover:bg-rose-600 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 z-50"
        aria-label="Toggle Chatbot"
      >
        {isOpen ? (X && <X size={28} />) : (MessageCircle && <MessageCircle size={28} />)}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-[28rem] bg-white rounded-2xl shadow-xl flex flex-col z-40 border border-gray-200">
          <div className="bg-rose-500 text-white p-3 rounded-t-2xl">
            <h3 className="font-bold text-lg text-center">Helpful Assistant</h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-rose-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-2.5 mb-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center flex-shrink-0">
                        {Bot && <Bot className="w-5 h-5 text-rose-600" />}
                    </div>
                )}
                <div className={`p-3 rounded-xl max-w-[80%] ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                  {msg.text}
                </div>
                 {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0">
                        {User && <User className="w-5 h-5 text-blue-600" />}
                    </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center flex-shrink-0">
                    {Bot && <Bot className="w-5 h-5 text-rose-600" />}
                </div>
                <div className="p-3 rounded-xl bg-gray-200">
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t flex items-center bg-white rounded-b-2xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 px-3 py-2 border rounded-full focus:ring-rose-500 focus:border-rose-500"
            />
            <button onClick={handleSend} className="ml-2 text-rose-500 p-2 rounded-full hover:bg-rose-100" disabled={isLoading}>
                {Send && <Send size={24}/>}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
