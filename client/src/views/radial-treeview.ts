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

	private startPos: {x:number, y:number} = {x:0,y:0};
	private curPos: {x:number, y:number} = {x:0,y:0};
	private curZoom:number = 1.0;
	
	constructor(private containerId:string) {}

	public init() {
		$(this.containerId).height(window.innerHeight - $(".navbar").height() - 100);
		window.onresize = () => {
			$(this.containerId).height(window.innerHeight - $(".navbar").height() - 100);
		}

		this.svg = this.createSvg(this.containerId);

		d3.select(document)
			.on('wheel', () => this.wheel());
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
		.id(function(d:Node) { return d.id; })
		.parentId(function(d:Node) { return d.parent; })
		(this.tree);

		cdata.each(function(d) {
			d.name = d.data.name;
		});

		let treemap = d3.tree()
		.size([360,500])
		.separation((a, b) => {
			if (a.depth === 0)
				return 1;
			return ((a.parent == b.parent ? 1 : 2 ) / a.depth);
		});

		let nodes = treemap(d3.hierarchy(cdata, (d) => d.children));

		this.updateNodes(nodes);
	}

	private createSvg(containerId:string) {
		let svg = d3.select(containerId)
		.append("svg")
		.attr("width", "100%")
		.attr("height", "100%")
		.on("mousedown", () => this.mousedown())
		.append("g");

		let defs = svg.append("defs");

		let defGradient = defs.append("radialGradient")
			.attr("id", "gradient")
			.attr("cx", 0.5).attr("cy", 0.5)
			.attr("r", 0.5)
			.attr("fx", 0.25).attr("fy", 0.25);
		
		defGradient.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", "red");
		defGradient.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", "blue");

		let defGradient2 = defs.append("radialGradient")
			.attr("id", "gradient2")
			.attr("cx", 0.5).attr("cy", 0.5)
			.attr("r", 0.5)
			.attr("fx", 0.25).attr("fy", 0.25);
		
		defGradient2.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", "green");
		defGradient2.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", "blue");

		this.curPos.x = $(containerId).width() / 2;
		this.curPos.y = $(containerId).height() / 2;

		svg.attr("transform", "translate(" + this.curPos.x + "," + this.curPos.y + ")"); 
		return svg;
	}

	private mousedown() {
		d3.event.preventDefault();
		if (d3.event.which !== 1 || d3.event.ctrlKey) { 
			return; 
		}
    	
    	this.startPos.x = this.curPos.x - d3.event.clientX;
    	this.startPos.y = this.curPos.y - d3.event.clientY;
    	log.info(this.startPos);
    	log.info(this.curPos);
    	d3.select(document).on('mousemove', () => this.mousemove(), true);
    	d3.select(document).on('mouseup', () => this.mouseup(), true);
	}

	private mousemove() {
		d3.event.preventDefault();
		this.curPos.x = this.startPos.x + d3.event.clientX;
		this.curPos.y = this.startPos.y + d3.event.clientY;
		this.setView();
	}

	private mouseup() {
		d3.select(document).on('mousemove', null);
		d3.select(document).on('mouseup', null);
	}

	private wheel() {
		let dz, newZ;
		if (d3.event.wheelDeltaY !== 0) {  // up-down
      	dz = Math.pow(1.2, d3.event.wheelDeltaY * 0.001 * 1);
      newZ = this.limitZ(this.curZoom * dz);
      dz = newZ / this.curZoom;
      this.curZoom = newZ;

      this.curPos.x -= (d3.event.clientX - this.curPos.x) * (dz - 1);
      this.curPos.y -= (d3.event.clientY - this.curPos.y) * (dz - 1);
      this.setView();
    }
	}

	private setView() {
		this.svg.attr('transform', 'translate(' + this.curPos.x + ' ' + this.curPos.y + ')scale(' + this.curZoom + ')');
	}

	private limitZ(z) {
    return Math.max(Math.min(z, 3), 0.1);
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
		.attr("r", 50);

		node.append("text")
		.attr("dy", ".31em")
		.attr("x", (d) => (d.x < 180 === !d.children ? 6 : -6))
		.style("text-anchor", "middle")
		//.style("text-anchor", (d) => (d.x < 180 === !d.children ? "start" : "end"))
		//.attr("transform", function(d) { return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")"; })
		.text((d) => d.data.name);

		function project(x, y) {
			var angle = (x - 90) / 180 * Math.PI, radius = y;
			return [radius * Math.cos(angle), radius * Math.sin(angle)];
		}
	}
}
