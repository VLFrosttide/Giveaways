import fs from "fs";
import path from "path";
import {
  Client,
  Collection,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";
import { fileURLToPath } from "url";
import { RegisterButtonListener } from "./Button.js";

// Get directory paths for dynamic imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Discord Client
export const MyClient = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Command collection
MyClient.commands = new Collection();

// Load command files dynamically
const commandsPath = path.join(__dirname, "Commands");
const CommandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

// Import and load commands
for (let file of CommandFiles) {
  try {
    const command = await import(`./Commands/${file}`);
    if (!command.data || !command.execute) {
      console.error(
        `Command file ${file} is missing "data" or "execute" export.`
      );
      continue;
    }
    MyClient.commands.set(command.data.name, command);
  } catch (err) {
    console.error(`Failed to load command ${file}:`, err);
  }
}

// Register commands with Discord
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");

    const commands = MyClient.commands.map((cmd) => cmd.data.toJSON());

    await rest.put(Routes.applicationCommands(process.env.BotID), {
      body: commands,
    });
  } catch (error) {
    console.error("Failed to register slash commands:", error);
  }
})();

MyClient.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = MyClient.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}:`, error);
    await interaction.reply({
      content: "There was an error executing this command!",
      ephemeral: true,
    });
  }
});
RegisterButtonListener(MyClient);

MyClient.login(process.env.DISCORD_TOKEN);
// module.exports = MyClient;
