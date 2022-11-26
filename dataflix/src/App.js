import React from "react";
import "./App.css";
import NavBar from "./components/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Evolution from "./components/Evolution/Evolution";
import World from "./components/World/World";

function App() {
  return (
    <div className="app">
      <div>
        <BrowserRouter>
          <NavBar></NavBar>
          <Routes>
            <Route exact path="/" element={<Evolution />}></Route>
            <Route exact path="/world" element={<World />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
