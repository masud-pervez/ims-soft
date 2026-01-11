import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, Star } from "lucide-react";

export function CustomerReviews() {
  return (
    <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 lg:col-span-12 xl:col-span-5">
      <CardHeader className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-[data-slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <CardTitle className="leading-none font-semibold relative">
          Customer Reviews
          <div className="absolute end-0 top-0">
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-md gap-1.5 px-3"
            >
              <span className="hidden md:inline">View All</span>{" "}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Based on 5,500 verified purchases
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6">
        <div className="grid space-y-4 lg:grid-cols-3 lg:space-y-0">
          <div className="flex flex-col items-center justify-center gap-2 lg:col-span-1">
            <div className="flex items-center gap-1">
              {[...Array(4)].map((_, i) => (
                <Star
                  key={i}
                  className="size-6 fill-yellow-400 text-yellow-400"
                />
              ))}
              <div className="relative size-6">
                <Star className="size-6 text-yellow-400 absolute inset-0" />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star className="size-6 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            </div>
            <div className="text-3xl font-bold">4.5</div>
            <div className="text-sm text-gray-500">out of 5</div>
          </div>
          <div className="w-full space-y-3 lg:col-span-2">
            {[
              { stars: 5, count: 4000, width: "72%" },
              { stars: 4, count: 2100, width: "38%" },
              { stars: 3, count: 800, width: "15%" },
              { stars: 2, count: 631, width: "11%" },
              { stars: 1, count: 344, width: "6%" },
            ].map((rating) => (
              <div key={rating.stars} className="flex items-center">
                <div className="w-8 text-sm font-medium">{rating.stars} ★</div>
                <div className="bg-muted mx-2 h-3 flex-1 overflow-hidden rounded-full">
                  <div
                    className={`h-full rounded-full ${
                      rating.stars >= 4
                        ? "bg-green-400"
                        : rating.stars === 3
                        ? "bg-yellow-400"
                        : "bg-red-400"
                    }`}
                    style={{ width: rating.width }}
                  />
                </div>
                <div className="text-muted-foreground w-12 text-right text-sm font-medium">
                  {rating.count}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <div className="bg-muted rounded-lg border p-4">
            <div className="mb-2 flex flex-col items-start justify-between md:flex-row">
              <div>
                <div className="mb-1 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <h4 className="font-medium">Exceeded my expectations!</h4>
              </div>
              <div className="text-muted-foreground text-xs">
                March 12, 2025
              </div>
            </div>
            <p className="text-muted-foreground mb-3 text-sm">
              I was skeptical at first, but this product has completely changed
              my daily routine. The quality is outstanding and {"it's"} so easy
              to use.
            </p>
            <div className="flex items-center text-xs">
              <span className="font-medium">Sarah J.</span>
              <span className="ml-2 rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-white">
                Verified Purchase
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
