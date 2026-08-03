const { Client, GatewayIntentBits, Partials } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel, Partials.Message]
});

client.once("ready", () => {
  console.log(`Đăng nhập thành công: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    message.reply("🏓 Pong!");
  }

  if (message.content === "!start") {
    try {
      await message.author.send("📜 NHIỆM VỤ 1\n\nHãy trả lời đúng từ khóa:\n\n'SOFT'");
      await message.reply("📬 Đã gửi nhiệm vụ vào tin nhắn riêng của bạn!");
    } catch (error) {
      console.error("Lỗi gửi DM:", error);
      await message.reply("❌ Bot không gửi được DM! Bạn hãy bật tùy chọn 'Allow Direct Messages' trong Privacy Settings của Server nhé.");
    }
  }
});

client.login(process.env.TOKEN);

