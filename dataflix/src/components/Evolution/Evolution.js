import React, { useEffect, useRef, useState } from 'react';
import "./Evolution.css";
import * as d3 from 'd3';

const Evolution = (props) => {
  
  const [data, setData] = useState(props.data);
  let dataset = [];
  //console.log(props.data);
  useEffect(() => {
    setData(props.data);
    //dataset = TreatData(data)
    //console.log("useEffect", dataset);
  }, [props.data]);

  function TreatData(values) {
    let added_content_dates = {}
    for (let i = 0; i < values.length; i++) {
      let date_added = values[i].date_added;
      if (date_added !== "") {
        let date_added_list = date_added.trim().split(" ");
        date_added_list.splice(1, 1) // remove the day since we don't need it, the array will be [month, year]
        let date_added_string = date_added_list[0] + " " + date_added_list[1]; // construct the date string "month year"
        if (date_added_string in added_content_dates) { // if "month year" is already a key 
          added_content_dates[date_added_string] += 1; // increment the value
        }
        else { // if not, start the counter
          added_content_dates[date_added_string] = 1;
        }
      }
    }
    let dataset = []
    for (let key in added_content_dates) {
      dataset.push({date: key, count: added_content_dates[key]})
    }
    
    // Sort the dataset by date
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
  }

  dataset = TreatData(data)
  console.log("dataset", dataset);
  /* dataset = [
    {date: "01/01/2016", pizzas: 10000},
    {date: "01/02/2016", pizzas: 20000},
    {date: "01/03/2016", pizzas: 40000},
    {date: "01/04/2016", pizzas: 30000},
    {date: "01/05/2016", pizzas: 30000},
    {date: "01/06/2016", pizzas: 50000},
    {date: "01/07/2016", pizzas: 30000},
    {date: "01/08/2016", pizzas: 50000},
    {date: "01/09/2016", pizzas: 60000},
    {date: "01/10/2016", pizzas: 20000},
    {date: "01/11/2016", pizzas: 10000},
    {date: "01/12/2016", pizzas: 90000},
  ]; */

  const d3LineChart = useRef();

  let margin = {top: 40, right: 40, bottom: 40, left: 60},
  width = 1000 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

  //let parseTime = d3.timeParse("%d/%m/%Y");
  let parseTime = d3.timeParse("%B %Y");
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

  var svg = d3.select(d3LineChart.current)
    .style("background-color", '#888')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  x.domain(d3.extent(dataset, function(d) { return parseTime(d.date); }));
  y.domain(d3.extent(dataset, function(d) { return d.count; }));

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
            .text("Pizzas ( Thousands ) ");

  svg.append("text")
            .style("font-size", "14px")
            .attr("text-anchor", "middle") 
            .attr("transform", "translate("+ (width/2) +","+(height-(margin.bottom -74))+")")
            .text("Date");

  /* //  Chart Title
  svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 20 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Pizza consumption"); */

  // Data Lines:

  svg.append("path")
      .datum(dataset)
    .attr("class", "line")
    .attr("d", line);



  return (
    <>
      <h1>
          Netflix's content evolution over the years
      </h1>
      <div className='evolution-chart'>
        <svg ref={d3LineChart}></svg>
      </div>
    </>
  );
}
  
  export default Evolution;