"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import * as React from "react";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { retrieve } from "@/lib/server-actions";
import { DocumentPlain } from "@/lib/types";

const questionSchema = z.object({
  text: z
    .string()
    .min(1, "Question is required")
    .max(200, "Question must be 200 characters or less"),
});

const formSchema = z.object({
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required"),
});

export default function DynamicQuestionForm() {
  const [response, setResponse] = React.useState<DocumentPlain[][] | string>(
    ""
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questions: [{ text: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResponse("");

    const data = await retrieve(
      values.questions.map((question) => question.text)
    );

    setResponse(data);
    setIsLoading(false);
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Dynamic Question Form</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`questions.${index}.text`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex justify-between items-center">
                        Question {index + 1}
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="h-8 px-2 lg:px-3"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove question</span>
                          </Button>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your question" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ text: "" })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="flex flex-col items-start">
          <div className="mb-2 text-lg font-semibold">Response</div>
          <Textarea
            value={
              typeof response === "string"
                ? response
                : JSON.stringify(response, null, 2)
            }
            readOnly
            className="w-full h-64 font-mono"
            placeholder="JSON response will appear here after submission"
          />
        </CardFooter>
      </Card>
    </div>
  );
}
