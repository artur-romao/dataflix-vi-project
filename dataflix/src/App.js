import { React, useEffect, useState, StrictMode } from 'react';
import "./App.css";
import NavBar from "./components/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Evolution from "./components/Evolution/Evolution";
import World from "./components/World/World";
import Papa from "papaparse";
import netflix_titles from "./dataset/netflix_titles.csv";
import AgeRestriction from './components/AgeRestriction/AgeRestriction';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Papa.parse(netflix_titles, {
      download: true,
      complete: function (results) {
        let values = [];
        for (let i = 1; i < results.data.length; i++) {
          values.push({
            type: results.data[i][1],
            director: results.data[i][3],
            cast: results.data[i][4],
            country: results.data[i][5],
            date_added: results.data[i][6],
            age_rating: results.data[i][8],
            duration: results.data[i][9],
            genres: results.data[i][10],
          });
        }
        setData(values);
      },
    });
  }, []);

  return (
    <BrowserRouter>
      <StrictMode>
        <div className="app">
          {data ? (
            <>
              <NavBar></NavBar>
              <Routes>
                <Route exact path="/" element={<Home data={data}/>}></Route>
                <Route exact path="/evolution" element={<Evolution data={data}/>}></Route>
                <Route path="/world" element={<World data={data}/>}></Route>
                <Route path="/age-restriction" element={<AgeRestriction data={data}/>}></Route>
              </Routes>
            </>
          ) : ''}
        </div>
      </StrictMode>
    </BrowserRouter>
  );
}

export default App;
