import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function SocialLogin() {
  return (
    <div className="space-y-3 shrink-0">
      <Button
        type="button"
        variant="outline"
        className="w-full bg-black dark:bg-white text-white dark:text-black py-3 h-auto rounded-full gap-3 font-medium border-0 hover:bg-black hover:text-white hover:opacity-90 dark:hover:bg-white dark:hover:text-black transition-opacity"
      >
        <Icons.Apple />
        <span>Sign up with Apple</span>
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-200 py-3 h-auto rounded-full gap-3 font-medium hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-zinc-700 dark:hover:text-gray-200 transition-colors"
      >
        <Icons.Google />
        <span>Sign up with Google</span>
      </Button>
    </div>
  );
}
