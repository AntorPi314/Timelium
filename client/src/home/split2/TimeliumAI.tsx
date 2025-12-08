import { useState } from 'react';

type Message = {
  role: string;
  text: string;
};

const TimeliumAI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');

    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      const response = await fetch(`${API_URL}/gemini/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        { role: 'ai', text: data.response }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: 'Something went wrong. Try again!' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full h-[50%] p-4">
      <div className="w-full h-full bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="bg-linear-to-r from-[#6937CE] via-[#5E20DB] to-[#B618CB] 
                bg-clip-text text-transparent text-3xl font-semibold">
                Hello, User
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 px-4 py-3 rounded-2xl flex gap-1">
                    <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6">
          <div className="w-full h-16 p-[2px] rounded-[20px] bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400">
            <div className="w-full h-full bg-slate-50 rounded-[18px] flex items-center px-5 gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Timelium AI..."
                className="flex-1 bg-transparent text-stone-700 text-lg outline-none placeholder:text-stone-400"
                disabled={loading}
              />

              <button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center text-white disabled:opacity-50"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TimeliumAI;
