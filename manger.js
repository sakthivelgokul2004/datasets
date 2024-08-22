import { Worker } from "node:worker_threads"
import fs from 'fs'


var obj = JSON.parse(fs.readFileSync('./dataset.json', 'utf8'));
let arr = [];
for (let i = 0; i < obj.length; i++) {
    arr.push(obj[i])
}

run(arr)

function chuckfiy(array, n) {
    let chucks = []
    for (let i = n; i > 0; i--) {
        chucks.push(array.splice(Math.ceil(array.length / i)))
    }
    return chucks
}

function run(job) {
    let chucks = chuckfiy(job, 1)
    chucks.forEach((data, n) => {
        // console.log(data)
        const worker = new Worker("./index.js");
        worker.postMessage(job)
        worker.on('message', (str) => {
            console.log('downlond ' + str)
            worker.terminate()
        })
    })

}