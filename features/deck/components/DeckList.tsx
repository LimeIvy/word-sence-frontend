"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery } from "convex/react";
import { Edit, Play, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export const DeckList = () => {
  const decks = useQuery(api.deck.getUserDecks);
  const deleteDeckMutation = useMutation(api.deck.deleteDeck);
  const [deletingDeckId, setDeletingDeckId] = useState<Id<"deck"> | null>(null);

  const handleDeleteDeck = async (deckId: Id<"deck">) => {
    try {
      setDeletingDeckId(deckId);
      await deleteDeckMutation({ deckId });
    } catch (error) {
      console.error("デッキ削除エラー:", error);
      alert("デッキの削除に失敗しました");
    } finally {
      setDeletingDeckId(null);
    }
  };

  if (decks === undefined) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (decks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-gray-500 select-none">
        <p>デッキがありません</p>
        <p className="text-sm">「デッキ作成」ボタンから新しいデッキを作成してください</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {decks.map((deck) => (
        <Card key={deck._id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg truncate">{deck.deck_name}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  ID: {deck._id.slice(-8)}
                </Badge>
              </div>
              <div className="flex gap-2 mt-2">
                <Button asChild size="sm" className="flex-1">
                  <Link href={`/deck/${deck._id}`}>
                    <Edit className="w-4 h-4 mr-1" />
                    編集
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Play className="w-4 h-4 mr-1" />
                  使用
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={deletingDeckId === deck._id}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>デッキを削除しますか？</AlertDialogTitle>
                      <AlertDialogDescription>
                        「{deck.deck_name}」を削除します。この操作は取り消せません。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteDeck(deck._id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        削除
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
