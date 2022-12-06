import "./AgeRestriction.css";
import * as d3 from "d3";
import * as d3Selection from "d3-selection";
import { useRef, useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

// A function that create / update the plot for a given variable:
const update = (data, g1, x, y, height, tooltip) => {
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

  g1.selectAll("rect")
    .on("mouseover", function (d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(d.value);
      d3Selection.select(this).style("fill", "#b71a20");
    }) // show tooltip
    .on("mousemove", function (d) {
      tooltip
        .style("top", d3Selection.event.pageY - 10 + "px")
        .style("left", d3Selection.event.pageX + 10 + "px");
    }) // move tooltip
    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
      d3Selection.select(this).style("fill", "#D81F26");
    }); // hide tooltip
};

const generateDataObjects = (data) => {
  var data_movies_shows = [];
  var data_movies = [];
  var data_shows = [];
  var ages_restrictions = [];

  for (let i = 0; i < data.length; i++) {
    let age_rating = data[i].age_rating;
    if (age_rating !== "" && !age_rating.includes("min")) {
      if (ages_restrictions.includes(age_rating)) {
        data_movies_shows.find((x) => x.group === age_rating).value++;
        if (data[i].type === "Movie") {
          if (data_movies.find((x) => x.group === age_rating)) {
            data_movies.find((x) => x.group === age_rating).value++;
          } else {
            data_movies.push({ group: age_rating, value: 1 });
          }
        } else {
          if (data_shows.find((x) => x.group === age_rating)) {
            data_shows.find((x) => x.group === age_rating).value++;
          } else {
            data_shows.push({ group: age_rating, value: 1 });
          }
        }
      } else {
        ages_restrictions.push(age_rating);
        data_movies_shows.push({ group: age_rating, value: 1 });
        if (data[i].type === "Movie") {
          data_movies.push({ group: age_rating, value: 1 });
        } else {
          data_shows.push({ group: age_rating, value: 1 });
        }
      }
    }
  }
  return {
    data_movies_shows,
    data_movies,
    data_shows,
    ages_restrictions,
  };
};

const generateElements = (d3BarChart, d3G, d3G2, d3G3, ages_restrictions) => {
  // set the dimensions and margins of the graph
  var margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = (460 - margin.left - margin.right) * (7 / 3),
    height = (400 - margin.top - margin.bottom) * (7 / 3);

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
  d3Selection
    .select(d3G2.current)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear().domain([0, 3205]).range([height, 0]);
  d3Selection
    .select(d3G3.current)
    .attr("class", "myYaxis")
    .call(d3.axisLeft(y));

  // xlabel and ylabel
  g1.append("text")
    .attr("text-anchor", "end")
    .attr("x", width / 2)
    .attr("y", height + margin.top + 20)
    .text("Age Restriction")
    .style("fill", "#fff");

  g1.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 15)
    .attr("x", -margin.top - height / 2 + 150)
    .text("Number of Movies/TV Shows")
    .style("fill", "#fff");

  // create tooltip element
  const tooltip = d3Selection
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("z-index", "10")
    .style("padding", "15px")
    .style("background", "rgba(0,0,0,0.6)")
    .style("border-radius", "5px")
    .style("color", "#fff");

  return {
    tooltip,
    svg,
    g1,
    x,
    y,
    height,
    width,
  };
};

function AgeRestriction(props) {
  const { data } = props;
  const views_options = [
    { value: "movies", label: "Movies" },
    { value: "tvShows", label: "Tv Shows" },
  ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "black" : "black",
    }),
  };

  const d3BarChart = useRef();
  const d3G = useRef();
  const d3G2 = useRef();
  const d3G3 = useRef();

  let tooltip, svg, g1, x, y, height, width;
  let data_movies_shows, data_movies, data_shows, ages_restrictions;

  const updateMethod = (data) => {
    update(data, g1, x, y, height, tooltip);
  };

  useEffect(() => {
    if (!data) return;
    ({ data_movies_shows, data_movies, data_shows, ages_restrictions } =
      generateDataObjects(data));
    ({ tooltip, svg, g1, x, y, height, width } = generateElements(
      d3BarChart,
      d3G,
      d3G2,
      d3G3,
      ages_restrictions
    ));

    // Initialize the plot with the first dataset
    updateMethod(data_movies_shows);
  }, data);

  return (
    <>
      <h1>Number of Movies and TV Shows by Age Group</h1>
      <div className="descriptionChart">
        <p>
          In this bar chart the different age restriction groups are ranked by
          their number of contents on Netflix. It is possible to filter by
          Movies, TV Shows or both at the same time.
        </p>
      </div>
      <Select
        defaultValue={views_options}
        styles={customStyles}
        components={animatedComponents}
        closeMenuOnSelect={false}
        isMulti
        options={views_options}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={(e) => {
          if (e.length === 1) {
            if (e[0].value === "movies") {
              updateMethod(data_movies);
            } else {
              updateMethod(data_shows);
            }
          } else {
            updateMethod(data_movies_shows);
          }
        }}
      />

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
