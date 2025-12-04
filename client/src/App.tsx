import { useState } from 'react';

type Message = {
  role: string;
  text: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/gemini/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();

      // Add AI response
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: data.response 
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: 'Sorry, something went wrong. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-screen h-screen bg-[#1A0B2E] overflow-hidden font-sans select-none">
      
      <div className="absolute left-0 top-14 w-[280px] z-20">
        <div className="ml-[-30px] bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 rounded-r-[50px] shadow-[0_10px_40px_-10px_rgba(168,85,247,0.6)] h-24 flex items-center w-full">
          <div className="ml-[60px] text-fuchsia-400 text-7xl font-serif italic font-medium drop-shadow-lg">T</div>
        </div>
      </div>

      <div className="absolute left-[280px] top-0 w-[calc(100vw-870px)] h-screen border-r border-white/5 bg-[#1A0B2E]">
        <div className="h-20 w-full flex items-end justify-center gap-24 border-b border-white/10 pb-0">
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="text-white text-xl font-bold mb-3 tracking-wide">For you</div>
            <div className="w-16 h-1 bg-violet-500 rounded-t-full shadow-[0_0_15px_rgba(139,92,246,0.8)]"></div>
          </div>
          <div className="flex flex-col items-center cursor-pointer mb-4">
            <div className="text-white/60 text-xl font-bold hover:text-white/90 transition-colors tracking-wide">Following</div>
          </div>
        </div>

        <div className="p-6"></div>
      </div>

      <div className="absolute right-0 top-0 w-[590px] h-screen p-10 bg-[#1A0B2E]">
        <div className="text-stone-300 text-2xl font-medium mb-8 tracking-wide">
          Who's <span className="text-rose-500 font-semibold">trending</span> near you
        </div>

        <div className="absolute bottom-12 right-12 w-[480px] h-[350px] bg-white rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-violet-700 text-3xl font-semibold tracking-tight">
                  Hello, Antor
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white' 
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Loading */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 px-4 py-3 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
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
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Timelium AI..."
                  className="flex-1 bg-transparent text-stone-700 text-lg outline-none placeholder:text-stone-400"
                  disabled={loading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}

export default App;
