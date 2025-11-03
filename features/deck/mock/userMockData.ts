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
      id: "1",
      name: "日本",
      rarity: "legendary",
    },
  },
  [2]: {
    id: 2,
    user_id: userMockData.id,
    card_id: "00002",
    is_locked: false,
    card: {
      id: "85",
      name: "全国",
      rarity: "epic",
    },
  },
  [4]: {
    id: 4,
    user_id: userMockData.id,
    card_id: "00003",
    is_locked: false,
    card: {
      id: "816",
      name: "ユーザー",
      rarity: "super_rare",
    },
  },
  [5]: {
    id: 5,
    user_id: userMockData.id,
    card_id: "00004",
    is_locked: false,
    card: {
      id: "3179",
      name: "主席",
      rarity: "rare",
    },
  },
  [6]: {
    id: 6,
    user_id: userMockData.id,
    card_id: "00005",
    is_locked: false,
    card: {
      id: "7670",
      name: "ハットトリック",
      rarity: "common",
    },
  },
};
