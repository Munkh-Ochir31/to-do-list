import { redirect } from "next/navigation";
import { TaskBoard } from "./components/TaskBoard";
import { getUser } from "./lib/dal";

export default async function Page() {
  // Тактик [Authorize]: page render-ийн өмнө DAL-аар session шалгана.
  // proxy.ts давхар хамгаалалт өгдөг ч defense-in-depth зарчмаар энд бас шалгав.
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  return <TaskBoard user={user} />;
}
