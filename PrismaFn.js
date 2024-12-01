"use strict";
import { User } from "discord.js";
import { db } from "./main.js";
import { Prisma } from "@prisma/client";

export async function CreateEntry(UserID, GiveawayID) {
  let NewEntry = await db.userentries.create({
    data: {
      UserID: UserID,
      GiveawayName: GiveawayID,
    },
  });
}

export async function CheckEntry(UserID, GiveawayID) {
  let Entry = await db.userentries.findFirst({
    where: {
      UserID: UserID,
      GiveawayName: GiveawayID,
    },
  });
  return Entry;
}

export async function DeleteGiveaway(GiveawayID) {
  let DeletedEntries = await db.userentries.deleteMany({
    where: {
      GiveawayName: GiveawayID,
    },
  });
}

export async function DeleteUserEntries(UserID, GiveawayID) {
  let DeletedEntries = await db.userentries.deleteMany({
    where: {
      UserID: UserID,
      GiveawayName: GiveawayID,
    },
  });
  ReIndex(userentries);
}

export async function ReIndex(Table) {
  await db.$executeRaw`SET @count = 0;`;
  await db.$executeRaw`UPDATE ${Table} SET EntryIndex = (@count := @count + 1);`;
  let EntryIndex = await db.$queryRaw`SELECT MAX(EntryIndex) FROM ${Table}`;
  let AIValue = EntryIndex[0]["MAX(EntryIndex)"] + 1;
  await db.$executeRaw`ALTER TABLE ${Table} AUTO_INCREMENT = ${AIValue};`;
}
