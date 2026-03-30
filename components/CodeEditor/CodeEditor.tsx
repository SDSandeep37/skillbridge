import { Editor } from "@monaco-editor/react";
import "./editor.css";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/libarary/socket";
import throttle from "lodash/throttle";
import { useAuth } from "@/Context/Context";
import AuthDashboard from "../AuthDashboard/AuthDashboard";
import Link from "next/link";

const CodeEditor = ({ sessionId }: { sessionId: any }) => {
  const [code, setCode] = useState("//start coding...");
  const [language, setLanguage] = useState("javascript");
  const { user, loading } = useAuth();

  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/${sessionId}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setMessages(data);
      }
    };

    fetchMessages();
  }, [sessionId]);
  //get code if exist , help in rejoining session
  useEffect(() => {
    async function getCode() {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/codesnap/${sessionId}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (result.ok) {
        const codes = await result.json();
        setCode(codes);
      }
    }
    getCode();
  }, [sessionId]);

  // other user remote change , used to prevent infinte loop while typing in code editor
  const isRemoteChange = useRef(false);
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const iceCandidateQueue = useRef<RTCIceCandidate[]>([]);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);
  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };
  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  // throttle socket emit
  const sendChange = useRef(
    throttle((value: string) => {
      socket.emit("code-change", { sessionId, code: value });
    }, 1000),
  ).current;

  // const sendCursor = throttle((data) => {
  //   socket.emit("cursor-move", data);
  // }, 300);
  const sendCursor = useRef(
    throttle((data) => {
      socket.emit("cursor-move", data);
    }, 300),
  ).current;
  useEffect(() => {
    socket.connect();
    socket.emit("join-session", sessionId);
    socket.on("code-update", (newCode) => {
      isRemoteChange.current = true;
      setCode(newCode);
    });
    socket.on("cursor-update", ({ name, lineNumber, column }) => {
      if (!editorRef.current) return;

      const editor = editorRef.current;
      const monaco = (window as any).monaco;

      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
        {
          range: new monaco.Range(lineNumber, column, lineNumber, column),
          options: {
            className: "remote-cursor",
            hoverMessage: { value: name },
          },
        },
      ]);
    });
    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    //cleaning socket
    return () => {
      socket.off("code-update");
      socket.off("cursor-update");
      socket.off("receive-message");
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

  // for cursor sync
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    editor.onDidChangeCursorPosition((event: any) => {
      const position = event.position;
      sendCursor({
        sessionId,
        name: user?.name,
        lineNumber: position.lineNumber,
        column: position.column,
        senderId: socket.id,
      });
      // socket.emit("cursor-move", {
      //   sessionId,
      //   name: user?.name,
      //   lineNumber: position.lineNumber,
      //   column: position.column,
      //   senderId: socket.id,
      // });
    });
  };
  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const messageData = {
      sessionId,
      sender_id: user?.id,
      message: messageInput,
    };

    socket.emit("send-message", messageData);

    setMessageInput("");
  };
  // video call
  useEffect(() => {
    const startVideoCall = async () => {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      localStream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, localStream);
      });

      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            sessionId,
            candidate: event.candidate,
          });
        }
      };
      // socket.on("video-offer", async (data) => {
      //   if (data.sessionId !== sessionId) return;
      //   await peerConnection.current?.setRemoteDescription(
      //     new RTCSessionDescription(data.offer),
      //   );
      //   const answer = await peerConnection.current?.createAnswer();
      //   await peerConnection.current?.setLocalDescription(answer!);
      //   socket.emit("video-answer", {
      //     sessionId,
      //     answer,
      //   });
      // });
      socket.on("video-offer", async (data) => {
        if (data.sessionId !== sessionId) return;

        await peerConnection.current?.setRemoteDescription(
          new RTCSessionDescription(data.offer),
        );

        // flush queued ICE candidates
        for (const candidate of iceCandidateQueue.current) {
          await peerConnection.current?.addIceCandidate(candidate);
        }
        iceCandidateQueue.current = [];

        const answer = await peerConnection.current?.createAnswer();
        await peerConnection.current?.setLocalDescription(answer!);

        socket.emit("video-answer", {
          sessionId,
          answer,
        });
      });
      // socket.on("video-answer", async (data) => {
      //   if (data.sessionId !== sessionId) return;
      //   await peerConnection.current?.setRemoteDescription(
      //     new RTCSessionDescription(data.answer),
      //   );
      // });
      socket.on("video-answer", async (data) => {
        if (data.sessionId !== sessionId) return;

        await peerConnection.current?.setRemoteDescription(
          new RTCSessionDescription(data.answer),
        );

        // flush queued ICE candidates
        for (const candidate of iceCandidateQueue.current) {
          await peerConnection.current?.addIceCandidate(candidate);
        }
        iceCandidateQueue.current = [];
      });
      socket.on("ice-candidate", async (data) => {
        if (data.sessionId !== sessionId) return;
        try {
          // await peerConnection.current?.addIceCandidate(
          //   new RTCIceCandidate(data.candidate),
          // );
          const candidate = new RTCIceCandidate(data.candidate);

          if (peerConnection.current?.remoteDescription) {
            await peerConnection.current.addIceCandidate(candidate);
          } else {
            iceCandidateQueue.current.push(candidate);
          }
        } catch (e) {
          console.error("Error adding received ice candidate", e);
        }
      });
    };
    startVideoCall();
    return () => {
      socket.off("video-offer");
      socket.off("video-answer");
      socket.off("ice-candidate");
      peerConnection.current?.close();
    };
  }, [sessionId]);
  const startCall = async () => {
    const offer = await peerConnection.current?.createOffer();
    await peerConnection.current?.setLocalDescription(offer!);
    socket.emit("video-offer", {
      sessionId,
      offer,
    });
  };
  return (
    <AuthDashboard>
      <div className="one__on__one">
        <div className="editor__container">
          <Link href="/dashboard">
            <button
              style={{ marginTop: "10px" }}
              className="text-left cursor-pointer bg-red-500 hover:bg-red-800"
            >
              Leave Session
            </button>
          </Link>
          <h1 className="text-center text-2xl text-white font-bold">
            Code editor
          </h1>
          <div className="editor__language">
            <label>Select Language</label>
            <select onChange={(e) => setLanguage(e.target.value)}>
              <option value="javascript">JavaScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>
          <div className="editor">
            <Editor
              height="540px"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={handleCodeChange}
              onMount={handleEditorDidMount}
            />
          </div>
        </div>
        <div className="chat__video-call">
          <div className="chatroom">
            <div className="chatroom__header">
              <h1 className="chatroom__header-heading">Chat Box</h1>
            </div>
            <div className="chatroom__messagebox" ref={chatBoxRef}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chatroom__message ${
                    msg.name === user?.name ? "outgoing" : "incoming"
                  }`}
                >
                  <div className="message__details">
                    <p>{msg.sender_id === user?.id ? "You" : msg.name}</p>
                    <span>{new Date(msg.created_at).toLocaleTimeString()}</span>
                  </div>

                  <div className="message">{msg.message}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="chatroom__send-options">
              <input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type message here"
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
          <div className="video__call">
            <div className="video">
              <video ref={localVideoRef} autoPlay muted playsInline />
              <video ref={remoteVideoRef} autoPlay playsInline />
            </div>

            <button
              className="cursor-pointer bg-green-400 hover:bg-green-700"
              onClick={startCall}
            >
              Start Call
            </button>
          </div>
        </div>
      </div>
    </AuthDashboard>
  );
};

export default CodeEditor;
