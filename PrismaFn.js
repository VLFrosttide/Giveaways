"use strict";
// import { db } from "./main.js";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

export async function ValidateInput(UserID, UserInput, Fee) {
  let UserKarma = 900; // replace with own fn
  let Spend = UserInput * Fee;
  if (UserKarma - Spend >= 0) {
    return true;
  } else {
    return false;
  }
}
export async function ExportEntries(GiveawayID) {
  let Entries = await db.userentries.findMany({
    where: {
      GiveawayName: GiveawayID,
    },
  });
  return Entries;
}
export async function DrawAWinner(GiveawayID) {
  let AllEntries = await ExportEntries(GiveawayID); // Maybe cache the entries, so it doesnt pull them every time it runs.
  let MaxNum = Object.keys(AllEntries).length;
  let Rando = RandomNumberGenerator(1, MaxNum);

  let Winner = await db.userentries.findFirst({
    where: {
      EntryIndex: Rando,
    },
  });
  console.log(Winner.UserID);
  return Winner.UserID;
}
export async function DrawXWinners(NumberOfWinners, GiveawayID) {
  let Winners = [];
  for (let i = 0; i < NumberOfWinners; i++) {
    // maybe add a check to ensure there are enough entries so it wont run forever for no reason.
    while (Winners.length < NumberOfWinners) {
      let Winner = await DrawAWinner(GiveawayID);
      if (!Winners.includes(Winner)) {
        Winners.push(Winner);
      }
    }
  }
  return Winners;
}

// Replace with own rando generator (requires registration , so i didnt do it)
function RandomNumberGenerator(x, y) {
  return Math.floor(Math.random() * (y - x + 1)) + x;
}

export async function CreateEntry(UserID, GiveawayID) {
  try {
    let NewEntry = await db.userentries.create({
      data: {
        UserID: UserID,
        GiveawayName: GiveawayID,
      },
    });
  } catch (error) {
    console.error("Error creating an entry: ", error);
  }
}
export async function CheckEntry(UserID, GiveawayID) {
  try {
    let Entry = await db.userentries.findFirst({
      where: {
        UserID: UserID,
        GiveawayName: GiveawayID,
      },
    });
    return Entry;
  } catch (error) {
    console.error("Error checking an entry: ", error);
  }
}

export async function DeleteGiveaway(GiveawayID) {
  try {
    let DeletedEntries = await db.userentries.deleteMany({
      where: {
        GiveawayName: GiveawayID,
      },
    });
  } catch (error) {
    console.error("Error deleting giveaway entries: ", error);
  }
}

export async function DeleteUserEntries(UserID, GiveawayID) {
  try {
    let DeletedEntries = await db.userentries.deleteMany({
      where: {
        UserID: UserID,
        GiveawayName: GiveawayID,
      },
    });
  } catch (error) {
    console.error("Error deleting user's entries: ", error);
  }
}
