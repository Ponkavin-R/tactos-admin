import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";

const DashboardSolution = () => {
  const [solutions, setSolutions] = useState([]);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/solutions`);
        const newSolutions = response.data.filter((sol) => sol.status === "new");
        setSolutions(newSolutions);
      } catch (error) {
        console.error("Error fetching solutions:", error);
      }
    };

    fetchSolutions();
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 4,
        padding: 3,
        backgroundColor: "#f9f9f9",
        marginTop: 4,
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">IT Solution Form</h2>
        <span style={{
                      backgroundColor: "#e0f7fa",
                      color: "#00796b",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontWeight: "bold",
                      display: "inline-block",
                    }}>
          Total: {solutions.length}
        </span>
      </div>
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Startup Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Founder</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solutions.map((solution, index) => (
              <motion.tr
                key={solution._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TableCell>{solution.startupName}</TableCell>
                <TableCell>{solution.founderName}</TableCell>
                <TableCell>{solution.email}</TableCell>
                <TableCell>{solution.phoneNumber}</TableCell>
                <TableCell>
                  <span
                    style={{
                      backgroundColor: "#e0f7fa",
                      color: "#00796b",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontWeight: "bold",
                      display: "inline-block",
                    }}
                  >
                    {solution.status}
                  </span>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DashboardSolution;
