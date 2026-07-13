import type {
  DinnerStyle,
  InvitationAnswers,
  InvitationQuestion,
} from "@/components/invitation/types";

export const RECIPIENT_NAME = "XXX";

export const INITIAL_ANSWERS: InvitationAnswers = {
  pauseDay: "",
  dinnerKeyword: "",
  memory: "",
  birthdayPriority: "",
  date: "",
  time: "",
  dinnerStyle: "",
  meetingWay: "",
};

export const QUESTIONS: readonly InvitationQuestion[] = [
  {
    id: "pauseDay",
    marker: "A SMALL PAUSE",
    prompt: "如果生日当天可以暂停烦恼一天，\n你更想：",
    options: [
      { icon: "☕", value: "找一家舒服的店坐很久", label: "找一家舒服的店坐很久" },
      { icon: "🌆", value: "去一个没去过的地方走走", label: "去一个没去过的地方走走" },
      { icon: "📖", value: "安静享受自己的时间", label: "安静享受自己的时间" },
      { icon: "🍽", value: "和朋友吃一顿好饭", label: "和朋友吃一顿好饭" },
    ],
  },
  {
    id: "dinnerKeyword",
    marker: "THE MOOD",
    prompt: "如果这顿生日晚餐有一个关键词，\n你希望是：",
    options: [
      { icon: "✨", value: "惊喜", label: "惊喜" },
      { icon: "🍷", value: "放松", label: "放松" },
      { icon: "📷", value: "好看", label: "好看" },
      { icon: "💬", value: "聊很多话", label: "聊很多话" },
    ],
  },
  {
    id: "memory",
    marker: "A MEMORY",
    prompt: "如果未来回想今年某个瞬间，\n你希望记住：",
    options: [
      { icon: "📷", value: "一张照片", label: "一张照片" },
      { icon: "🍽", value: "一顿特别的饭", label: "一顿特别的饭" },
      { icon: "🌆", value: "一段旅程", label: "一段旅程" },
      { icon: "✨", value: "一个突然开心的小瞬间", label: "一个突然开心的小瞬间" },
    ],
  },
  {
    id: "birthdayPriority",
    marker: "ONE THING",
    prompt: "生日当天，\n你觉得最重要的是：",
    options: [
      { icon: "A", value: "好吃", label: "好吃" },
      { icon: "B", value: "好聊", label: "好聊" },
      { icon: "C", value: "好看的环境", label: "好看的环境" },
      { icon: "D", value: "有一点小惊喜", label: "有一点小惊喜" },
    ],
  },
] as const;

export const TIME_OPTIONS = ["17:30", "18:00", "18:30", "19:00"] as const;

export const DINNER_STYLES: readonly DinnerStyle[] = [
  {
    id: "elegant",
    index: "01",
    title: "Elegant Night",
    subtitle: "安静高级",
    description: "适合慢慢聊天",
  },
  {
    id: "cozy",
    index: "02",
    title: "Cozy Dinner",
    subtitle: "温暖舒服",
    description: "像老朋友见面",
  },
  {
    id: "surprise",
    index: "03",
    title: "Surprise Choice",
    subtitle: "地点交给安排",
    description: "保留一点未知",
  },
] as const;

export const MEETING_OPTIONS = [
  { icon: "🚕", value: "我们约地方见面", label: "我们约地方见面" },
  { icon: "🚗", value: "如果方便，我可以去接你", label: "如果方便，我可以去接你" },
  { icon: "🚇", value: "各自过去，到地方集合", label: "各自过去，到地方集合" },
  { icon: "🎁", value: "保留一点神秘感", label: "保留一点神秘感" },
] as const;

export const TOTAL_CHAPTERS = 8;
