import "./App.css";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow
} from "@material-ui/core";

import React from "react";

const tables = [
  {
    head: ["1", "2", "3"],
    body: [
      ["vienas", "du", "trys"],
      ["one", "two", "three"],
      ["один", "два", "три"],
      ["ein", "zwei", "drei"],
      ["un", "deux", "trois"],
      ["一", "二", "三"]
    ],
    foot: []
  }
];

const App: React.FC = () => {
  return (
    <Paper className="center">
      {tables.map((table, index) => (
        <Table key={index}>
          <TableHead>
            {table.head.map((cell, index) => (
              <TableCell>{cell}</TableCell>
            ))}
          </TableHead>
          <TableBody>
            {table.body.map((row, index) => (
              <TableRow>
                {row.map((cell, index) => (
                  <TableCell>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            {table.foot.map((cell, index) => (
              <TableCell>{cell}</TableCell>
            ))}
          </TableFooter>
        </Table>
      ))}
    </Paper>
  );
};

export default App;
