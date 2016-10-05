#!/usr/bin/env node
"use strict";

//module dependencies.
var express = require("express");
import { AxApi } from "./app";
var debug = require("debug")("express:server");

//get port from environment and store in Express.
var port = normalizePort(process.env.PORT || 8080);

let axApi = new AxApi(express(), port);
axApi.run();

function normalizePort(val: any) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}