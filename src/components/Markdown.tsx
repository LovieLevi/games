import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./Markdown.scss";

export const Markdown = ({ url }: { url: string }) => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const text = await response.text();
        setData(text);
      } catch (error: unknown) {
        try {
          const text = await (error as Response).text();
          setError(text);
        } catch {
          console.error("Error fetching data: ", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [data, loading, error, url]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error != "" || data == "") {
    return (
      <>
        <div>Error loading data:</div>
        <code>{error}</code>
      </>
    );
  }

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown">
      {data}
    </ReactMarkdown>
  );
};
