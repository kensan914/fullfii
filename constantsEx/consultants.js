const consultants = [
  {
    id: 1,
    name: "*Cassy*",
    image: "https://www.pakutaso.com/shared/img/thumb/002ELLY18420_TP_V.jpg",
    status: { key: "online", title: "オンライン" },
    // gender: "男",
    age: 30,
    numOfThunks: 20,
    // numOfComments: 13,
    introduction: "夫の転勤で周りに離せる相手がいません。悩みを聞いてくれる方を探しています。",
  },
  {
    id: 12,
    name: "くーちゃん",
    image: "https://www.pakutaso.com/shared/img/thumb/yumikoIMGL7854_TP_V.jpg",
    status: { key: "offline", title: "オフライン" },
    // gender: "女",
    age: 25,
    numOfThunks: 49,
    // numOfComments: 13,
    introduction: "最近結婚しましたが、旦那に悩みがあって...友達はまだ結婚してないので相談相手を探しています！",
  },
  {
    id: 123,
    name: "__rie__",
    image: "https://www.pakutaso.com/shared/img/thumb/fukugyo206140040_TP_V.jpg",
    status: { key: "online", title: "オンライン" },
    // gender: "男",
    age: 37,
    numOfThunks: 125,
    // numOfComments: 13,
    introduction: "周りの友達は仕事で忙しく、専業主婦の私の話が共感されません。同じ環境の方、一緒にお話ししましょう。",
  },
  {
    id: 1234,
    name: "ほの",
    image: "https://www.pakutaso.com/shared/img/thumb/takerukuma0145_TP_V.jpg",
    status: { key: "online", title: "オフライン" },
    // gender: "女",
    age: 27,
    numOfThunks: 22,
    // numOfComments: 13,
    introduction: "夫が不倫しているみたいです。さすがに友達に相談できないです。誰か話せる方いませんか？",
  },
];

export default consultants;


export const fullConsultants = {
  "1": {
    id: 1,
    name: "*Cassy*",
    image: "https://www.pakutaso.com/shared/img/thumb/002ELLY18420_TP_V.jpg",
    status: { key: "online", title: "オンライン" },
    age: 30,
    numOfThunks: 20,
    introduction: "夫の転勤で周りに離せる相手がいません。悩みを聞いてくれる方を探しています。",
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
  "12": {
    id: 12,
    name: "くーちゃん",
    image: "https://www.pakutaso.com/shared/img/thumb/yumikoIMGL7854_TP_V.jpg",
    status: { key: "offline", title: "オフライン" },
    age: 25,
    numOfThunks: 49,
    introduction: "最近結婚しましたが、旦那に悩みがあって...友達はまだ結婚してないので相談相手を探しています！",
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
  "123": {
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
  "1234": {
    id: 1234,
    name: "ほの",
    image: "https://www.pakutaso.com/shared/img/thumb/takerukuma0145_TP_V.jpg",
    status: { key: "online", title: "オフライン" },
    age: 27,
    numOfThunks: 22,
    introduction: "夫が不倫しているみたいです。さすがに友達に相談できないです。誰か話せる方いませんか？",
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
};

export const profile = {
  id: 888,
  name: "mai",
  image: "https://www.pakutaso.com/shared/img/thumb/Photoelly007_TP_V.jpg",
  status: { key: "online", title: "オンライン" }, // or {key: "offline", title: "オフライン"} or {key: "talking", title: "会話中"}
  // gender: "男",
  age: 26,
  numOfThunks: 0,
  // numOfComments: 0,
  plan: { key: "pro", title: "PRO" }, // or {key: "pro", title: "PRO"}
  introduction: "専業主婦をしています。家で一人でいる時間が長くて登録しました。",
  features: {
    4: "黙って聞きます",
    6: "質問少なめ",
    8: "声低め",
    17: "O型",
    20: "話を聞くのが好き",
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
  all: true,

  me: true,
  full: 500,
  point: 0,
  privacyName: "kensan",
  privacyImage: "https://otapick.com/media/member_images/2_6/600_600_102400.jpg",
  birthday: {
    text: "1998年9月14日",
    year: 1998,
    month: 9,
    day: 14,
  }
};