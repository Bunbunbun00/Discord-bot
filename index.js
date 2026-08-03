const { Client, GatewayIntentBits } = require("discord.js");

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

  if (message.content === "!ping") {
    message.reply("🏓 Pong!");
  }

  if (message.content === "!start") {
    try {
      await message.author.send(
        "📜 NHIỆM VỤ 1\n\nHãy trả lời đúng từ khóa:\n\n'SOFT'"
      );
      message.reply("📬 Đã gửi nhiệm vụ vào tin nhắn riêng của bạn!");
    } catch (error) {
      console.error("Lỗi gửi DM:", error);
      message.reply("❌ Không thể gửi DM cho bạn! Hãy kiểm tra cài đặt riêng tư (Privacy) hoặc mời bot vào server chung.");
    }
  }
});
client.on("guildMemberAdd", async (member) => {
  try {
    await member.send(
      "📜 NHIỆM VỤ 1\n\nHãy trả lời đúng từ khóa:\n\nSOFT"
    );

    console.log(`Đã gửi nhiệm vụ cho ${member.user.tag}`);
  } catch (error) {
    console.log("Không gửi được DM:", error);
  }
});

client.login(process.env.TOKEN);
