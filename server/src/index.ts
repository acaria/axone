#!/usr/bin/env node
"use strict";

var cfg = require("../config.js");

//module dependencies.
var express = require("express");
import AxServer from "./app";

new AxServer(express(), cfg.port.node).run();