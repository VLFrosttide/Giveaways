import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  User,
} from "discord.js";

import { CreateEntry, CheckEntry, ValidateInput } from "../PrismaFn.js";
export function RegisterButtonListener(Client, db) {
  try {
    Client.on("interactionCreate", async (interaction) => {
      try {
        if (!interaction.isButton()) {
          return;
        }

        let UserID = interaction.user.id;
        let GiveawayInfo = interaction.customId.split(":");
        let GiveawayTitle = GiveawayInfo[0];
        let Fee = Number(GiveawayInfo[1]);
        //#region Simple button
        if (!interaction.customId.includes("Modal")) {
          GiveawayTitle = GiveawayTitle.trim().replace("GiveawayButton", "");
          let Entry = await CheckEntry(UserID, GiveawayTitle);
          if (!Entry) {
            CreateEntry(UserID, GiveawayTitle);
          }
          interaction.reply({
            content: "You have participated in the giveaway!",
            ephemeral: true,
          });
        }
        //#endregion
        //#region Modal
        else if (interaction.customId.includes("GiveawayButtonModal")) {
          GiveawayTitle = GiveawayTitle.replace(
            "GiveawayButtonModal",
            ""
          ).trim();
          let TicketModal = new ModalBuilder()
            .setCustomId("TicketModal")
            .setTitle("Choose how many tickets you'd like to buy");

          let TicketInput = new TextInputBuilder()
            .setCustomId("TicketInput")
            .setLabel("Number of Tickets")
            .setPlaceholder("Enter the number of tickets you want to buy")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const NewActionRow = new ActionRowBuilder().addComponents(
            TicketInput
          );
          TicketModal.addComponents(NewActionRow);
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
              let UserInput = Number(
                ModalInteraction.fields
                  .getTextInputValue("TicketInput")
                  .trim()
                  .replace(/[^0-9]/g, "")
              );
              if (await ValidateInput(UserID, UserInput, Fee)) {
                for (let i = 0; i < UserInput; i++) {
                  CreateEntry(Number(UserID), GiveawayTitle);
                }

                await ModalInteraction.reply({
                  content: `You successfully entered the giveaway ${UserInput} times`, // Can also display remaining karma here
                  ephemeral: true,
                });
              } else {
                await ModalInteraction.reply({
                  content: `Sorry, you dont have enough karma to purchase ${UserInput} entries in the giveaway `,
                });
              }
            }
          );
        }
        //#endregion
      } catch (error) {
        console.error("Whatever.. ", error);
      }
    });
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}:`, error);
  }
}
