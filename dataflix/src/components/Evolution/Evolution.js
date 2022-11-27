import React, { useEffect, useRef, useState } from 'react';
import "./Evolution.css";
import * as d3 from 'd3';

const Evolution = (props) => {
  
  const [data, setData] = useState(props.data);
  console.log(props.data);
  useEffect(() => {
    setData(props.data);
    TreatData(data)
  }, [props.data]);

  const TreatData = (values) => {
    let dataset = {}
    for (let i = 0; i < values.length; i++) {
      let date_added = values[i].date_added;
      if (date_added !== "") {
        let date_added_list = date_added.trim().split(" ");
        date_added_list.splice(1, 1) // remove the day since we don't need it, the array will be [month, year]
        if (date_added_list[1] in dataset) { // if the year is already a key 
          if (date_added_list[0] in dataset[date_added_list[1]]) { // check if the month is already a key
            dataset[date_added_list[1]][date_added_list[0]] += 1; // if it is, increment the value
          }
          else {
            dataset[date_added_list[1]][date_added_list[0]] = 1; // if it isn't, create a new key-value pair
          }
        }
        else { // if not, add it
          dataset[date_added_list[1]] = {};
          dataset[date_added_list[1]][date_added_list[0]] = 1;
        }
      }
    }
  }

  /* var dataset = [
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
  ];

  let margin = {top: 40, right: 40, bottom: 40, left: 60},
  width = 700 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

  let parseTime = d3.timeParse("%d/%m/%Y");
  //let parseTime = d3.timeParse("%B/%d/%Y");
  let formatTime = d3.timeFormat("%a/%b/%Y");
  //let formatTime = d3.timeFormat("%B/%d/%Y");

  let x = d3.scaleTime()
  .range([0, width]);

  let y = d3.scaleLinear()
  .range([height, 0]);

  // Line
  let line = d3.line()
  .x(function(d) { return x(this.parseTime(d.date)); })
  .y(function(d) { return y(d.pizzas/1000); })

  var svg = d3.select("body").append("svg")
    .style("background-color", '#888')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  x.domain(d3.extent(dataset, function(d) { return parseTime(d.date); }));
  y.domain(d3.extent(dataset, function(d) { return d.pizzas/1000; }));

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

  //  Chart Title
  svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 20 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Pizza consumption");

  // Data Lines:

  svg.append("path")
      .datum(dataset)
    .attr("class", "line")
    .attr("d", line); */



  return (
    <div className='evolution-chart'>
      <h1>
        Netflix's content evolution over the years
      </h1>
      <div className='evolution-chart-chart'>

      </div>
    </div>
  );
}
  
  export default Evolution;