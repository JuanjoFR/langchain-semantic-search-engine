import DynamicQuestionForm from "@/components/DynamicQuestionForm";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <DynamicQuestionForm />
      </div>
    </main>
  );
}
