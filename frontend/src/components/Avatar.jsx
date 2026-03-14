export default function Avatar({ user, size = "md" }) {
  const classes = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <img
      src={
        user?.avatar_url ||
        `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(user?.username || "anon")}`
      }
      alt={user?.username || "avatar"}
      className={`${classes} rounded-full border-2 border-white bg-white object-cover shadow`}
    />
  );
}
