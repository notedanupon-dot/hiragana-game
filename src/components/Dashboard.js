import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';

const Dashboard = ({ stats, onStart }) => {
  const accuracy = stats.totalAttempts > 0 
    ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100) 
    : 0;

  // Process data for "Weakest Characters" chart
  const weakCharsData = Object.keys(stats.charStats)
    .map(key => {
      const { correct, attempts } = stats.charStats[key];
      return {
        name: key,
        accuracy: Math.round((correct / attempts) * 100)
      };
    })
    .sort((a, b) => a.accuracy - b.accuracy) // Sort lowest accuracy first
    .slice(0, 5); // Take top 5 worst

  return (
    <div className="dashboard">
      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total Quizzes</h3>
          <p>{stats.history.length}</p>
        </div>
        <div className="stat-card">
          <h3>Global Accuracy</h3>
          <p>{accuracy}%</p>
        </div>
      </div>

      <div className="action-area">
        <button className="start-btn" onClick={onStart}>Start New Quiz</button>
      </div>

      <div className="charts-container">
        <div className="chart-wrapper">
          <h4>Progress History</h4>
          {stats.history.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.history.slice(-10)}> 
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" hide />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="accuracy" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="no-data">Play a game to see your trend!</p>}
        </div>

        <div className="chart-wrapper">
          <h4>Focus Areas (Lowest Accuracy)</h4>
          {weakCharsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weakCharsData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" width={40} />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#ff6b6b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="no-data">No data yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;