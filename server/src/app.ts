import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as methodOverride from "method-override";
import * as path from "path";
import * as morgan from "morgan";

var fs = require("fs");
var debug = require("debug")("ax-server:express");
var favicon = require("serve-favicon");

var accessLogStream = fs.createWriteStream(path.join(__dirname, "../logs/access.log"), {flags: "a"});

import { RootRoute } from "./routes/index";
import { ApiRoute } from "./routes/api/index";
import { CellsRoute } from "./routes/api/cells";
import { NeuronsRoute } from "./routes/api/neurons";
import { ItemsRoute } from "./routes/api/items";
import { AuthRoute } from "./routes/auth/index";

export class App {
	constructor(private app: express.Express, private cfg: any) {
        try {
            this.configSetup(app);
            this.configMiddle(app);
            this.configRoutes(app);
            this.errorHandling(app);
        } catch (error) {
            throw error;
        }
    }

    private configSetup(app: express.Express) {
        for (let dir of ["storage", this.cfg.storage.avatar, this.cfg.storage.picture]) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        }

        app.disable("x-powered-by");

        app.set("views", path.join(__dirname, "../views"));
        app.set("view engine", "pug");

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cookieParser());

        //add static paths
        app.use(express.static(path.join(__dirname, "../storage")));
        //app.use(express.static(path.join(__dirname, "../../client/dist")));
    }

    private configMiddle(app: express.Express) {
        app.use(cors());

        app.use(methodOverride("X-HTTP-Method"));
        app.use(methodOverride("X-HTTP-Method-Override"));
        app.use(methodOverride("X-Method-Override"));
        app.use(methodOverride("_method"));

    	app.use(favicon(path.join(__dirname, "../public/favicon.ico")));

        app.use(morgan("dev"));
        app.use(morgan("combined", {stream: accessLogStream}));
    }

    private configRoutes(app: express.Express) {
    	app.use("/api/cells", CellsRoute);
        app.use("/api/neurons", NeuronsRoute);
        app.use("/api/items", ItemsRoute);
        app.use("/api", ApiRoute);
        app.use("/auth", AuthRoute);
        app.use("/", RootRoute);
    }

    private errorHandling(app: express.Express) {
    	if (app.get("env") === "development") {
    		app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    			res.status(err.status || 500);
    			res.json({
    				error: err,
    				message: err.message
    			});
    		});
    	} else {
    		app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    			res.status(err.status || 500);
    			res.json({
    				error: {},
    				message: err.message
    			});
    		});
    	}

    	app.use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
    		if ((app.get("env") === "development") && req.url.startsWith("/browser-sync/")) {
                next();
                return;
            }
            let err = new Error("Not Found");
            next(err);
        });
    }

    public run() {
    	this.app.listen(this.cfg.port.node, () => {
    		debug(`App is running at localhost:${this.cfg.port.node}`);
    	});
    }
}