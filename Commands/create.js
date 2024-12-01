import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
  time,
} from "discord.js";
export const data = new SlashCommandBuilder()
  .setName("giveaway")
  .setDescription("Create a giveaway")
  .addStringOption((option) =>
    option
      .setName("title")
      .setDescription("Title of the giveaway")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("description")
      .setDescription("Description of the giveaway")
      .setRequired(true)
  )
  .addNumberOption((option) =>
    option
      .setName("reward")
      .setDescription("Karma(?) reward for the giveaway")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("time")
      .setDescription(
        "Time in hours:minutes, if its a single number it defaults to mins"
      )
      .setRequired(true)
  )
  .addNumberOption((option) =>
    option
      .setName("winners")
      .setDescription("Number of winners")
      .setRequired(true)
  )
  .addNumberOption((option) =>
    option
      .setName("fee")
      .setDescription("Karma fee to enter the giveaway")
      .setRequired(false)
  );

export async function execute(interaction) {
  let Title = interaction.options.getString("title");
  let Description = interaction.options.getString("description") || "";
  let Reward = interaction.options.getNumber("reward");
  let Winners = interaction.options.getNumber("winners");
  let Fee = interaction.options.getNumber("fee") || 0;
  /** @type {string} */
  let Time = interaction.options.getString("time");
  let TimeNow = new Date();
  if (Time.includes(":")) {
    Time = Time.split(":");
    TimeNow.setHours(TimeNow.getHours() + Number(Time[0]));
    TimeNow.setMinutes(TimeNow.getMinutes() + Number(Time[1]));
  } else {
    TimeNow.setMinutes(TimeNow.getMinutes() + Number(Time));
  }

  let Timestamp = `<t:${Math.floor(TimeNow.getTime() / 1000)}:f>`;

  const NewButton = new ButtonBuilder()
    .setCustomId(`GiveawayButton${Title}`)
    .setLabel("Participate")
    .setStyle(ButtonStyle.Primary);
  if (Fee > 0) {
    NewButton.setCustomId(`GiveawayButtonModal${Title}:${Fee}`); //Assuming titlte will be something simple and can be used.
  }
  const Row = new ActionRowBuilder().addComponents(NewButton);
  let IntMsg = `🎉 **Giveaway Created!**\n\n**${Title}**\n${Description}\n**Reward:** ${Reward} karma\nWinners: ${Winners} \n**Expires: ${Timestamp}**`;
  if (Fee > 0) {
    IntMsg = `🎉 **Giveaway Created!**\n\n**${Title}**\n${Description}\n**Fee:** ${Fee} karma\n**Reward:** ${Reward} karma\n**Expires: ${Timestamp}**`;
  }
  await interaction.reply({
    content: IntMsg,
    components: [Row],
  });
}
