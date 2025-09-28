import { useEffect, useState } from "react";

type connectionType<T> = {
  success: boolean;
  data: T;
};

export default function App() {
  const [connection, setConnection] = useState<connectionType<string>>();
  useEffect(() => {
    async function testConnection() {
      try {
        const response = await fetch("http://localhost:5000/api/test");
        if (!response.ok) {
          throw new Error("Fail to fetch!");
        }

        const data = await response.json();
        setConnection(data);
      } catch (err) {
        console.error(err);
      }
    }
    testConnection();
  }, []);

  return (
    <main className="h-full min-h-screen w-full bg-background">
      <h1 className="text-2xl font-bold text-primary mb-6">Hello World!</h1>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Testing Connection</h2>
        <div className="flex gap-2 items-center">
          {connection?.success ? (
            <>
              <div className="w-4 h-4 rounded-full border bg-emerald-400"></div>
              <p className="font-medium text-lg">Connection Successfully</p>
            </>
          ) : (
            <>
              <div className="w-4 h-4 rounded-full border bg-rose-400"></div>
              <p className="font-medium text-lg">Fail to connect</p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
