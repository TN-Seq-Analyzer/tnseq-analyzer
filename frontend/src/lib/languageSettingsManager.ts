import { app } from "electron";
import fs from "fs";
import path from "node:path";
import { Settings } from "../types/index";

const getSettingsPath = (): string => {
  const userDataPath = app.getPath("userData");
  return path.join(userDataPath, "settings.json");
};

const getDefaultSettings = (): Settings => ({
  language: "en",
});

export const loadSettings = (): Settings => {
  try {
    const settingsPath = getSettingsPath();
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading settings:", error);
  }
  return getDefaultSettings();
};

export const saveSettings = (settings: Settings): void => {
  try {
    const settingsPath = getSettingsPath();
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
};

export const getLanguage = (): string => {
  const settings = loadSettings();
  return settings.language || "en";
};

export const setLanguage = (language: string): string => {
  const settings = loadSettings();
  settings.language = language;
  saveSettings(settings);
  return language;
};
