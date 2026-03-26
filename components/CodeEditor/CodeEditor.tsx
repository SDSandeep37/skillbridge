import { Editor } from "@monaco-editor/react";
import "./editor.css";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/libarary/socket";
import throttle from "lodash/throttle";

const CodeEditor = ({ sessionId }: { sessionId: any }) => {
  const [code, setCode] = useState("//start coding...");
  const [language, setLanguage] = useState("javascript");

  // other user remote change , used to prevent infinte loop while typing in code editor
  const isRemoteChange = useRef(false);
  // throttle socket emit
  const sendChange = useRef(
    throttle((value: string) => {
      socket.emit("code-change", { sessionId, code: value });
    }, 2000),
  ).current;
  useEffect(() => {
    socket.connect();
    socket.emit("join-session", sessionId);
    socket.on("code-update", (newCode) => {
      isRemoteChange.current = true;
      setCode(newCode);
    });
    //cleaning socket
    return () => {
      socket.off("code-update");
      socket.disconnect();
    };
  }, [sessionId]);

  // //send changes in each 500ms
  // const sendChange = throttle((value: string) => {
  //   socket.emit("code-change", { sessionId, code: value });
  // }, 5000);

  //handleCodeChange function
  const handleCodeChange = (value: string | undefined) => {
    if (!value) {
      console.log("No code");
      return;
    }
    // prevent infinite loop
    if (isRemoteChange.current) {
      isRemoteChange.current = false;
      return;
    }
    setCode(value);
    sendChange(value);
  };
  return (
    <div className="editor">
      <h1 className="text-center text-2xl text-white font-bold">Code editor</h1>
      <div className="editor__language">
        <label>Select Language</label>
        <select onChange={(e) => setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
      </div>

      <Editor
        height="500px"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={handleCodeChange}
      />
    </div>
  );
};

export default CodeEditor;
