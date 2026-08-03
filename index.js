pconst { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers
  ]
});

client.once("ready", () => {
  console.log(`Đăng nhập thành công: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.content === "!start") {
    await message.author.send(
`📜 NHIỆM VỤ 1

Hãy trả lời đúng từ khóa:

SOET`
   );

    message.reply("📩 Đã gửi nhiệm vụ vào tin nhắn riêng của bạn!");
  }
});

client.login(process.env.TOKEN);
