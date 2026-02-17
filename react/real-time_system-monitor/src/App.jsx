import { useState, useEffect } from "react";
import { io } from 'socket.io-client';

function StatCard({ title, value, unit, color }) {
  return (
    <div style={{
        backgroundColor: "#1a1a1a",
        border: `1px solid ${color}`,
        borderRadius: "8px",
        padding: "20px",
        minWidth: "200px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
        transition: "border 0.3s ease"
      }}>
      <h3 style={{ color: "#888", margin: "0 0 10px 0", fontSize: "14px" }}>{title}</h3>
      <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
        <span style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>{value}</span>
        <span style={{ color: color, fontSize: "12px" }}>{unit}</span>
      </div>
    </div>
  );
}

function App() {
  const [metrics, setMetrics] = useState({ cpu: 0, ram: 0, dbStatus: "Offline" });
  const [logs, setLogs] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), msg: "Waiting for connection...", type: "info" }
  ]);

  useEffect(() => {
    const socket = io('http://localhost:5000', {
      transports: ['websocket']
    });

    socket.on("metrics_update", (data) => {
      console.log('Data received');
      setMetrics({
        cpu: data.cpu_usage, 
        ram: data.memory_usage,
        dbStatus: data.dbStatus
      });
      
      const newLog = {
        id: Date.now(),
        time: data.timestamp,
        msg: data.cpu_usage > 35 ? "High CPU load detected!" : "System stable",
        type: data.cpu_usage > 35 ? "warning" : "info",
      };

      setLogs((prevLogs) => [newLog, ...prevLogs].slice(0, 5));
    });
    return () => socket.disconnect();
  }, []); 

  return (
    <div style={{
        backgroundColor: "#0f0f0f", minHeight: "100vh", color: "white",
        padding: "40px", fontFamily: "sans-serif", display: "flex",
        flexDirection: "column", alignItems: "center"
      }}>
      <header style={{ marginBottom: "40px", textAlign: "center" }}>
        <h1 style={{ margin: 0 }}>System Monitor v2.0</h1>
        <p style={{ color: "#666" }}>Real-time hardware bridge (Python + React)</p>
      </header>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
        <StatCard title="CPU USAGE" value={metrics.cpu} unit="%" color={metrics.cpu > 35 ? "#ff4444" : "#00ff88"} />
        <StatCard title="RAM USAGE" value={metrics.ram} unit="%" color="#00d1ff" />
        <StatCard title="DATABASE STATUS" value={metrics.dbStatus} unit="OK" color="#ff0055" />
      </div>

      <section style={{ marginTop: "50px", width: '100%', maxWidth: '600px' }}>
        <h2>Server Logs</h2>
        <div style={{
            backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '5px',
            fontSize: '14px', border: '1px solid #333', textAlign: 'left', minHeight: '120px'
          }}>
          {logs.map((log) => (
            <code key={log.id} style={{ display: "block", marginBottom: '5px', color: log.type === 'warning' ? '#ffcc00' : '#00ff88' }}>
              <span style={{ color: "#666" }}>[{log.time}]</span> - {log.msg}
            </code>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;