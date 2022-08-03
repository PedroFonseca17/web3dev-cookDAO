import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop("0x6aEe0d982e5A1F9B6D301563693bb32B36551E5b");

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "Melhor Massinha",
        description: "Esse NFT vai te dar acesso ao COOKDAO!",
        image: readFileSync("scripts/assets/macaroni.jpg"),
      },
    ]);
    console.log("✅ Novo NFT criado com sucesso no !");
  } catch (error) {
    console.error("falha ao criar o novo NFT", error);
  }
})()