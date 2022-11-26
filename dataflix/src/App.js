import { useEffect } from "react";
import "./App.css";
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
        <h1>Dataflix</h1>
      </div>
      <div className="content"></div>
    </div>
  );
}

export default App;
