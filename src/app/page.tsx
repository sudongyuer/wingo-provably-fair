"use client"
import {useState} from "react";
import crypto from "crypto";

export default function Home() {
  const [server_seed, setServer_seed] = useState("");
  const [amount, setAmount] = useState(10);
  const chain = [server_seed];

  for (let i = 0; i < amount; i++) {
    chain.push(
        crypto
            .createHash("sha256")
            .update(chain[chain.length - 1])
            .digest("hex")
    );
  }

  const clientSeed =
      "00000000000000000004172a4be28d9cdf7e5e36836f1fc6a106ae73266bf47a";

  return (
      <div className="App">
        <h3>Enter the server seed of your game</h3>
        <input
            value={server_seed}
            onChange={(e) => setServer_seed(e.target.value)}
        />
        <br />
        <br />
        <h3>Enter the # of games to view before this one</h3>
        <input
            value={amount}
            onChange={(e) =>setAmount(Number(e.target.value))}
        />
        <hr />
        <h1>Wingo rolls:</h1>
        {!server_seed || server_seed.length !== 64 ? (
            <h3 style={{ color: "red" }}>
              Please enter a server seed to view this table
            </h3>
        ) : (
            <table>
              <thead>
              <tr>
                <th>Roll</th>
                <th>Seed</th>
                <th>Hash (hmac with client seed)</th>
              </tr>
              </thead>
              <tbody>
              {chain.map((seed, index) => {
                  function getHashAndResult() {
                      const hash = crypto
                          .createHmac("sha256", seed)
                          .update(clientSeed)
                          .digest("hex");
                      const result = Math.floor((parseInt(hash.slice(0, 5), 16) / (parseInt('fffff', 16) + 1)) * 10);
                      return {hash, result};
                  }

                  const {hash, result} = getHashAndResult();
                  return (
                    <tr key={index}>
                      <td>
                        {result}
                      </td>
                      <td>{seed}</td>
                      <td>{hash}</td>
                    </tr>
                );
              })}
              </tbody>
            </table>
        )}
      </div>
  )
}
