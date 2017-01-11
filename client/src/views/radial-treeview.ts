import * as d3 from "d3";
import {log} from '../logger';

export interface Node {
	id: string;
	parent: string | null;
	name: string;
}

export class RadialTreeview {
    private svg;
    private tree: Array<Node>;

    constructor(private containerId:string) {}

    public init() {
        $(this.containerId).height(window.innerHeight - $(".navbar").height() - 100);
        window.onresize = () => {
            $(this.containerId).height(window.innerHeight - $(".navbar").height() - 100);
        }

        this.svg = this.createSvg(this.containerId);
    }

    public setData(data:Array<Node>) {
        this.tree = data;
        this.refreshGraph();
    }

    public addElement(node:Node) {
        this.tree.push(node);
        this.refreshGraph();
    }

    private refreshGraph() {
        let cdata:any = d3.stratify()
        .id(function(d:Node) { return d.name; })
        .parentId(function(d:Node) { return d.parent; })
        (this.tree);

        cdata.each(function(d:Node) {
            d.name = d.id;
        });

        let treemap = d3.tree()
        .size([360,500])
        .separation((a, b) => ((a.parent == b.parent ? 1 : 2 ) / a.depth));

        let nodes = treemap(d3.hierarchy(cdata, (d) => d.children));

        this.updateNodes(nodes);
    }

    private createSvg(containerId:string) {
        let svg = d3.select(containerId)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g");

        svg.attr("transform", "translate(" + $(containerId).width() / 2 + "," + $(containerId).height() / 2 + ")"); 
        return svg;
    }

    private updateNodes(nodes) {
        var link = this.svg.selectAll(".link")
        .data(nodes.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", (d) => 
            "M" + project(d.x, d.y)
            + "C" + project(d.x, (d.y + d.parent.y) / 2)
            + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
            + " " + project(d.parent.x, d.parent.y)
        );

        var node = this.svg.selectAll(".node")
        .data(nodes.descendants())
        .enter().append("g")
        .attr("class", (d) => "node" + (d.children ? " node--internal" : " node--leaf"))
        .attr("transform", (d) => "translate(" + project(d.x, d.y) + ")");

        node.append("circle")
        .attr("r", 2.5);

        node.append("text")
        .attr("dy", ".31em")
        .attr("x", (d) => (d.x < 180 === !d.children ? 6 : -6))
        .style("text-anchor", (d) => (d.x < 180 === !d.children ? "start" : "end"))
        //.attr("transform", function(d) { return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")"; })
        .text((d) => d.data.name);

        function project(x, y) {
            var angle = (x - 90) / 180 * Math.PI, radius = y;
            return [radius * Math.cos(angle), radius * Math.sin(angle)];
        }
    }
}
