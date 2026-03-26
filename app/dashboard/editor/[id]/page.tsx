"use client";
import AuthDashboard from "@/components/AuthDashboard/AuthDashboard";
import CodeEditor from "@/components/CodeEditor/CodeEditor";

import { useParams } from "next/navigation";
const EditorPage = () => {
  const params = useParams();
  const sessionId = params.id;
  return (
    <AuthDashboard>
      <div>
        <CodeEditor sessionId={sessionId} />
      </div>
    </AuthDashboard>
  );
};

export default EditorPage;
