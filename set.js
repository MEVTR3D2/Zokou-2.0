const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYUMyNkp6M0xNRG5Gc3VRcWIwZEVKak44UHo0ZTlnVUg5N09SRXNqbWluVT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTFBsL2REN0hKNEpKYlprejBGUlNRQVcrMHdXL2F2L29Na0JaUGE2d1oxbz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJrSjF0YyszZGdWREVyM0JOSGltalF2T1NJcEswYTYwNEw5YitDalRubTBvPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI0SXpjOTVPMXh2eXB5OUtnTzhyem8wcVFOdER5bk5EYTJBa29zdGpKc3kwPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkFMa2xsd3NrWVhoeHVVQWtwVkxVL25rSW1idlB6aUVKcEZiaHFlc3lGWDg9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InFXaEU0MzR2SUkvTU9jRTVYYkxjeGI4ZjJhaWxMbFE4ZjR5a1A0SHNKVFE9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR1BFcEtsdHViMXE1VjdpcWgwYkUxNXo0cElUaUFsVW5Tb1oxVElwNkpuRT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMEpQRnpkcEs5KzVGYWNwU3FkblN1YTlxbWsrRHp6K0FnZFVNalduWExrRT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImNOTzZMUDRRUDFlclVpWVFNQnlXSXRaeDhCQnZycmQ4djB6U2VBdlpWNFFXVWVyTFlGRmdmMGluTlZtVnBJTEc1b1Q4Ni8xNUxveTZaRVNReGwyTEN3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjEwLCJhZHZTZWNyZXRLZXkiOiJsWlUybzNmSVR5cFZXZTBGdTUyNkV5eTcybzlnZlB1UFpCTU95cGZuVWZjPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJUV2hlRTdzRlNhQ0cwT29hRVppTWpBIiwicGhvbmVJZCI6ImIyMTc0ZDYxLWI4Y2EtNDU5My04ZWUzLTg4NTU2YTVhNjRkNCIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJBQVhLZnJPY2lCUTFLam5xayt3VjR6VjhkL0U9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoic3FCOVlhWUo5YWdNZnJOdlJVbWJMRnc2Tzk4PSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IjNQV0pBQ0JXIiwibWUiOnsiaWQiOiIyMjg3OTY1NjUyNjozMEBzLndoYXRzYXBwLm5ldCIsImxpZCI6IjgzMjA2NDE4MjA2ODIxOjMwQGxpZCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSVhVbU5BR0VNYkg1SzRHR0FzZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiL21mNTMxK0tsU095aXIraTBlVVk2bWx5NStYVTB3VDNTTkV0OE4vQ2ZYRT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiUWsvR1YyK2NWMDE2bG5yZWxDN2NWUEgrV3dza1RxQzdTbzVYaEk2SHcrUm9BeWpXODBvVVVxUlBNMTNTM1JMc0EwdVlCRmNITjd6cWwyc01FZWMwRFE9PSIsImRldmljZVNpZ25hdHVyZSI6ImRKLzhqVlNobUJLaEVzcGFCa1FLWTZBcDNoaXpiZ1VGeDgrSXppNmNGaHd3UkJSWG5rUGZ1RDJGRTlEb3lHd2dQRW1vMTJLK0V0ZXg0L0cxWW5uaUNBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjI4Nzk2NTY1MjY6MzBAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCZjVuK2Q5ZmlwVWpzb3Evb3RIbEdPcHBjdWZsMU5NRTkwalJMZkRmd24xeCJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTcwODcyOTI5MH0=',
     ETAT:process.env.ETAT,
    PREFIXE: process.env.PREFIXE,
    NOM_OWNER: process.env.NOM_OWNER || "Zokou-Md",
    NUMERO_OWNER : process.env.NUMERO_OWNER,              
    LECTURE_AUTO_STATUS: process.env.LECTURE_AUTO_STATUS || "non",
    TELECHARGER_AUTO_STATUS: process.env.TELECHARGER_AUTO_STATUS || 'non',
    MODE: process.env.MODE_PUBLIC,
    PM_PERMIT: process.env.PM_PERMIT || 'non',
    BOT : process.env.NOM_BOT || 'Zokou_MD',
    URL : process.env.LIENS_MENU || 'https://static.animecorner.me/2023/08/op2.jpg',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    //GPT : process.env.OPENAI_API_KEY,
    DP : process.env.STARTING_BOT_MESSAGE || 'oui',
    ATD : process.env.ANTI_DELETE_MESSAGE || 'non',            
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
