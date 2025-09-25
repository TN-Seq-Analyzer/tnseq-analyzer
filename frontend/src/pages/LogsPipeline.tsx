import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

const LogsPipeline: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([
    "2025-09-08 13:00:59.249 - INFO - Log do pipeline pronto para receber mensagens.",
    "2025-09-08 13:00:59.249 - INFO - Log do pipeline pronto para receber mensagens.",
    "2025-09-08 13:00:59.249 - INFO - Log do pipeline pronto para receber mensagens.",
    "2025-09-08 13:00:59.249 - INFO - Log do pipeline pronto para receber mensagens.",
    "2025-09-08 13:00:59.249 - INFO - Log do pipeline pronto para receber mensagens.",
    "2025-09-08 13:00:59.249 - INFO - Log do pipeline pronto para receber mensagens.",
    "2025-09-08 13:00:59.249 - INFO - Log do pipeline pronto para receber mensagens.",
  ]);
  const webSocketRef = useRef<WebSocket | null>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket("ws://localhost:8000/api/logs/pipeline");

        ws.onopen = () => {
          console.log("Conectado ao WebSocket de logs");
        };

        ws.onmessage = (event) => {
          setLogs((prevLogs) => [...prevLogs, event.data]);
        };

        ws.onclose = () => {
          console.log("Desconectado do WebSocket de logs");

          setTimeout(() => {
            connectWebSocket();
          }, 3000);
        };

        webSocketRef.current = ws;
      } catch (error) {
        console.error("Erro ao conectar WebSocket:", error);

        setTimeout(() => {
          connectWebSocket();
        }, 5000);
      }
    };

    connectWebSocket();

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop =
        logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Box p={3}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Logs do Pipeline
      </Typography>
      <Box
        ref={logsContainerRef}
        sx={{
          height: "calc(100vh - 150px)",
          overflow: "auto",
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          p: 2,
          fontFamily: "monospace",
          fontSize: "0.875rem",
          whiteSpace: "pre-wrap",
          backgroundColor: "#fff",
        }}
      >
        {logs.map((log, index) => (
          <Box key={index} sx={{ mb: 0.5 }}>
            {log}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default LogsPipeline;
