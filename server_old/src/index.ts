#!/usr/bin/env node
"use strict";

import AxServer from "app";

var cfg = require("../config.js");
var express = require("express");

new AxServer(express(), cfg.port.node).run();