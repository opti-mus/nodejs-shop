const cluster = require('cluster');
const os = require('os');
const pid = process.pid;

if(cluster.isMaster) {
  const cpusCount = os.cpus().length;
  console.log(`cpu: ${cpusCount}`);
  console.log(`pid ${pid}`)
  for(let i =0; i< cpusCount; i++) {
    const worker = cluster.fork();
    worker.on('exit', () => {
      cluster.fork();
    }) 
  }
  
}

if(cluster.isWorker) {
  require('./app.js');
}