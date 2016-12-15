import * as d3 from "d3";
import {log} from '../logger';

export default class {
	constructor() {
		
	}

	attached() {
        $("#canvas").height(window.innerHeight - $(".navbar").height() - 100);

		var sampleSVG = d3.select("#canvas")
        .append("svg")
        .style("background-color", "blue")
        .attr("width", "100%")
        .attr("height", "100%");    

    sampleSVG.append("circle")
        .style("stroke", "gray")
        .style("fill", "white")
        .attr("r", 40)
        .attr("cx", 50)
        .attr("cy", 150)
        .on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
        .on("mouseout", function(){d3.select(this).style("fill", "white");});

        window.onresize = function() {
            $("#canvas").height(window.innerHeight - $(".navbar").height() - 100);
        }
	}
}