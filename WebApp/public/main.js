// Application entry-point (main) for CLI
console.log('[MAIN]', process.cwd(), process.argv.slice(2));

// Used for Electron, which spawns a window.
require('./electron');
