export const userMockData = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
};

export const userCardMockDataList = {
  [1]: {
    id: 1,
    user_id: userMockData.id,
    card_id: "00001",
    is_locked: false,
    card: {
      id: "00001",
      name: "ロシア",
      rarity: "common",
    },
  },
  [2]: {
    id: 2,
    user_id: userMockData.id,
    card_id: "00002",
    is_locked: false,
    card: {
      id: "00002",
      name: "にほん",
      rarity: "rare",
    },
  },
  [4]: {
    id: 4,
    user_id: userMockData.id,
    card_id: "00003",
    is_locked: false,
    card: {
      id: "00003",
      name: "あいち",
      rarity: "super_rare",
    },
  },
  [5]: {
    id: 5,
    user_id: userMockData.id,
    card_id: "00004",
    is_locked: false,
    card: {
      id: "00004",
      name: "あめりか",
      rarity: "epic",
    },
  },
  [6]: {
    id: 6,
    user_id: userMockData.id,
    card_id: "00005",
    is_locked: false,
    card: {
      id: "00005",
      name: "ホーム・アンド・アウェー",
      rarity: "legendary",
    },
  },
};
