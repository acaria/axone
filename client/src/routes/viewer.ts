import * as d3 from "d3";
import {log} from '../logger';

export default class {
    private flatdata;
    private data;

    private treemap;

    private svg;
    private root;

    private width = 960;
    private height = 1000;

    private i = 0;
    private duration = 750;

    constructor() {
        this.flatdata = [
        {"name": "Top Level", "parent": null}, 
        {"name": "Level 2: A", "parent": "Top Level" },
        {"name": "Level 2: B", "parent": "Top Level" },
        {"name": "Level 3: A", "parent": "Level 2: A" },
        {"name": "Level 3: B", "parent": "Level 2: A" },
        {"name": "Level 3: C", "parent": "Level 2: A" },
        {"name": "Level 4: A", "parent": "Level 3: A" },
        {"name": "Level 4: B", "parent": "Level 3: A" },
        {"name": "Level 5: A", "parent": "Level 4: A" },
        {"name": "Level 6: A", "parent": "Level 5: A" },
        {"name": "Daughter of A", "parent": "Level 2: A" }
        ];
        this.data = d3.stratify()
        .id(function(d) { return d["name"]; })
        .parentId(function(d) { return d["parent"]; })
        (this.flatdata);

        this.data.each(function(d) {
            d.name = d.id;
        });

        this.treemap = d3.tree()
        .size([360,500])
        .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2 ) / a.depth; });

        this.root = this.treemap(d3.hierarchy(this.data, function(d) { return d.children; }));

        
    }

    attached() {
        $("#canvas").height(window.innerHeight - $(".navbar").height() - 100);

        this.svg = d3.select("#canvas")
        .append("svg")
        .style("background-color", "yellow")
        .attr("width", this.width)
        .attr("height", this.height)
        .append("g")
        .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");    

        window.onresize = function() {
            $("#canvas").height(window.innerHeight - $(".navbar").height() - 100);
        }

        this.update(this.root);
    }

    update(source) {
        var link = this.svg.selectAll(".link")
        .data(this.root.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", function(d) {
            return "M" + project(d.x, d.y)
            + "C" + project(d.x, (d.y + d.parent.y) / 2)
            + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
            + " " + project(d.parent.x, d.parent.y);
        });

        var node = this.svg.selectAll(".node")
        .data(this.root.descendants())
        .enter().append("g")
        .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d) { return "translate(" + project(d.x, d.y) + ")"; });

        node.append("circle")
        .attr("r", 2.5);

        node.append("text")
        .attr("dy", ".31em")
        .attr("x", function(d) { return d.x < 180 === !d.children ? 6 : -6; })
        .style("text-anchor", function(d) { return d.x < 180 === !d.children ? "start" : "end"; })
        .attr("transform", function(d) { return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")"; })
        .text(function(d) { return d.data.name; });

        function project(x, y) {
            var angle = (x - 90) / 180 * Math.PI, radius = y;
            return [radius * Math.cos(angle), radius * Math.sin(angle)];
        }
    }
}