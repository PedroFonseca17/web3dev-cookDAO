import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

// Nosso contrato de votação.
const vote = sdk.getVote("0x2eEaCD499B8c715176a6DFA1b7266a635bF7Ab57");

// Nosso contrato ERC-20.
const token = sdk.getToken("0x5334c61523d42ef5acAcDDBdEDc266752a166b6C");

(async () => {
  try {
    const amount = 420_000;
    // Crie uma proposta para cunhar 420.000 novos tokens para o tesouro.
    const description = "Cunhar para a DAO uma quantidade adicional de " + amount + " tokens no tesouro?";

    const executions = [
      {
        // Nosso token module que de fato executa a cunhagem.
        toAddress: token.getAddress(),
        // Nosso nativeToken é ETH. nativeTokenValue é a quantidade de ETH que nós queremos 
        // mandar nessa proposta. Nesse caso, estamos mandando 0 ETH.
        // Nós estamos apenas cunhando novos tokens para o tesouro. Então, deixe 0.
        nativeTokenValue: 0,
          // Estamos fazendo uma cunhagem! E, estamos cunhando no vote, que está
          // agindo como nosso tesouro. 
          // nesse caso, usamos ethers.js para converter a quantidade
          // ao formato correto. Isso porque a quantidade precisa ser em wei
        transactionData: token.encoder.encode(
          "mintTo", [
            vote.getAddress(),
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),
      }
    ];

    await vote.propose(description, executions);


    console.log("✅ Proposta de cunhar tokens criada com sucesso!");
  } catch (error) {
    console.error("falha ao criar primeira proposta", error);
    process.exit(1);
  }

  try {
    // Crie uma proposta para transferir para nós mesmos 6,900 tokens por sermos irados.
    const amount = 6_900;

    const description = "A DAO deveria transferir " + amount + " tokens do tesouro para " +
      process.env.WALLET_ADDRESS + " por ser uma pessoa incrível?";

    const executions = [
      {
        // Novamente, estamos mandando para nós mesmos 0 ETH. Apenas mandando nosso próprio token.
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          // Nós estamos fazendo uma transferência do tesouro para a nossa carteira.
          "transfer",
          [
            process.env.WALLET_ADDRESS,
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),

        toAddress: token.getAddress(),
      },
    ];

    await vote.propose(description, executions);

    console.log(
      "✅ Proposta de dar prêmio do tesouro para si mesmo criada com sucesso, vamos torcer para votarem sim!"
    );
  } catch (error) {
    console.error("falha ao criar segunda proposta", error);
  }
})();
