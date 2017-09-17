const fs=require('fs')
const exec=require('child_process').exec
const pathlib=require('path')

// TODO
// add ignore regex capability
// multiple paths (glob?)
// convert to class
// optionally run command when starting watch

const CHANGE_THROTTLE_MS=500

class Watchmen {
    /**
     * @param {Array<Object>} conf
     * @param {Array<String>} conf[].name - name of watch script
     * @param {Array<String>} conf[].paths - paths to watch
     * @param {String} conf[].command - command to run if files in paths change
     */
    constructor(conf){
        this._conf=conf
        this._watchers=[]

        for (const cnf of this._conf) {
            cnf._lastChangeTime=0
            cnf._running=false
        }

        // TODO assert conf
    }

    start(){
        console.log('-- Watchmen --')
        console.log('')


        for (const [confIndex, cnf] of this._conf.entries()) {
            for (const path of cnf.paths) {
                const absPath=pathlib.resolve(path)
                const onchangeFn=this._onChange.bind(this, confIndex)

                const w = fs.watch(absPath, { recursive: true }, onchangeFn)
                
                onchangeFn()

                this._watchers.push(w)
            }
        }
    }

    stop(){
        for (const w of this._watchers){
            w.close()
        }
    }

    _onChange(confIndex) {
        let prevent=false
        const cnf = this._conf[confIndex]

        const time=Date.now()

        if (time - cnf._lastChangeTime < CHANGE_THROTTLE_MS) {
            prevent=true
        }

        cnf._lastChangeTime=time

        if (prevent || cnf._running) {
            return
        }

        cnf._running=true

        console.log(`[Watchmen] [${date()}] executing command ${cnf.name}`)
        
        exec(cnf.command, function(err,sout,serr){
            if (err){
                console.log(err)
                console.log(`[Watchmen] [${date()}] ERROR (command: ${cnf.name})`)
            }
            else {
                console.log(`[Watchmen] [${date()}] SUCCESS (command: ${cnf.name})`)
            }

            cnf._running = false
        })
    }

}

exports=module.exports=Watchmen

function date(){
    return (new Date()).toLocaleString()
}
