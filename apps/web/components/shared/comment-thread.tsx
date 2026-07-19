import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Comment {
  id: string;
  body: string;
  isInternal: boolean;
  createdAt: string;
  author: { name: string };
}

export function CommentThread({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No comments yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className={`flex gap-3 rounded-lg border p-3 ${
            comment.isInternal
              ? "border-high/30 bg-high/5"
              : "border-border bg-card"
          }`}
        >
          <Avatar className="size-8 shrink-0">
            <AvatarFallback>
              {comment.author.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {comment.author.name}
              </span>
              {comment.isInternal && (
                <Badge
                  variant="outline"
                  className="border-high/30 text-high text-xs"
                >
                  Internal
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-foreground">{comment.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
