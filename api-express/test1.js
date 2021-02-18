// eslint-disable-next-line no-console
console.log('This is an example script');

process.exitCode = 2;

// eslint-disable-next-line no-unused-vars
process.on('exit', (code) => {
  // eslint-disable-next-line no-console
  console.log('Process Exited');
});
