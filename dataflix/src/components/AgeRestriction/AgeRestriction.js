import "./AgeRestriction.css";
import * as d3 from "d3";
import * as d3Selection from "d3-selection";
import { useRef, useState } from "react";
import Select from 'react-select';

function AgeRestriction(props) {
  const colourOptions = [
    { value: 'movies', label: 'Movies'},
    { value: 'tvShows', label: 'Tv Shows'},
    ];

  console.log("Data");
  console.log(props.data);
  const [values, setValues] = useState(props.data);

  var data1 = [];
  var data2 = [];
  var ages_restrictions = [];

  for (let i = 0; i < values.length; i++) {
    let age_rating = values[i].age_rating;
    if (age_rating !== "" && !age_rating.includes("min")) {
      if (ages_restrictions.includes(age_rating)) {
        data1.find((x) => x.group === age_rating).value++;
        if (values[i].type === "Movie") {
          if (data2.find((x) => x.group === age_rating)) {
            data2.find((x) => x.group === age_rating).value++;
          } else {
            data2.push({ group: age_rating, value: 1 });
          }
        }
      } else {
        ages_restrictions.push(age_rating);
        data1.push({ group: age_rating, value: 1 });
        if (values[i].type === "Movie") {
          data2.push({ group: age_rating, value: 1 });
        }
      }
    }
  }

  console.log(data1);
  console.log(data2);

  const d3BarChart = useRef();
  const d3G = useRef();
  const d3G2 = useRef();
  const d3G3 = useRef();

  // set the dimensions and margins of the graph
  var margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = (460 - margin.left - margin.right) * (5/2),
    height = (400 - margin.top - margin.bottom) * (5/2);

  // append the svg object to the body of the page
  var svg = d3Selection
    .select(d3BarChart.current)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  var g1 = d3Selection
    .select(d3G.current)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X axis
  var x = d3
    .scaleBand()
    .range([0, width])
    .domain(ages_restrictions)
    .padding(0.2);
  var g2 = d3Selection
    .select(d3G2.current)
    .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear().domain([0, 3205]).range([height, 0]);
  var g3 = d3Selection
    .select(d3G3.current)
    .attr("class", "myYaxis")
      .call(d3.axisLeft(y));

  // A function that create / update the plot for a given variable:
  function update(data) {
    var u = g1.selectAll("rect").data(data);

    u.enter()
      .append("rect")
      .merge(u)
      .transition()
      .duration(1000)
      .style("fill", "#D81F26")
      .attr("x", function (d) {
        return x(d.group);
      })
      .attr("y", function (d) {
        return y(d.value);
      })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
        return height - y(d.value);
      })
      .attr("fill", "#69b3a2");
  }

  // Initialize the plot with the first dataset
  update(data1);

  return (
    <>
      <h1>Number of Movies and TV Shows by Age Group</h1>
      <Select
    defaultValue={colourOptions}
    isMulti
    options={colourOptions}
    className="basic-multi-select"
    classNamePrefix="select"
  />
      <button onClick={() => update(data1)}>Variable 1</button>
      <button onClick={() => update(data2)}>Variable 2</button>

      <div className="barChart" id="my_dataviz">
        <svg ref={d3BarChart}>
          <g ref={d3G}>
            <g ref={d3G2}></g>
            <g ref={d3G3}></g>
          </g>
        </svg>
      </div>
    </>
  );
}

export default AgeRestriction;