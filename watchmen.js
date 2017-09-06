var fs=require('fs')
var exec=require('child_process').exec
var pathlib=require('path')

// TODO
// add ignore regex capability
// multiple paths (glob?)
// convert to class
// optionally run command when starting watch

// TODO ignore same consecutive changes for file, with customizable throttle time

var prevChangePath=null
var prevChangeTime=0
var CHANGE_THROTTLE_MS=500

module.exports=function watchmen(paths, cmd){

    var running = false

    paths=paths||['./']

    console.log('-- Watchmen --')
    console.log('paths: called for path(s) "' + paths.join(', ') + '", command: "'+cmd+'"')

    var onChange = function(path, eventType, filename){
        // console.log('onChange called: ', path, eventType, filename)

        var prevent=false

        if (prevChangePath === path && Date.now() - prevChangeTime < CHANGE_THROTTLE_MS){
            prevent=true
        }

        prevChangePath=path
        prevChangeTime=Date.now()
        if(prevent){
            // console.log('same event detected for path "'+path+'" within timeout, returning')
            return
        }

        if (running) {
            // console.log('command is running, returning')
            return
        }

        running = true

        console.log('---------')
        console.log('---------')
        console.log('[Watchmen] executing command')

        exec(cmd, function(err,sout,serr){
            if (err){
                console.log(err)
                console.log(`[Watchmen] [${getReadableDate()}] ERROR`)
            }
            else {
                console.log(`[Watchmen] [${getReadableDate()}] SUCCESS`)
            }

            running = false
        })
    }

    paths.forEach(p=>{
        var absPath = pathlib.resolve(p)

        fs.watch(absPath, { recursive: true }, onChange.bind(null, p))
    })

}

function getReadableDate(){
    return (new Date()).toLocaleString()
}

// function debounce(func, wait, immediate) {
//     var timeout;
//     return function() {
//         var context = this, args = arguments;
//         var later = function() {
//             timeout = null;
//             if (!immediate) func.apply(context, args);
//         };
//         var callNow = immediate && !timeout;
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//         if (callNow) func.apply(context, args);
//     };
// }
