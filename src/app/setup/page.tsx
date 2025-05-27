"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useKarutaGame } from "@/hooks/use-karuta-game";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect } from "react";

const deckSchema = z.object({
  readings: z.string().min(1, "Please enter at least one reading.").refine(
    (val) => val.trim().split('\n').filter(line => line.trim() !== '').length > 0,
    { message: "Please enter at least one valid reading." }
  ),
});

type DeckFormData = z.infer<typeof deckSchema>;

export default function SetupPage() {
  const { deck, saveDeck, isLoading, loadDeck } = useKarutaGame();

  const form = useForm<DeckFormData>({
    resolver: zodResolver(deckSchema),
    defaultValues: {
      readings: "",
    },
  });

  useEffect(() => {
    if (!isLoading && deck.length > 0) {
      form.reset({ readings: deck.join('\n') });
    } else if (!isLoading && deck.length === 0) {
       // Ensure form is cleared if deck becomes empty (e.g., after a bad save attempt elsewhere)
       form.reset({ readings: "" });
    }
  }, [deck, isLoading, form]);


  const onSubmit: SubmitHandler<DeckFormData> = (data) => {
    const newDeck = data.readings
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');
    saveDeck(newDeck);
  };

  return (
    <div className="flex flex-col items-center py-10">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">読み札の設定</CardTitle>
          <CardDescription>
            読み札のリストをここに書いて下さい。各改行が一枚の読み札分です。
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <FormField
                control={form.control}
                name="readings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="readings-textarea" className="text-lg">読み札</FormLabel>
                    <FormControl>
                      <Textarea
                        id="readings-textarea"
                        placeholder="読み札をここに入力して下さい。"
                        className="min-h-[250px] text-base  bg-background border-input focus:ring-primary"
                        {...field}
                        disabled={isLoading}
                        aria-describedby="readings-help"
                      />
                    </FormControl>
                    <p id="readings-help" className="text-sm text-muted-foreground mt-1">
                      各改行が一枚の読み札となります。
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={form.formState.isSubmitting || isLoading}>
                {form.formState.isSubmitting || isLoading ? "保存中..." : "保存する"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
