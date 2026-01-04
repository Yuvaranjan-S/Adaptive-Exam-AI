import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { getDashboardStats } from './api';
import { motion } from 'framer-motion';

export default function KnowledgeGraph() {
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        getDashboardStats(1).then(res => {
            setNodes(res.data.knowledge_graph);
        });
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden">
            <Navbar />
            <div className="relative h-[calc(100vh-64px)] w-full flex items-center justify-center p-4">
                <h1 className="absolute top-8 left-8 text-2xl font-bold bg-card px-4 py-2 rounded-lg border">Knowledge Graph v1.0</h1>

                {/* Simple Visualization */}
                <div className="relative w-full h-full max-w-4xl max-h-[800px] border border-dashed border-white/10 rounded-3xl bg-black/20">
                    {nodes.map((node, i) => {
                        // Random position for demo (in production use D3 force sim)
                        const top = 20 + (Math.sin(i * 132) * 30 + 30) + '%';
                        const left = 20 + (Math.cos(i * 123) * 30 + 30) + '%';
                        const size = 80 + (node.strength * 100) + 'px';
                        const color = node.strength < 0.4 ? 'bg-red-500' : node.strength < 0.7 ? 'bg-yellow-500' : 'bg-green-500';

                        return (
                            <motion.div
                                key={i}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className={`absolute rounded-full flex items-center justify-center text-center shadow-[0_0_30px_rgba(0,0,0,0.5)] ${color} bg-opacity-20 backdrop-blur-md border border-white/20`}
                                style={{ top, left, width: size, height: size }}
                            >
                                <div className="p-2">
                                    <div className="font-bold text-white text-sm">{node.topic}</div>
                                    <div className="text-xs text-white/70">{(node.strength * 100).toFixed(0)}%</div>
                                </div>
                            </motion.div>
                        )
                    })}

                    {nodes.length === 0 && <div className="text-center mt-40 opacity-50">Play some quizzes to populate graph...</div>}
                </div>
            </div>
        </div>
    );
}
