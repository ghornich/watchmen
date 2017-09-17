#!/usr/bin/env node
// var watchmen=require('./watchmen')
// var argv=require('minimist')(process.argv.slice(2))

// // TODO help, -h --help /h /help ? /?

// var paths,cmd

// cmd=argv._[0]
// paths=argv._.slice(1)

// if (paths.length===0){paths=['./']}

// if (!cmd){console.log('Error: cmd is missing');return}

// watchmen(paths, cmd)

const Watchmen=require('./watchmen')
const conf = require('./watchmen.conf.js')

const w = new Watchmen(conf)
w.start()

