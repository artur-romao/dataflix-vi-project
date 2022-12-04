import React, { useEffect, useRef } from "react";
import WordCloud from "react-d3-cloud";

import "./Home.css";
import * as d3 from "d3";

const fontSize = (word) => word.value / 20;
const rotate = (word) => (word.value % 90) - 45;

function Home(props) {
  const { data } = props;
  const d3PieChart = useRef();
  const d3WordCloud = useRef();

  let tv_shows = [];
  let movies = [];
  let genres = {};
  let newData = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i].type === "TV Show") {
      tv_shows.push(data[i]);
    } else if (data[i].type === "Movie") {
      movies.push(data[i]);
    }
    if (data[i].genres) {
      let list_of_genres = data[i].genres.split(", ");
      for (let j = 0; j < list_of_genres.length; j++) {
        if (list_of_genres[j] in genres) {
          genres[list_of_genres[j]]++;
        } else {
          genres[list_of_genres[j]] = 1;
        }
      }
    }
  }

  // Transform dictionary into array of objects
  for (let key in genres) {
    newData.push({ text: key, value: genres[key] });
  }

  useEffect(() => {
    let width = 450;
    let height = 450;
    let margin = 40;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    let radius = Math.min(width, height) / 2 - margin;

    // append the svg object to the div called 'my_dataviz'
    let svg = d3
      .select(d3PieChart.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Create dummy data
    let vals = { a: tv_shows.length, b: movies.length };
    let pieColors = ["#fa6666", "#8b0000"];
    // set the color scale
    let color = d3.scaleOrdinal().domain(vals).range(pieColors);

    // Compute the position of each group on the pie:
    let pie = d3.pie().value(function (d) {
      return d.value;
    });
    let data_ready = pie(d3.entries(vals));

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.

    let arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

    svg
      .selectAll("whatever")
      .data(data_ready)
      .enter()
      .append("path")
      .attr("d", arcGenerator)
      .attr("fill", function (d) {
        return color(d.data.key);
      })
      .attr("stroke", "black")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    svg
      .selectAll("mySlices")
      .data(data_ready)
      .enter()
      .append("text")
      .text(function (d) {
        return d.data.key === "a"
          ? "TV shows: " + String(tv_shows.length)
          : "Movies: " + String(movies.length);
      })
      .attr("transform", function (d) {
        return "translate(" + arcGenerator.centroid(d) + ")";
      })
      .style("text-anchor", "middle")
      .style("font-size", 20)
      .style("font-weight", "bold");
  }, [data]);

  return (
    <>
      <h1 style={{ color: "#e26666" }}>Welcome to Dataflix!</h1>
      <p className="subtitle">
        Here you can find some interesting statistics about Netflix's content,
        explore at your own will.
      </p>
      <div className="content">
        <p>
          Dataflix is a data visualization application for all movies and series
          available on Netflix. Shows details about content, such as: age
          restriction, country of production, year added to Netflix, etc.
        </p>
        <p>
          Navigate through the navigation bar to explore different types of
          views!
        </p>
      </div>

      <div style={{ display: "flex" }}>
        <div className="pieChart">
          <svg ref={d3PieChart}></svg>
        </div>
        <div style={{ width: "50vw" }}>
          {
            <WordCloud
              width={1000}
              height={750}
              data={newData}
              // fontSize={fontSize}
              // rotate={rotate}
              padding={2}
            />
          }
        </div>
      </div>
    </>
  );
}

export default Home;
