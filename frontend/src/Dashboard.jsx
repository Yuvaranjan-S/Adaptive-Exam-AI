import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from './components/Card';
import { getDashboardStats } from './api';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await getDashboardStats(1); // Demo user ID 1
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <div className="min-h-screen bg-background text-white flex items-center justify-center">Loading AI Analytics...</div>;

    const chartData = {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
        datasets: [
            {
                label: 'Mastery Progression',
                data: [65, 59, 80, 81, stats?.stats.average_score || 85],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Learning Curve' },
        },
        scales: {
            y: { grid: { color: 'rgba(255, 255, 255, 0.1)' } },
            x: { grid: { color: 'rgba(255, 255, 255, 0.1)' } },
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                <h1 className="text-3xl font-bold">Student Dashboard</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.stats.total_quizzes}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-500">{stats?.stats.average_score}%</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Best Topic</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-400">{stats?.stats.strongest_topic}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Weakest Topic</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-400">{stats?.stats.weakest_topic}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* AI Predictions */}
                <h2 className="text-2xl font-bold pt-4 text-red-500">⚠️ AI Predicted Risk Areas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats?.weak_areas.map((area, i) => (
                        <Card key={i} className="border-red-500/30 bg-red-500/5">
                            <CardHeader>
                                <CardTitle className="text-red-400">{area.topic}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground mb-2">Predicted Failure Probability</div>
                                <div className="text-3xl font-mono text-red-500">{area.predicted_fail_probability * 100}%</div>
                                <div className="text-xs text-muted-foreground mt-2">Current Mastery: {area.current_mastery}%</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="col-span-1">
                        <CardHeader><CardTitle>Performance Trend</CardTitle></CardHeader>
                        <CardContent className="h-64 flex items-center justify-center">
                            <Line options={chartOptions} data={chartData} />
                        </CardContent>
                    </Card>
                    <Card className="col-span-1">
                        <CardHeader><CardTitle>Topic Comparison</CardTitle></CardHeader>
                        <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
                            {/* Placeholder for Radar Chart */}
                            (More detailed analytics available in full version)
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
