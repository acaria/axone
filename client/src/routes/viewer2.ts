import * as d3 from "d3";
import {log} from '../logger';

export default class {
    private flatdata;
    private data;

    private treemap;

    private svg;
    private root;

    private margin = {top: 20, right: 120, bottom: 20, left: 120};
    private width = 960 - this.margin.right - this.margin.left;
    private height = 500 - this.margin.top - this.margin.bottom;

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

        this.treemap = d3.tree().size([this.height,this.width]);

        this.root = d3.hierarchy(this.data, function(d) { return d.children; });
        this.root.x0 = this.height / 2;
        this.root.y0 = 0;

        this.root.children.forEach(collapse);

        function collapse(d) {
            if(d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }
    }

    attached() {
        $("#canvas").height(window.innerHeight - $(".navbar").height() - 100);

        this.svg = d3.select("#canvas")
        .append("svg")
        .style("background-color", "yellow")
        .attr("width", this.width + this.margin.right + this.margin.left)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");    

        window.onresize = function() {
            $("#canvas").height(window.innerHeight - $(".navbar").height() - 100);
        }

        this.update(this.root);
    }

    update(source) {
        var myThis = this;
        // Assigns the x and y position for the nodes
        var treedata = this.treemap(this.root);

        // Compute the new tree layout.
        var nodes = treedata.descendants(),
        links = treedata.descendants().slice(1);

        // Normalize for fixed-depth.
        nodes.forEach(function(d){ d.y = d.depth * 180});

        // ****************** Nodes section ***************************

        // Update the nodes...
        var node = this.svg.selectAll('g.node')
        .data(nodes, function(d) {return d.id || (d.id = ++myThis.i); });

        // Enter any new modes at the parent's previous position.
        var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on('click', click);

        // Add Circle for the nodes
        nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 1e-6)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        });

        // Add labels for the nodes
        nodeEnter.append('text')
        .attr("dy", ".35em")
        .attr("x", function(d) {
            return d.children || d._children ? -13 : 13;
        })
        .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
        })
        .text(function(d) { return d.data.name; });

        // UPDATE
        var nodeUpdate = nodeEnter.merge(node);

        // Transition to the proper position for the node
        nodeUpdate.transition()
        .duration(this.duration)
        .attr("transform", function(d) { 
            return "translate(" + d.y + "," + d.x + ")";
        });

        // Update the node attributes and style
        nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        })
        .attr('cursor', 'pointer');


        // Remove any exiting nodes
        var nodeExit = node.exit().transition()
        .duration(this.duration)
        .attr("transform", function(d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

        // On exit reduce the node circles size to 0
        nodeExit.select('circle')
        .attr('r', 1e-6);

        // On exit reduce the opacity of text labels
        nodeExit.select('text')
        .style('fill-opacity', 1e-6);

        // ****************** links section ***************************

        // Update the links...
        var link = this.svg.selectAll('path.link')
        .data(links, function(d) { return d.id; });

        // Enter any new links at the parent's previous position.
        var linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr('d', function(d){
            var o = {x: source.x0, y: source.y0}
            return diagonal(o, o)
        });

        // UPDATE
        var linkUpdate = linkEnter.merge(link);

        // Transition back to the parent element position
        linkUpdate.transition()
        .duration(this.duration)
        .attr('d', function(d){ return diagonal(d, d.parent) });

        // Remove any exiting links
        var linkExit = link.exit().transition()
        .duration(this.duration)
        .attr('d', function(d) {
            var o = {x: source.x, y: source.y}
            return diagonal(o, o)
        })
        .remove();

        // Store the old positions for transition.
        nodes.forEach(function(d){
            d.x0 = d.x;
            d.y0 = d.y;
        });

        // Creates a curved (diagonal) path from parent to the child nodes
        function diagonal(s, d) {

            return `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
            ${(s.y + d.y) / 2} ${d.x},
            ${d.y} ${d.x}`;
        }

        // Toggle children on click.
        function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            myThis.update(d);
        }
    }
}