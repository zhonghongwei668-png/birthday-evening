import type { Metadata } from "next";
import { BirthdayInvitation } from "@/components/invitation/BirthdayInvitation";

export const metadata: Metadata = {
  title: "A Little Birthday Evening",
  description:
    "一份关于生日晚餐的小小计划。选一个舒服的晚上，一起吃顿好饭。",
};

export default function Home() {
  return <BirthdayInvitation />;
}
