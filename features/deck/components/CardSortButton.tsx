"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, SortAsc } from "lucide-react";
import { useState } from "react";

export type SortOption = "cardNumber" | "name" | "acquired";

interface CardSortButtonProps {
  onSortChange: (sortOption: SortOption) => void;
  currentSort: SortOption;
}

export const CardSortButton = ({ onSortChange, currentSort }: CardSortButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: "cardNumber" as const, label: "カード番号順" },
    { value: "name" as const, label: "カード名順" },
    { value: "acquired" as const, label: "入手順" },
  ];

  const getSortIcon = (sortOption: SortOption) => {
    switch (sortOption) {
      case "cardNumber":
        return "🔢";
      case "name":
        return "📝";
      case "acquired":
        return "📅";
      default:
        return "🔢";
    }
  };

  const getCurrentSortLabel = () => {
    const currentOption = sortOptions.find((option) => option.value === currentSort);
    return currentOption ? currentOption.label : "カード番号順";
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2" title="並び替え">
          <ArrowUpDown className="w-4 h-4" />
          <span className="hidden sm:inline">{getSortIcon(currentSort)}</span>
          <span className="hidden md:inline text-xs">{getCurrentSortLabel()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => {
              onSortChange(option.value);
              setIsOpen(false);
            }}
            className="flex items-center gap-2"
          >
            <span>{getSortIcon(option.value)}</span>
            <span>{option.label}</span>
            {currentSort === option.value && <SortAsc className="w-4 h-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
