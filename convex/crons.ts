import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// フェーズ自動遷移を5秒ごとに実行
crons.interval("auto-advance-phases", { seconds: 5 }, api.battle.autoAdvancePhasesCron);

export default crons;
