const { Client, GatewayIntentBits, Partials } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

// Lưu tiến trình người chơi
const players = new Map();

// Danh sách nhiệm vụ
const missions = [
  {
    question: "📝 **NHIỆM VỤ 1**\nHãy tìm đáp án và nhập ở kênh lobby.",
    answer: "SOFT"
  },
  {
    question: "📝 **NHIỆM VỤ 2**\nHãy tìm đáp án tiếp theo.",
    answer: "APPLE"
  },
  {
    question: "📝 **NHIỆM VỤ 3**\nHãy tìm đáp án tiếp theo.",
    answer: "MOON"
  },
  {
    question: "📝 **NHIỆM VỤ 4**\nĐây là nhiệm vụ cuối cùng.",
    answer: "STAR"
  }
];

client.once("ready", () => {
  console.log(`${client.user.tag} đã online!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Bỏ qua tin nhắn trong DM
  if (!message.guild) return;

  // Bắt đầu
  if (message.content.toLowerCase() === "!start") {

    players.set(message.author.id, {
      stage: 0,
      answers: []
    });

    try {
      await message.author.send(missions[0].question);
      return message.reply("📩 Đã gửi nhiệm vụ 1 vào tin nhắn riêng của bạn.");
    } catch {
      return message.reply("❌ Không thể gửi tin nhắn riêng cho bạn.");
    }
  }

  const player = players.get(message.author.id);

  if (!player) return;

  const current = missions[player.stage];

  if (!current) return;

  if (message.content.toUpperCase() === current.answer.toUpperCase()) {

    player.answers.push(message.content);

    player.stage++;

    // Đã hoàn thành hết
    if (player.stage >= missions.length) {

      await message.reply("🎉 Chính xác!");

      await message.author.send(
`🎉 **CHÚC MỪNG!**

Bạn đã hoàn thành toàn bộ nhiệm vụ.

Đáp án của bạn:
1. ${player.answers[0]}
2. ${player.answers[1]}
3. ${player.answers[2]}
4. ${player.answers[3]}

📩 Bây giờ hãy mở **Ticket** và gửi 4 đáp án trên cho Staff để nhận thưởng.`
);

      players.delete(message.author.id);

      return;
    }

    // Gửi nhiệm vụ tiếp theo
    await message.reply(`✅ Chính xác! Kiểm tra tin nhắn để nhận nhiệm vụ tiếp theo ${player.stage + 1}.`);

    await message.author.send(missions[player.stage].question);

  } else {

    message.reply("❌ Sai đáp án.");

  }

});

client.login(process.env.TOKEN);
      
