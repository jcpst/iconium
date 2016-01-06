#!/usr/bin/env node

var fs = require('fs')
var Docker = require('dockerode')
var yaml = require('js-yaml')

var services, steps

// TODO: STEPS
// x load yaml
// . run service based on yml config
// . call service by step
// . run each step
function dockerBuild() {}
function runStep(stepName) {}
function runService() {}

exports.loadYaml = function (file) {
  try {
    return yaml.safeLoad(fs.readFileSync(file, 'utf8'))
  } catch (e) {
    console.log('didnt work: ' + e)
    return ''
  }
}

exports.steps = function (serviceFile, stepsFile) {
  services = loadYaml(serviceFile)
  steps = loadYaml(stepsFile)
}

