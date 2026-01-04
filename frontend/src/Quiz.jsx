import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { Card, CardContent } from './components/Card';
import { Button } from './components/Button';
import { getNextQuestion, submitAnswer } from './api';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function Quiz() {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);

    const fetchQuestion = async () => {
        setLoading(true);
        setFeedback(null);
        setSelectedOption(null);
        try {
            const res = await getNextQuestion(1);
            setQuestion(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, []);

    const handleOptionSelect = (opt) => {
        if (feedback) return; // Prevent changing after submit
        setSelectedOption(opt);
    };

    const handleSubmit = async () => {
        if (!selectedOption) return;

        setLoading(true); // Short loading state for submission
        try {
            const res = await submitAnswer(1, {
                question_id: question.id,
                selected_answer: selectedOption,
                time_taken: 10.0 // Mock time
            });
            setFeedback(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="max-w-3xl mx-auto p-6">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Adaptive Quiz Mode</h1>
                    {question && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${question.difficulty > 0.7 ? 'bg-red-500/20 text-red-500' :
                                question.difficulty < 0.3 ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                            }`}>
                            Difficulty: {(question.difficulty * 100).toFixed(0)}%
                        </span>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {loading && !feedback && !question ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex h-64 items-center justify-center"
                        >
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="ml-2">AI is generating your next challenge...</span>
                        </motion.div>
                    ) : question ? (
                        <motion.div
                            key={question.id}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="border-primary/20 bg-card/60 backdrop-blur-3xl shadow-2xl">
                                <CardContent className="p-8 space-y-6">
                                    <div className="text-sm text-muted-foreground uppercase tracking-wider">{question.topic}</div>
                                    <h2 className="text-2xl font-semibold">{question.content}</h2>

                                    <div className="grid gap-3 pt-4">
                                        {question.options.map((opt, i) => {
                                            let btnClass = "justify-start h-auto py-4 text-left text-lg ";
                                            if (feedback) {
                                                if (opt === feedback.correct_answer) btnClass += "bg-green-500/20 hover:bg-green-500/30 border-green-500 text-green-100 ";
                                                else if (opt === selectedOption && !feedback.correct) btnClass += "bg-red-500/20 border-red-500 text-red-100 ";
                                            } else {
                                                if (selectedOption === opt) btnClass += "border-primary bg-primary/10 ring-2 ring-primary ring-offset-2 ring-offset-background ";
                                                else btnClass += "hover:bg-accent ";
                                            }

                                            return (
                                                <Button
                                                    key={i}
                                                    variant="outline"
                                                    className={btnClass}
                                                    onClick={() => handleOptionSelect(opt)}
                                                    disabled={!!feedback}
                                                >
                                                    <span className="mr-3 font-mono opacity-50">{String.fromCharCode(65 + i)}.</span>
                                                    {opt}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Feedback & Next */}
                            {feedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 p-4 rounded-lg bg-card border"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className={`font-bold text-lg ${feedback.correct ? "text-green-500" : "text-red-500"}`}>
                                                {feedback.correct ? "Excellent!" : "Not quite."}
                                            </h3>
                                            <p className="text-muted-foreground">{feedback.feedback}</p>
                                            <p className="text-xs mt-1 text-blue-400">New Topic Strength: {(feedback.new_topic_strength * 100).toFixed(0)}%</p>
                                        </div>
                                        <Button onClick={fetchQuestion} size="lg">Next Challenge arrow_right</Button>
                                    </div>
                                </motion.div>
                            )}

                            {!feedback && (
                                <div className="mt-6 flex justify-end">
                                    <Button onClick={handleSubmit} size="lg" disabled={!selectedOption || loading}>
                                        {loading ? <Loader2 className="animate-spin" /> : "Submit Answer"}
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </div>
    );
}
