export const talks = [
  {
    companion: {
      id: 123,
      name: "__rie__",
      image: "https://www.pakutaso.com/shared/img/thumb/fukugyo206140040_TP_V.jpg",
      status: { key: "online", title: "オンライン" },
      age: 37,
      numOfThunks: 125,
      introduction: "周りの友達は仕事で忙しく、専業主婦の私の話が共感されません。同じ環境の方、一緒にお話ししましょう。",
      features: {
        1: "口調やさしい",
        3: "サバサバ",
        5: "質問良くする",
        15: "B型",
      },
      genreOfWorries: {
        0: "仕事",
        3: "恋愛",
      },
      scaleOfWorries: {
        1: "軽い悩み",
        2: "雑談",
        5: "友達感覚で話したい",
      },
      worriesToSympathize: {
        2: "不倫",
        10: "子供思春期",
        26: "体",
      },
      full: true,
    },
    messages: [
      {
        id: 1,
        message: "こんばんは。夫の悩みですか？",
        day: "8/31",
      }, {
        id: 2,
        message: "そうです！\nこういうのって本人に相談できないし、転勤で地方にいるので、周りに友達もいなくて...",
        day: "8/31",
        me: true,
      }, {
        id: 3,
        message: "私もです！特に私の場合は地方には住んでいるんですけど、友達はみんな結婚していないので相談しづらくて。",
        day: "8/31",
      },
    ]
  },
];

export const unreadCount = 2;