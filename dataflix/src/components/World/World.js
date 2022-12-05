import React, { useEffect, useRef, useState } from "react";
import "./World.css";
import * as d3 from "d3";
import * as d3Selection from "d3-selection";

const World = (props) => {
  const d3Map = useRef();

  const { data } = props;
  
  useEffect(() => {

    const svg = d3.select(d3Map.current),
      width = 800 * (14 / 9),
      height = 750,
      path = d3.geoPath(),
      map = d3.map(),
      worldmap =
        "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
      worldpopulation =
        "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv";

    svg.attr("width", width).attr("height", height);

    let world;

    // style of geographic projection and scaling
    const projection = d3.geoMercator().translate([width / 2, height / 2]);

    // Define color scale
    const colorScale = d3
      .scaleThreshold()
      .domain([25, 43, 118, 233, 446, 1047])
      .range([
        "#fee5d9",
        "#fcbba1",
        "#fc9272",
        "#fb6a4a",
        "#ef3b2c",
        "#cb181d",
        "#99000d",
      ]);

    // Load external data and boot
    let dict = {};
    for (let i = 0; i < data.length; i++) {
      let countries = data[i].country.split(",");
      for (let j = 0; j < countries.length; j++) {
        let country = countries[j].trim();
        if ("" !== country) {
          if (country in dict) {
            dict[country]++;
          } else {
            dict[country] = 1;
          }
        }
      }
    }

    d3.queue()
      .defer(d3.json, worldmap)
      .defer(d3.csv, worldpopulation, function (d) {
        if (d.name in dict) {
          map.set(d.code, dict[d.name]);
        }
      })
      .await(ready);

    // add tooltip
    const tooltip = d3Selection
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    svg
      .append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);

    function ready(error, topo) {
      let mouseOver = function (d) {
        d3Selection
          .selectAll(".Country")
          .transition()
          .duration(200)
          .style("opacity", 0.5)
          .style("stroke", "transparent");
        d3Selection
          .select(this)
          .transition()
          .duration(200)
          .style("opacity", 1)
          .style("stroke", "black");
        tooltip
          .style("left", d3.event.pageX + 15 + "px")
          .style("top", d3.event.pageY - 28 + "px")
          .transition()
          .duration(400)
          .style("opacity", 1)
          .style("color", "black")
          .text(d.properties.name + ": " + d.total);
      };

      let mouseLeave = function () {
        d3Selection
          .selectAll(".Country")
          .transition()
          .duration(200)
          .style("opacity", 1)
          .style("stroke", "transparent");
        tooltip.transition().duration(300).style("opacity", 0);
      };

      // Draw the map
      world = svg.append("g").attr("class", "world");
      world
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath().projection(projection))

        //retrieve the name of the country from data
        .attr("data-name", function (d) {
          return d.properties.name;
        })

        // set the color of each country
        .attr("fill", function (d) {
          d.total = map.get(d.id) || 0;
          return colorScale(d.total);
        })

        // add a class, styling and mouseover/mouseleave and click functions
        .style("stroke", "transparent")
        .attr("class", function (d) {
          return "Country";
        })
        .attr("id", function (d) {
          return d.id;
        })
        .style("opacity", 1)
        .on("mouseover", mouseOver)
        .on("mouseleave", mouseLeave);

      // Legend
      const x = d3.scaleLinear().domain([2.6, 75.1]).rangeRound([600, 860]);

      const legend = svg.append("g").attr("id", "legend");

      const legend_entry = legend
        .selectAll("g.legend")
        .data(
          colorScale.range().map(function (d) {
            d = colorScale.invertExtent(d);
            if (d[0] == null) d[0] = x.domain()[0];
            if (d[1] == null) d[1] = x.domain()[1];
            return d;
          })
        )
        .enter()
        .append("g")
        .attr("class", "legend_entry");

      const ls_w = 20,
        ls_h = 20;

      legend_entry
        .append("rect")
        .attr("x", 20)
        .attr("y", function (d, i) {
          return height - i * ls_h - 2 * ls_h;
        })
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function (d) {
          return colorScale(d[0]);
        })
        .style("opacity", 0.8);

      legend_entry
        .append("text")
        .attr("x", 50)
        .attr("y", function (d, i) {
          return height - i * ls_h - ls_h - 6;
        })
        .text(function (d, i) {
          console.log(d);
          if (i === 0) return "< " + d[1];
          if (d[1] < d[0]) return d[0] + " +";
          return d[0] + " - " + d[1];
        });

      legend
        .append("text")
        .attr("x", 15)
        .attr("y", 580)
        .text("Number of Movies/TV Shows");
    }
  }, [data]);

  return (
    <>
      <h1>Number of Movies and TV Shows by Country</h1>
      <div
        class="map"
        style={{
          backgroundColor: "rgb(34 34 34)",
          boxShadow: "0px 0px 0px #000000",
        }}
      >
        <svg ref={d3Map}></svg>
      </div>
    </>
  );
};

export default World;
