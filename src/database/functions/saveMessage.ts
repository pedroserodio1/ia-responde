import prisma from "../prisma";
import { upsertContact } from "./upsertContact";
import { SaveMessageDTO } from "../../dtos/SaveMessageDTO";

export async function saveMessage({
  id,
  from,
  text,
  fromMe,
  timestamp,
  pushName,
}: SaveMessageDTO) {
  await upsertContact(from, pushName);

  return prisma.message.create({
    data: {
      id,
      contactId: from,
      text,
      fromMe,
      timestamp: new Date(timestamp),
    },
  });
}
