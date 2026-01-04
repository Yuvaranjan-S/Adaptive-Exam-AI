import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';
import { motion } from 'framer-motion';

export default function Landing() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl space-y-8"
            >
                <div className="space-y-4">
                    <h1 className="text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                        Adaptive Exam AI
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        The intelligent learning platform that evolves with you.
                        <br />
                        Powered by Behavioral Analysis & Knowledge Graphs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
                    {[
                        { title: "Dynamic Knowledge Graph", desc: "Visualizes your mastery in real-time." },
                        { title: "Predictive AI", desc: "Knows what you'll fail before you do." },
                        { title: "Adaptive Difficulty", desc: "Questions that grow with your skills." }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            className="p-6 rounded-lg border bg-card/50 backdrop-blur-sm"
                        >
                            <h3 className="font-bold mb-2">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <Link to="/dashboard">
                    <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0">
                        Start Learning Now
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}
