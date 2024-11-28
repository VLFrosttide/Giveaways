import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
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
      .setName("fee")
      .setDescription("Karma fee to enter the giveaway")
      .setRequired(false)
  );

export async function execute(interaction) {
  let Title = interaction.options.getString("title");
  let Description = interaction.options.getString("description") || "";
  let Reward = interaction.options.getNumber("reward");
  let Fee = interaction.options.getNumber("fee") || 0;
  let Time = interaction.options.getString("time");

  Time = Time.split(":");
  let TimeNow = new Date();
  console.log(Time);
  console.log(Time[0]);
  console.log(Time[1]);

  TimeNow.setHours(TimeNow.getHours() + Number(Time[0]));
  TimeNow.setMinutes(TimeNow.getMinutes() + Number(Time[1]));
  let Timestamp = `<t:${Math.floor(TimeNow.getTime() / 1000)}:f>`;

  const NewButton = new ButtonBuilder()
    .setCustomId("GiveawayButton")
    .setLabel("Participate")
    .setStyle(ButtonStyle.Primary);

  const Row = new ActionRowBuilder().addComponents(NewButton);

  await interaction.reply({
    content: `🎉 **Giveaway Created!**\n\n**${Title}**\n${Description}\n**Reward:** ${Reward} karma \n**Expires: ${Timestamp}**`,
    components: [Row],
  });
}
