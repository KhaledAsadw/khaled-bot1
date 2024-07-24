//حقوق كيلوا تم تقديمه وصناعته بواسطة كيلوا
//مقدم من قناة https://whatsapp.com/channel/0029Vab5oDNElagpHtJjmT0B
const {
  useMultiFileAuthState: e,
  DisconnectReason: f,
  fetchLatestBaileysVersion: g,
  MessageRetryMap: h,
  makeCacheableSignalKeyStore: i,
  jidNormalizedUser: j,
  PHONENUMBER_MCC: k
} = await import("@whiskeysockets/baileys");
import "moment-timezone";
import l from "node-cache";
import m from "readline";
import "qrcode";
import n from "crypto";
import o from "fs";
import p from "pino";
import "ws";
import "@hapi/boom";
import { makeWASocket as q } from "../lib/simple.js";
if (global.conns instanceof Array) {
  console.log();
} else {
  global.conns = [];
}
let r = async (a, {
  conn: b,
  args: c,
  usedPrefix: d,
  command: h,
  isOwner: r
}) => {
  let t = c[0] && c[0] === "plz" ? b : await global.conn;
  if ((!c[0] || c[0] !== "plz") && (await global.conn).user.jid !== b.user.jid) {
    throw "\"هذا الأمر يمكن استخدامه فقط من قبل الروبوت الرئيسي.\" wa.me/" + global.conn.user.jid.split`@`[0] + "?text=" + d + h;
  }
  async function u() {
    let b = n.randomBytes(10).toString("hex").slice(0, 8);
    if (!o.existsSync("./jadibts/" + b)) {
      o.mkdirSync("./jadibts/" + b, {
        recursive: true
      });
    }
    if (c[0]) {
      o.writeFileSync("./jadibts/" + b + "/creds.json", JSON.stringify(JSON.parse(Buffer.from(c[0], "base64").toString("utf-8")), null, "\t"));
    }
    const {
      state: r,
      saveState: u,
      saveCreds: v
    } = await e("./jadibts/" + b);
    const w = () => {};
    const x = new l();
    const {
      version: y
    } = await g();
    let z = a.sender.split("@")[0];
    const A = !!z || process.argv.includes("code");
    const B = process.argv.includes("mobile");
    const C = m.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    const D = {
      logger: p({
        level: "silent"
      }),
      printQRInTerminal: false,
      mobile: B,
      browser: ["Ubuntu", "Chrome", "20.0.04"],
      auth: {
        creds: r.creds,
        keys: i(r.keys, p({
          level: "fatal"
        }).child({
          level: "fatal"
        }))
      },
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      getMessage: async a => {
        let b = j(a.remoteJid);
        let c = await store.loadMessage(b, a.id);
        return c?.message || "";
      },
      msgRetryCounterCache: x,
      msgRetryCounterMap: w,
      defaultQueryTimeoutMs: undefined,
      version: y
    };
    let E = q(D);
    if (A && !E.authState.creds.registered) {
      if (!z) {
        process.exit(0);
      }
      let b = z.replace(/[^0-9]/g, "");
      if (!Object.keys(k).some(a => b.startsWith(a))) {
        process.exit(0);
      }
      setTimeout(async () => {
        let c = await E.requestPairingCode(b);
        c = c?.match(/.{1,4}/g)?.join("-") || c;
        t.sendButton(a.chat, "مرحبا! يسرنا أنك ستستخدم البوت الخاص بنا. هذا هو الكود لربط البوت على رقمك. قم بنسخه و ادخل الكود في المكان المناسب في الإشعار الذي سوف يصلك", "👇🏻✨", "https://telegra.ph/file/f6f26c3ddf1c1c03a52a4.png", [["" + c, "انسخ الرساله"], ["اطلب الكود مره ثانيه", "" + (d + h)]], null, null, a);
        C.close();
      }, 3000);
    }
    E.isInit = false;
    let F = true;
    async function G(e) {
      const {
        connection: g,
        lastDisconnect: i,
        isNewLogin: j,
        qr: k
      } = e;
      if (j) {
        E.isInit = true;
      }
      const l = i?.error?.output?.statusCode || i?.error?.output?.payload?.statusCode;
      if (l && l !== f.loggedOut && E?.ws.socket == null) {
        let b = global.conns.indexOf(E);
        if (b < 0) {
          return console.log(await I(true).catch(console.error));
        }
        delete global.conns[b];
        global.conns.splice(b, 1);
        if (l !== f.connectionClosed) {
          t.sendMessage(E.user.jid, {
            text: " \"اتصال مفقود، يتم إعادة الاتصال\""
          }, {
            quoted: a
          });
        } else {
          t.sendMessage(a.chat, {
            text: " يتم إعادة الإتصال"
          }, {
            quoted: a
          });
        }
      }
      if (global.db.data == null) {
        loadDatabase();
      }
      if (g == "open") {
        E.isInit = true;
        global.conns.push(E);
        await t.sendMessage(a.chat, {
          text: c[0] ? " تم الإتصال بالسيرفر \n \n مرحبا بك في بوت كيلوا البوت مدعوم بالكثير من الخصائص كا صناعة الصور وارسال التطبيقات والفيديوهات وكل مايخص المستخدم \n\n" : " جاري الإتصال بالبوت الرئيسي"
        }, {
          quoted: a
        });
        await s(5000);
        if (c[0]) {
          return;
        }
        await t.sendMessage(E.user.jid, {
          text: "يتم تحميل البوت على هذا الجهاز..."
        }, {
          quoted: a
        });
        t.sendMessage(E.user.jid, {
          text: "" + d + h + " " + Buffer.from(o.readFileSync("./jadibts/" + b + "/creds.json"), "utf-8").toString("base64")
        }, {
          quoted: a
        });
      }
    }
    setInterval(async () => {
      if (!E.user) {
        try {
          E.ws.close();
        } catch {}
        E.ev.removeAllListeners();
        let a = global.conns.indexOf(E);
        if (a < 0) {
          return;
        }
        delete global.conns[a];
        global.conns.splice(a, 1);
      }
    }, 60000);
    let H = await import("../handler.js");
    let I = async function (a) {
      try {
        const a = await import("../handler.js?update=" + Date.now()).catch(console.error);
        if (Object.keys(a || {}).length) {
          H = a;
        }
      } catch (a) {
        console.error(a);
      }
      if (a) {
        try {
          E.ws.close();
        } catch {}
        E.ev.removeAllListeners();
        E = q(D);
        F = true;
      }
      if (!F) {
        E.ev.off("messages.upsert", E.handler);
        E.ev.off("group-participants.update", E.participantsUpdate);
        E.ev.off("groups.update", E.groupsUpdate);
        E.ev.off("message.delete", E.onDelete);
        E.ev.off("call", E.onCall);
        E.ev.off("connection.update", E.connectionUpdate);
        E.ev.off("creds.update", E.credsUpdate);
      }
      E.welcome = global.conn.welcome + "";
      E.bye = global.conn.bye + "";
      E.spromote = global.conn.spromote + "";
      E.sdemote = global.conn.sdemote + "";
      E.handler = H.handler.bind(E);
      E.participantsUpdate = H.participantsUpdate.bind(E);
      E.groupsUpdate = H.groupsUpdate.bind(E);
      E.onDelete = H.deleteUpdate.bind(E);
      E.connectionUpdate = G.bind(E);
      E.credsUpdate = v.bind(E, true);
      E.ev.on("messages.upsert", E.handler);
      E.ev.on("group-participants.update", E.participantsUpdate);
      E.ev.on("groups.update", E.groupsUpdate);
      E.ev.on("message.delete", E.onDelete);
      E.ev.on("connection.update", E.connectionUpdate);
      E.ev.on("creds.update", E.credsUpdate);
      F = false;
      return true;
    };
    I(false);
  }
  u();
};
r.help = ["تنصيب"];
r.tags = ["تنصيب"];
r.command = ["ربط", "code", "sercode", "jadibot"];
r.rowner = false;
export default r;
function s(a) {
  return new Promise(b => setTimeout(b, a));
      }
