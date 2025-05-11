
const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;

// Path for config.json
const configPath = path.join(__dirname, "config.json");

// Ensure config.json exists with default settings
if (!fs.existsSync(configPath)) {
  const defaultConfig = {
    mainPage: path.join(__dirname, "mainpage.html"),
  };
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
}

// Load config.json
let config;
try {
  config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
} catch (error) {
  console.error("Error reading config.json:", error);
  app.quit();
}

// ✅ Set app name
app.setName("MyApp");

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (mainWindow === null) {
      createMainWindow();
    }
  });
});

function createMainWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true,
      webSecurity: false, // ✅ Allow access to external storage
    },
  });

  const mainPagePath = `file://${config.mainPage}`;
  console.log("Loading page:", mainPagePath);

  // ✅ Handle loading errors
  mainWindow.loadURL(mainPagePath).catch((err) => {
    console.error("Error loading mainPage:", err);
    mainWindow.loadURL(`file://${config.mainPage}`); // Redirect to main page
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
