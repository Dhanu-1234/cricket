const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;
const intializer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is runnig at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

intializer();

//API 1 Returns a list of all players in the team
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT
    *
    FROM
    cricket_team;`;
  const playersList = await db.all(getPlayersQuery);
  response.send(playersList);
});

//API 2 Creates a new player in the team (database). player_id is auto-incremented
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerId, playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
    INSERT INTO
    cricket_team(player_id, player_name, jersey_number, role)
    VALUES
    (
        ${playerId},
        ${playerName},
        ${jerseyNumber},
        ${role}
    );`;
  const dbResponse = await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

//API 3 Returns a player based on a player ID
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerWithIdQuery = `
    SELECT
        *
    FROM
        cricket_team
    WHERE
        player_id = ${playerId};`;
  const player = await db.get(getPlayerWithIdQuery);
  response.send(player);
});

//API 4 Updates the details of a player in the team (database) based on the player ID
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerDetailsQuery = `
    UPDATE
        cricket_team
    SET
        player_name = ${playerName},
        jersey_number = ${jerseyNumber},
        role = ${role}
    WHERE
        player_id = ${playerId};`;
  const dbResponse = await db.run(updatePlayerDetailsQuery);
  response.send("Player Details Updated");
});

//API 5 Deletes a player from the team (database) based on the player ID
app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
        cricket_team
    WHERE
        player_id = ${playerId};`;
  const dbResponse = await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
