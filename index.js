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

  if (message.content === "!start") {
    try {
      // Tự động gửi tin nhắn thẳng vào DMs của người vừa gõ lệnh
      await message.author.send(
        "📜 NHIỆM VỤ 1\n\nHãy trả lời đúng từ khóa:\n\n'SOFT'"
      );
      
      // Phản hồi nhẹ ở kênh chat để người dùng biết check tin nhắn riêng
      await message.reply("📬 Đã gửi nhiệm vụ vào tin nhắn riêng (DM) của bạn!");
    } catch (error) {
      console.error("Lỗi không thể gửi DM:", error);
      await message.reply("❌ Bot không thể gửi DM! Hãy kiểm tra lại cài đặt riêng tư (Bật cho phép nhận DM từ thành viên server).");
    }
  }
});

client.login(process.env.TOKEN);


