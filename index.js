const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Thêm intent này nếu chưa có để bot nhận sever
    GatewayIntentBits.GuildMessages, // Thêm intent này nếu chưa có để nhận tin nhắn trong server
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: ["Channel", "Message"] // Sửa lỗi viết hoa chuẩn theo bản cập nhật discord.js
});

client.once("ready", () => {
  console.log(`Bot đã sẵn sàng! Đăng nhập dưới tên: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return; // Tránh bot tự trả lời chính nó

  if (message.content === "!start") {
    try {
      await message.author.send("📝 **NHIỆM VỤ 1:** Hãy trả lời đúng từ khóa: `SOFT`");
      await message.reply("📬 **Đã gửi nhiệm vụ vào tin nhắn riêng của bạn!**");
    } catch (error) {
      await message.reply("❌ **Không thể DM cho bạn!** Hãy kiểm tra cài đặt riêng tư (Privacy) hoặc mời bot vào server chung.");
    }
  }
});

client.on("guildMemberAdd", async (member) => {
  try {
    await member.send("📝 **NHIỆM VỤ 1:** Hãy trả lời đúng từ khóa: `SOFT`");
    console.log(`Đã gửi nhiệm vụ cho ${member.user.tag}`);
  } catch (error) {
    console.log(`Không gửi được DM cho ${member.user.tag}:`, error.message);
  }
}); // Đã bổ sung dấu } bị thiếu ở đây

client.login(process.env.TOKEN);
