import ToolInfo from "../../components/ToolInfo";
import { toolMetadata } from "../../lib/seo";

// Page title, description and social tags for this tool (the page itself is a client component).
export const metadata = toolMetadata("word-counter");

export default function Layout({ children }) {
  return (
    <>
      {children}
      <ToolInfo slug="word-counter" />
    </>
  );
}
