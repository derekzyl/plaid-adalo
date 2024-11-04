import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  useParams,
  Routes,
} from "react-router-dom";
import TransHapp from "./trans";
import Happ from "./happ";
import Home from "./home";
import { usePlaidLink } from "react-plaid-link";

import "./App.css";
import { isDataView } from "util/types";

// LINK COMPONENT
// Use Plaid Link and pass link token and onSuccess function
// in configuration to initialize Plaid Link
// interface LinkProps {
//   linkToken: string | null;
// }

// const linkedin = "https://plaid-external-api.herokuapp.com";

const App = () => {
  // const tokener: string | null = localStorage.getItem("link_token");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/:email" element={<Happ />} />
        <Route path="/transactions/:token" element={<TransHapp />} />
      </Routes>
    </Router>
  );
};

export default App;
