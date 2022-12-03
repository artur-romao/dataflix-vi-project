import React, { useEffect, useRef, useState } from 'react';
import "./Evolution.css";
import * as d3 from 'd3';

const Evolution = (props) => {
  
  const [data, setData] = useState(props.data);
  const d3LineChart = useRef();
  //let dataset = [];
  //console.log(props.data);
  useEffect(() => {
    setData(props.data);
    /* let dataset = [];
    let movies_dataset = []
    let tv_shows_dataset = [] */
    let [dataset, movies_dataset, tv_shows_dataset] = TreatData(data);
    

    let margin = {top: 40, right: 40, bottom: 40, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    //let parseTime = d3.timeParse("%B %Y");
    let parseTime = d3.timeParse("%Y");
    let formatTime = d3.timeFormat("%a/%b/%Y");
    //let formatTime = d3.timeFormat("%B %Y");

    let x = d3.scaleTime()
    .range([0, width]);

    let y = d3.scaleLinear()
    .range([height, 0]);

    // Line
    let line = d3.line()
    .x(function(d) { return x(parseTime(d.date)); })
    .y(function(d) { return y(d.count); })

    // Line
    let line2 = d3.line()
    .x(function(d) { return x(parseTime(d.date)); })
    .y(function(d) { return y(d.count); })

    // Line
    let line3 = d3.line()
    .x(function(d) { return x(parseTime(d.date)); })
    .y(function(d) { return y(d.count); })

    var svg = d3.select(d3LineChart.current)
      .style("background-color", '#888')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    x.domain(d3.extent(dataset, function(d) { return parseTime(d.date); }));
    y.domain(d3.extent(movies_dataset, function(d) { return d.count; }));

    // Axes
    svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    svg.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y));  

    // Labels
    svg.append("text")
              .attr("text-anchor", "middle")
              .style("font-size", "14px")
              .attr("transform", "translate("+ (margin.left - 94 ) +","+(height/2)+")rotate(-90)")  
              .text("Number of items added");

    svg.append("text")
              .style("font-size", "14px")
              .attr("text-anchor", "middle") 
              .attr("transform", "translate("+ (width/2) +","+(height-(margin.bottom -74))+")")
              .text("Date");

    svg.append("circle").attr("cx",width-120).attr("cy",20).attr("r", 6).style("fill", "#ff0000")
    svg.append("circle").attr("cx",width-120).attr("cy",40).attr("r", 6).style("fill", "#0000ff")
    svg.append("text").attr("x", width-100).attr("y", 20).text("Movies").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", width-100).attr("y", 40).text("TV Shows").style("font-size", "15px").attr("alignment-baseline","middle")


    /* //  Chart Title
    svg.append("text")
          .attr("x", (width / 2))             
          .attr("y", 20 - (margin.top / 2))
          .attr("text-anchor", "middle")  
          .style("font-size", "16px") 
          .text("Pizza consumption"); */

    // Data Lines:

    svg.append("path")
        .datum(movies_dataset)
        .attr("class", "line")
        .attr("d", line)
      
    svg.append("path")  
        .datum(tv_shows_dataset)
        .attr("class", "line2")
        .attr("d", line2);
    
    /* svg.append("path")
        .datum(dataset)
      .attr("class", "line3")
      .attr("d", line3) */
  }, [props.data]);

  function TreatData(values) {
    let added_content_dates = {}
    let added_movies = {}
    let added_tv_shows = {}
    for (let i = 0; i < values.length; i++) {
      let date_added = values[i].date_added;
      let content_type = values[i].type;
      if (date_added !== "") {
        let date_added_list = date_added.trim().split(" ");
        date_added_list.splice(1, 1) // remove the day since we don't need it, the array will be [month, year]
        // let date_added_string = date_added_list[0] + " " + date_added_list[1]; // construct the date string "month year"
        let year_added = date_added_list[1];
        if (year_added in added_content_dates) { // if "month year" is already a key 
          added_content_dates[year_added] += 1; // increment the value
        }
        else { // if not, start the counter
          added_content_dates[year_added] = 1;
        }
        if (content_type === "Movie") {
          if (year_added in added_movies) { // if "month year" is already a key 
            added_movies[year_added] += 1; // increment the value
          }
          else { // if not, start the counter
            added_movies[year_added] = 1;
          }
        }
        if (content_type === "TV Show") {
          if (year_added in added_tv_shows) { // if "month year" is already a key 
            added_tv_shows[year_added] += 1; // increment the value
          }
          else { // if not, start the counter
            added_tv_shows[year_added] = 1;
          }
        }
      }
    }
    let dataset = []
    let movies_dataset = []
    let tv_shows_dataset = []
    for (let key in added_content_dates) {
      dataset.push({date: key, count: added_content_dates[key]})
    }
    for (let key in added_movies) {
      movies_dataset.push({date: key, count: added_movies[key]})
    }
    for (let key in added_tv_shows) {
      tv_shows_dataset.push({date: key, count: added_tv_shows[key]})
    }
    
    // Sort the dataset by date
    /* dataset = SortDataset(dataset)
    movies_dataset = SortDataset(movies_dataset)
    tv_shows_dataset = SortDataset(tv_shows_dataset) */

    dataset = dataset.sort((a, b) => (a.date > b.date) ? 1 : -1)
    movies_dataset = movies_dataset.sort((a, b) => (a.date > b.date) ? 1 : -1)
    tv_shows_dataset = tv_shows_dataset.sort((a, b) => (a.date > b.date) ? 1 : -1)
    return [dataset, movies_dataset, tv_shows_dataset];
  }
  
  /* function SortDataset(dataset) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    dataset = dataset.sort((a, b) => {
      let a_date = a.date.split(" ");
      let b_date = b.date.split(" ");
      if (a_date[1] === b_date[1]) {
        return months.indexOf(a_date[0]) - months.indexOf(b_date[0]);
      }
      else {
        return a_date[1] - b_date[1];
      }
    })
    return dataset;
  } */

  return (
    <>
      <h1>
          Netflix's content evolution over the years
      </h1>
      <div class="dropdown">
        <button class="dropbtn">Country</button>
        <div class="dropdown-content">
          <p>Link 1</p>
          <p>Link 2</p>
          <p>Link 3</p>
        </div>
      </div>
      <div className='evolution-chart'>
        <svg ref={d3LineChart}></svg>
      </div>
    </>
  );
}
  
  export default Evolution;