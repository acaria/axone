import {bindable, autoinject} from 'aurelia-framework';
import {Config as ApiConfig, Rest} from "aurelia-api";
import {log} from '../logger';
import {Item} from '../models/neuron-item';
import RadialTreeview from '../views/radial-treeview';

@autoinject()
export default class {
    private apiClient: Rest;
    private treeView: RadialTreeview;
    private items:Array<Item> = [];

    constructor(apiConfig: ApiConfig) {
        this.apiClient = apiConfig.getEndpoint("api");
        this.treeView = new RadialTreeview("#canvas");
    }

    attached() {
        this.treeView.init();

        this.asyncLoadItems()
        .then(() => {
            let y = 0;
        })
        .catch(err => {
            log.error(err);
        });

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

    private asyncLoadItems():Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.apiClient.find("items")
                .then(items => {
                    this.items = items;
                    resolve();
                })
                .catch(err => {
                    log.error(err);
                    reject(err);
                })
            } catch(err) {
                reject(err)
            }
        })
    }
}