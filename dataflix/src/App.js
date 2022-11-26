import React from "react";
import "./App.css";
import NavBar from "./components/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Evolution from "./components/Evolution/Evolution";
import World from "./components/World/World";
import { useEffect } from "react";
import Papa from "papaparse";
import netflix_titles from "./dataset/netflix_titles.csv";

function App() {
  
  useEffect(() => {
    Papa.parse(netflix_titles, {
      download: true,
      complete: function(results) {
        let values = [];
        for (let i = 1; i < results.data.length; i++) {
          values.push({type: results.data[i][1], director: results.data[i][3], cast: results.data[i][4], country: results.data[i][5], date_added: results.data[i][6], age_rating: results.data[i][8], duration: results.data[i][9], genres: results.data[i][10]});
        }
      }
    });
  }, []);

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
