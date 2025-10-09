"use client";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { CardComponent } from "../../../features/deck/components/OwnerCard";

const Test = () => {
  const cards = useQuery(api.card.get);
  return (
    <div>
      <div>
        {cards?.map((card) => (
          <CardComponent
            key={card._id}
            ownedCard={{
              id: 1,
              user_id: "test-user",
              card_id: card._id,
              card: {
                id: card._id,
                name: card.text,
                rarity: card.rarity,
              },
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Test;
