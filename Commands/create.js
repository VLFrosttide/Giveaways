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
  let IntReply;
  console.log("Fee: ", Fee);
  console.log(typeof Fee);
  if (Fee > 0) {
    let CollectorFilter = (ButtonInt) => {
      ButtonInt.customId === "GiveawayButton" &&
        ButtonInt.user.id === interaction.user.id;
    };

    let GiveawayCollector = interaction.channel.createMessageComponentCollector(
      {
        CollectorFilter,
        time: TimeNow.getTime() - Date.now(),
      }
    );
    GiveawayCollector.on("collect", async (BtnInt) => {
      let TicketModal = new ModalBuilder()
        .setCustomId("TicketModal")
        .setTitle("Choose how many tickets you'd like to buy");

      let TicketInput = new TextInputBuilder()
        .setCustomId("TicketInput")
        .setLabel("Number of Tickets")
        .setPlaceholder("Enter the number of tickets you want to buy")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const CollectorActionRow = new ActionRowBuilder().addComponents(
        TicketInput
      );
      TicketModal.addComponents(CollectorActionRow);

      await BtnInt.showModal(TicketModal);

      BtnInt.client.once("interactionCreate", async (ModalInteraction) => {
        if (
          !ModalInteraction.isModalSubmit() ||
          ModalInteraction.customId !== "TicketModal"
        ) {
          return;
        }
        let UserInput =
          ModalInteraction.fields.getTextInputValue("TicketInput");
        await ModalInteraction.reply({
          content: `You successfully entered the giveaway ${UserInput} times`,
          ephemeral: true,
        });
      });
    });
  }
  await interaction.reply({
    content: `🎉 **Giveaway Created!**\n\n**${Title}**\n${Description}\n**Reward:** ${Reward} karma \n**Expires: ${Timestamp}**`,
    components: [Row],
  });
}
