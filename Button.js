export function RegisterButtonListener(Client) {
  Client.on("interactionCreate", async (interaction) => {
    console.log("This works...");
    try {
      if (!interaction.isButton()) {
        return;
      }
      if (interaction.customId === "GiveawayButton") {
        interaction.reply({
          content: "You have participated in the giveaway!",
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error("Whatever.. ", error);
    }
  });
}
