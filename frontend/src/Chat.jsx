import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { chatWithTutor } from './api';
import { Send, Bot, User } from 'lucide-react';

export default function Chat() {
    const [messages, setMessages] = useState([
        { role: 'bot', content: "Hello! I'm your AI Tutor. I noticed you might be struggling with 'React Hooks'. Want a quick explanation?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMsgs = [...messages, { role: 'user', content: input }];
        setMessages(newMsgs);
        setInput("");
        setLoading(true);

        try {
            const res = await chatWithTutor(input);
            setMessages([...newMsgs, { role: 'bot', content: res.data.reply }]);
        } catch (err) {
            setMessages([...newMsgs, { role: 'bot', content: "Sorry, I'm having trouble thinking right now." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-4xl mx-auto w-full p-4 flex flex-col">
                <Card className="flex-1 flex flex-col bg-card/60 backdrop-blur-xl border-primary/10">
                    {/* Header */}
                    <div className="p-4 border-b flex items-center space-x-3 bg-secondary/20 rounded-t-xl">
                        <div className="p-2 bg-primary rounded-lg text-primary-foreground"><Bot size={20} /></div>
                        <div>
                            <h2 className="font-bold">AI Tutor</h2>
                            <p className="text-xs text-muted-foreground">Always online • Conceptual Support</p>
                        </div>
                    </div>

                    {/* Msg Log */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[500px]">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-4 ${m.role === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                                        : 'bg-muted text-foreground rounded-tl-none'
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {loading && <div className="text-xs text-muted-foreground animate-pulse">AI is typing...</div>}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t flex gap-2">
                        <input
                            className="flex-1 bg-background border rounded-md px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Ask for help..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <Button onClick={handleSend} size="icon"><Send size={18} /></Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
