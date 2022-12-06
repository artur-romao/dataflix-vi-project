import React, { useEffect, useRef } from "react";
import "./Evolution.css";
import * as d3 from "d3";
import * as d3Selection from "d3-selection";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

function TreatData(values) {
  let added_movies = {};
  let added_tv_shows = {};
  for (let i = 0; i < values.length; i++) {
    let date_added = values[i].date_added;
    let content_type = values[i].type;
    if (date_added !== "") {
      let date_added_list = date_added.trim().split(" ");
      date_added_list.splice(1, 1); // remove the day since we don't need it, the array will be [month, year]
      // let date_added_string = date_added_list[0] + " " + date_added_list[1]; // construct the date string "month year"
      let year_added = date_added_list[1];
      if (content_type === "Movie") {
        if (year_added in added_movies) {
          // if "month year" is already a key
          added_movies[year_added] += 1; // increment the value
        } else {
          // if not, start the counter
          added_movies[year_added] = 1;
        }
      }
      if (content_type === "TV Show") {
        if (year_added in added_tv_shows) {
          // if "month year" is already a key
          added_tv_shows[year_added] += 1; // increment the value
        } else {
          // if not, start the counter
          added_tv_shows[year_added] = 1;
        }
      }
    }
  }

  let movies_dataset = [];
  let tv_shows_dataset = [];

  for (let key in added_movies) {
    movies_dataset.push({ date: key, count: added_movies[key].toString() });
  }
  for (let key in added_tv_shows) {
    tv_shows_dataset.push({ date: key, count: added_tv_shows[key].toString() });
  }

  let dataset = [];
  dataset.push(
    { name: "Movies", values: movies_dataset },
    { name: "TV Shows", values: tv_shows_dataset }
  );
  return dataset;
}

function createGraph(dados, d3MultiLineChart) {
  var width = 1200;
  var height = 720;
  var margin = 50;
  var duration = 250;

  var lineOpacity = "0.25";
  var lineOpacityHover = "0.85";
  var otherLinesOpacityHover = "0.1";
  var lineStroke = "4.5px";
  var lineStrokeHover = "6px";

  var circleOpacity = "0.85";
  var circleOpacityOnLineHover = "0.25";
  var circleRadius = 3;
  var circleRadiusHover = 6;

  /* Format Data */
  var parseDate = d3.timeParse("%Y");
  dados.forEach(function (d) {
    d.values.forEach(function (d) {
      d.date = parseDate(d.date);
      d.count = +d.count;
    });
  });

  /* Scale */
  var xScale = d3
    .scaleTime()
    .domain(d3.extent(dados[0].values, (d) => d.date))
    .range([0, width - margin]);

  var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dados[0].values, (d) => d.count)])
    .range([height - margin, 0]);

  var color = ["#D81F26", "#047af7"];

  // remove the previous graph
  d3.select(d3MultiLineChart.current).selectAll("*").remove();

  /* Add SVG */
  var svg = d3
    .select(d3MultiLineChart.current)
    .attr("width", width + margin + "px")
    .attr("height", height + margin + "px")
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);

  /* Add line into SVG */
  var line = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.count));

  let lines = svg.append("g").attr("class", "lines");

  lines
    .selectAll(".line-group")
    .data(dados)
    .enter()
    .append("g")
    .attr("class", "line-group")
    .on("mouseover", function (d, i) {
      svg
        .append("text")
        .attr("class", "title-text")
        .style("fill", color[i])
        .text(d.name)
        .attr("text-anchor", "middle")
        .attr("x", (width - margin) / 2)
        .attr("y", 5);
    })
    .on("mouseout", function (d) {
      svg.select(".title-text").remove();
    })
    .append("path")
    .attr("class", "line")
    .attr("d", (d) => line(d.values))
    .style("stroke", (d, i) => color[i])
    .style("opacity", lineOpacity)
    .on("mouseover", function (d) {
      d3.selectAll(".line").style("opacity", otherLinesOpacityHover);
      d3.selectAll(".circle").style("opacity", circleOpacityOnLineHover);
      d3.select(this)
        .style("opacity", lineOpacityHover)
        .style("stroke-width", lineStrokeHover)
        .style("cursor", "pointer");
    })
    .on("mouseout", function (d) {
      d3.selectAll(".line").style("opacity", lineOpacity);
      d3.selectAll(".circle").style("opacity", circleOpacity);
      d3.select(this).style("stroke-width", lineStroke).style("cursor", "none");
    });

  /* Add circles in the line */
  lines
    .selectAll("circle-group")
    .data(dados)
    .enter()
    .append("g")
    .style("fill", (d, i) => color[i])
    .selectAll("circle")
    .data((d) => d.values)
    .enter()
    .append("g")
    .attr("class", "circle")
    .on("mouseover", function (d) {
      d3.select(this)
        .style("cursor", "pointer")
        .append("text")
        .attr("class", "text")
        .text(`${d.count}`)
        .attr("x", (d) => xScale(d.date) + 5)
        .attr("y", (d) => yScale(d.count) - 10);
    })
    .on("mouseout", function (d) {
      d3Selection
        .select(this)
        .style("cursor", "none")
        .transition()
        .duration(duration)
        .selectAll(".text")
        .remove();
    })
    .append("circle")
    .attr("cx", (d) => xScale(d.date))
    .attr("cy", (d) => yScale(d.count))
    .attr("r", circleRadius)
    .style("opacity", circleOpacity)
    .on("mouseover", function (d) {
      d3Selection
        .select(this)
        .transition()
        .duration(duration)
        .attr("r", circleRadiusHover);
    })
    .on("mouseout", function (d) {
      d3Selection
        .select(this)
        .transition()
        .duration(duration)
        .attr("r", circleRadius);
    });

  /* Add Axis into SVG */
  var xAxis = d3.axisBottom(xScale).ticks(5);
  var yAxis = d3.axisLeft(yScale).ticks(5);

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height - margin})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "y-axis")
    .call(yAxis)
    .append("text")
    .attr("y", 15)
    .attr("transform", "rotate(-90)");

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width / 2)
    .attr("y", height - 25)
    .text("Time")
    .style("fill", "#fff");

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -35)
    .attr("x", -height / 3.5)
    .text("Number of Movies/TV Shows added")
    .style("fill", "#fff");
}

const Evolution = (props) => {
  let { data } = props;
  const [value, setValue] = React.useState([2008, 2021]);
  const d3MultiLineChart = useRef();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    let dataset = TreatData(data);
    // remove from dataset all the years that are not in the range
    for (let i = 0; i < dataset.length; i++) {
      for (let j = 0; j < dataset[i].values.length; j++) {
          if (newValue[0] > dataset[i].values[j].date || dataset[i].values[j].date > newValue[1]) {
          dataset[i].values.splice(j, 1);
          j--;
        }
      }
    }
    createGraph(dataset, d3MultiLineChart);
  };

  useEffect(() => {
    let dataset = TreatData(data);
    createGraph(dataset, d3MultiLineChart);
  }, [data]);

  return (
    <>
      <h1>Netflix's content evolution over the years</h1>
      <div className="descriptionChart">
        <p>
          In this line chart you can see the number of movies and tv shows added
          on Netflix per year. You can select the time range you want to
          analyze.
        </p>
      </div>
      <div className="boxSlider">
        <Box sx={{ width: 300 }}>
          <Slider
            min={2008}
            max={2021}
            value={value}
            onChange={handleChange}
            valueLabelDisplay="auto"
          />
        </Box>
      </div>
      <div className="evolution-chart">
        <svg ref={d3MultiLineChart}></svg>
      </div>
    </>
  );
};

export default Evolution;
