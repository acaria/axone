import * as d3 from "d3";
import {log} from '../logger';
import RadialTreeview from '../views/radial-treeview';

export default class {
    private treeView: RadialTreeview;
    
    constructor() {
        this.treeView = new RadialTreeview("#canvas");
    }

    attached() {
        this.treeView.init();
        this.treeView.setData([
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
            {"name": "Daughter of A", "parent": "Level 2: A"}
        ]);
    }
}