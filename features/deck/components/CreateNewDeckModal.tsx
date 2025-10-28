"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";

export const CreateNewDeckModal = () => {
  const createDeckMutation = useMutation(api.deck.createDeck);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deckName, setDeckName] = useState("");

  const createDeck = async () => {
    if (!deckName.trim()) {
      alert("デッキ名を入力してください");
      return;
    }

    try {
      await createDeckMutation({ name: deckName.trim() });
      setDeckName("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("デッキ作成エラー:", error);
      alert("デッキの作成に失敗しました");
    }
  };

  return (
    <div className="flex items-center justify-end p-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>デッキ作成</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>新しいデッキを作成</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deck-name" className="text-right">
                デッキ名
              </Label>
              <Input
                id="deck-name"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className="col-span-3"
                placeholder="デッキ名を入力"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    createDeck();
                  }
                }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={createDeck}>作成</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
