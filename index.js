const {
    Client,
    GatewayIntentBits,
    Partials,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");

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
const singCooldown = new Map();
// =========================
// MELODY GAME DATA
// =========================

//======================
// Melody Game Database
//======================

const musicPlayers = {};
const cooldown = new Map();

function getPlayer(id) {

    if (!musicPlayers[id]) {

        musicPlayers[id] = {

            notes: 0,
            level: 1,
            exp: 0,
            coin: 0,

            title: "🎤 Người mới",

            equipped: "🎤 Micro Thường",

            inventory: []

        };

    }

    return musicPlayers[id];

}

function needExp(level){

    return level * 100;

}

function addExp(player, amount){

    player.exp += amount;

    while(player.exp >= needExp(player.level)){

        player.exp -= needExp(player.level);

        player.level++;

        if(player.level >= 5)
            player.title = "🎙 Ca sĩ nghiệp dư";

        if(player.level >= 10)
            player.title = "🎵 Nghệ sĩ đường phố";

        if(player.level >= 20)
            player.title = "🌟 Rising Star";

        if(player.level >= 35)
            player.title = "👑 Melody Master";

        if(player.level >= 50)
            player.title = "💎 Legendary Singer";

    }

}
function randomReward(){

    const r = Math.random();

    if(r < 0.001){

        return{

            rarity:"🌈 Divine",
            color:"#ff00ff",
            multi:12

        };

    }

    if(r < 0.01){

        return{

            rarity:"🔴 Mythic",
            color:"#ff2222",
            multi:8

        };

    }

    if(r < 0.03){

        return{

            rarity:"🟠 Legendary",
            color:"#ff8800",
            multi:5

        };

    }

    if(r < 0.10){

        return{

            rarity:"🟣 Epic",
            color:"#c44dff",
            multi:3

        };

    }

    if(r < 0.25){

        return{

            rarity:"🔵 Rare",
            color:"#3da5ff",
            multi:2

        };

    }

    return{

        rarity:"⚪ Common",
        color:"#ffffff",
        multi:1

    };

}
// Danh sách nhiệm vụ
const missions = [
  {
    question: "📝 **NHIỆM VỤ 1**\n6 staff sẽ cầm 1 con số rải khắp kênh, nhiệm vụ là tìm và thu thập 6 con số từ nhỏ đến lớn để hoàn thành.",
    answer: "134679"
  },
  {
    question: "📝 **NHIỆM VỤ 2**\nĐây là manh mối cuối cùng: .... --- / -.-. .... .. / -- .. -. .... / ...- .. / -.. .- .. (Giải mã morse này để hoàn thành câu đố để mở khóa nhiệm vụ 3).",
    answer: "HOCHIMINHVIDAI"
  },
  {
    question: "📝 **NHIỆM VỤ 3**\nĐây là manh mối thứ 3 của bạn: 03 01 03 08 13 01 14 07 20 08 01 14 07 20 01 13 (Hãy tìm ra quy luật và giải để mở khoá nhiệm vụ cuối cùng).",
    answer: "cachmangthangtam"
  },
  {
    question: "📝 **NHIỆM VỤ 4**\nĐây là manh mối cuối của bạn: c/T/Y/t./r/o/u/e/e/h/a/O/e/n/a/i (Sắp xếp lại thứ tự để hoàn thành ngày 1).",
    answer: "toiyeuocenheart"
  }
];

client.once("ready", () => {
  console.log(`${client.user.tag} đã online!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  //======================
// msing
//======================

if (message.content.toLowerCase() === "msing") {

    const last = cooldown.get(message.author.id);

    if (last && Date.now() - last < 10000) {

        const left = Math.ceil((10000 - (Date.now() - last)) / 1000);

        return message.reply(`⏳ Bạn cần nghỉ **${left} giây** trước khi hát tiếp!`);

    }

    cooldown.set(message.author.id, Date.now());

    const player = getPlayer(message.author.id);

    const loading = new EmbedBuilder()

        .setColor("#ffb6c1")

        .setTitle("🎼 Melody Journey")

        .setDescription(
            "### 🎵 Thư giãn cùng mình...\n\n" +
            "♪ ♫ ♪ ♫ ♪ ♫ ♪\n\n" +
            "> Đang tận hưởng giai điệu..."
        )

        // Đổi thành link ảnh hộp nhạc của mày nếu muốn
        .setThumbnail("https://i.imgur.com/4M34hi2.png")

        .setFooter({
            text: "Vui lòng chờ 3 giây..."
        });

    const msg = await message.reply({
        embeds: [loading]
    });

    await new Promise(r => setTimeout(r, 3000));

    const reward = randomReward();

    let notes = Math.floor(Math.random() * 41) + 10;

    notes *= reward.multi;

    let exp = Math.floor(Math.random() * 16) + 10;

    let bonus = "";

    // Lucky
    if (Math.random() < 0.12) {

        notes *= 2;

        bonus += "\n🍀 **Lucky Bonus x2**";

    }

    // Critical
    if (Math.random() < 0.08) {

        exp *= 2;

        bonus += "\n✨ **Perfect Performance! EXP x2**";

    }

    player.notes += notes;

    addExp(player, exp);

    const bar =
        "🟩".repeat(
            Math.floor((player.exp / needExp(player.level)) * 10)
        ) +
        "⬜".repeat(
            10 - Math.floor((player.exp / needExp(player.level)) * 10)
        );

    const result = new EmbedBuilder()

        .setColor(reward.color)

        .setTitle("🎤 Melody Journey")

        .setDescription(

`## 🎶 Buổi biểu diễn kết thúc!

🎼 **+${notes} Melody Notes**

⭐ **+${exp} EXP**

🏆 **${reward.rarity}**

${bonus}

━━━━━━━━━━━━━━

👤 **${player.title}**

📈 Level **${player.level}**

${bar}

EXP: **${player.exp}/${needExp(player.level)}**`

        )

        .setFooter({
            text: "Cooldown: 10 giây"
        });

    await msg.edit({

        embeds: [result]

    });

    return;

        }

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
  // =========================
// LỆNH MSING
// =========================

if (message.content.toLowerCase() === "msing") {

    const now = Date.now();

    if (singCooldown.has(message.author.id)) {

        const left = 10000 - (now - singCooldown.get(message.author.id));

        if (left > 0)
            return message.reply(`⏳ Hãy đợi **${Math.ceil(left / 1000)} giây** rồi hát tiếp.`);
    }

    singCooldown.set(message.author.id, now);

    const player = getPlayer(message.author.id);

    const loading = await message.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle("🎼 Hộp Nhạc Melody")
                .setDescription("```Thư giãn cùng mình...```")
                .setImage("https://media.tenor.com/j5m7K6kL8aUAAAAC/music-box.gif")
                .setColor("#7B68EE")
        ]
    });

    await new Promise(r => setTimeout(r, 3000));

    const reward = randomReward();

    player.notes += reward.amount;

    addExp(player, reward.amount * 2);

    await loading.edit({
        embeds: [
            new EmbedBuilder()
                .setTitle("🎶 Bạn vừa cất tiếng hát!")
                .setDescription(
`✨ Độ hiếm: ${reward.rarity.emoji} **${reward.rarity.name}**

🎵 Nhận được: **${reward.amount} Nốt Nhạc**

📈 Level: **${player.level}**

🎤 Danh hiệu:
${player.singer}`
                )
                .setColor("#FFD700")
        ]
    });

    return;

      }

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
  }

});

client.login(process.env.TOKEN);

                
