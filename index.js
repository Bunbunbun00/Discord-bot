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
    question: "📝 **NHIỆM VỤ 1**\nTìm các số ngẫu nhiên được chat ngẫu nhiên trong sever.",
    answer: "134679"
  },
  {
    question: "📝 **NHIỆM VỤ 2**\nĐây là manh mối thứ 2 của bạn: c/T/Y/t./r/o/u/e/e/h/a/O/e/n/a/i (Sắp xếp lại thứ tự để mở nhiệm vụ thứ 3).",
    answer: "toiyeuoceanheart"
  },
  {
    question: "📝 **NHIỆM VỤ 3**\nĐây là manh mối thứ 3 của bạn: 03 01 03 08 13 01 14 07 20 08 01 14 07 20 01 13 (Hãy tìm ra quy luật và giải để mở khoá nhiệm vụ cuối cùng).",
    answer: "cachmangthangtam"
  },
  {
    question: "📝 **NHIỆM VỤ 4**\nĐây là manh mối cuối cùng: .... --- / -.-. .... .. / -- .. -. .... / ...- .. / -.. .- .. (Giải mã morse này để hoàn thành câu đố ngày 1).",
    answer: "HO CHI MINH VI DAI"
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

      await message.reply("🎉 yeahh bạn đã làm đúng hết rồi!");

      await message.author.send(
`🎉 **CHÚC MỪNG!**

Bạn đã hoàn thành toàn bộ nhiệm vụ.

Đáp án của bạn:
1. ${player.answers[0]}
2. ${player.answers[1]}
3. ${player.answers[2]}
4. ${player.answers[3]}

📩 Chúc mừng bạn đã hoàn thành phần giải đố đầy khó khăn và thử thách. Chụp màn hình tin nhắn này của bạn và gửi qua <#1531673916085374990> để được điểm.`
);

      players.delete(message.author.id);

      return;
    }

    // Gửi nhiệm vụ tiếp theo
    await message.reply(`✅ Bạn làm đúng rùii! Kiểm tra tin nhắn để nhận nhiệm vụ  ${player.stage + 1}.`);

    await message.author.send(missions[player.stage].question);

  } else {

    message.reply("❌ Sai đáp án.");

  }

});

client.login(process.env.TOKEN);
      
