import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";
import { CreateEntry } from "../PrismaFn.js";

export function RegisterButtonListener(Client) {
  try {
    Client.on("interactionCreate", async (interaction) => {
      console.log("Buttonjs: ", interaction);
      try {
        if (!interaction.isButton()) {
          return;
        }
        if (!interaction.customId.includes("Modal")) {
          interaction.reply({
            content: "You have participated in the giveaway!",
            ephemeral: true,
          });
        } else if (interaction.customId.includes("GiveawayButtonModal")) {
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

          interaction.showModal(TicketModal);

          interaction.client.once(
            "interactionCreate",
            async (ModalInteraction) => {
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
            }
          );
        }
      } catch (error) {
        console.error("Whatever.. ", error);
      }
    });
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}:`, error);
  }
}
