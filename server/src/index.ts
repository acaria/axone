#!/usr/bin/env node
"use strict";

import cfg from "./config";

//module dependencies.
var express = require("express");
import { AxApi } from "./app";

var port = parseInt(process.env.PORT, 10) || cfg.PORT;

new AxApi(express(), port).run();