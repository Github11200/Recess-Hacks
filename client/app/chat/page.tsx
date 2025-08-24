"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message, Resume } from "@/lib/interfaces";
import React, { useState } from "react";
import Markdown from "markdown-to-jsx";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { jsPDF } from "jspdf";
import { MdTextRender } from "jspdf-md-renderer";
import parse from "html-react-parser";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import Link from "next/link";

function generateResumePDF(resume: Resume) {
  const doc = new jsPDF();

  // Header - Personal Info
  doc.setFontSize(18);
  doc.text(resume.personalInfo.name, 10, 20);

  doc.setFontSize(11);
  let personalInfo = [];
  personalInfo.push(`Email: ${resume.personalInfo.email}`)
  if (resume.personalInfo.phone)
    personalInfo.push(`Phone: ${resume.personalInfo.phone}`);
  if (resume.personalInfo.LinkedIn)
    personalInfo.push(`LinkedIn: ${resume.personalInfo.LinkedIn}`);
  if (resume.personalInfo.GitHub)
    personalInfo.push(`GitHub: ${resume.personalInfo.GitHub}`);
  if (resume.personalInfo.website)
    personalInfo.push(`Website: ${resume.personalInfo.website}`);
  let personalInfoLine = personalInfo.join(" | ");

  doc.text(personalInfoLine, 10, 30);

  let y = 41;

  // Skills
  if (resume.skills && resume.skills.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Skills", 10, y);
    y += 6;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(resume.skills.join(", "), 10, y);
    y += 10;
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Education", 10, y);
    y += 6;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    resume.education.forEach((ed) => {
      doc.text(
        `${ed.institution} - ${ed.degree}${ed.major ? ", " + ed.major : ""}`,
        10,
        y
      );
      y += 6;
      if (ed.location) {
        doc.text(`Location: ${ed.location}`, 10, y);
        y += 6;
      }
      if (ed.startDate || ed.endDate) {
        doc.text(`Period: ${ed.startDate || ""} - ${ed.endDate || ""}`, 10, y);
        y += 6;
      }
      if (ed.additionalDetails) {
        doc.text(`Details: ${ed.additionalDetails}`, 10, y);
        y += 6;
      }
      y += 4;
    });
  }

  // Experience
  if (resume.experience && resume.experience.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Experience", 10, y);
    y += 6;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    resume.experience.forEach((exp) => {
      doc.text(`${exp.jobTitle} at ${exp.companyName}`, 10, y);
      y += 6;
      if (exp.location) {
        doc.text(`Location: ${exp.location}`, 10, y);
        y += 6;
      }
      if (exp.startDate || exp.endDate) {
        doc.text(
          `Period: ${exp.startDate || ""} - ${exp.endDate || ""}`,
          10,
          y
        );
        y += 6;
      }
      doc.text("Responsibilities:", 10, y);
      y += 6;
      exp.responsibilities.forEach((resp) => {
        doc.text(`- ${resp}`, 14, y);
        y += 5;
      });
      y += 6;
    });
  }

  // Projects (optional)
  if (resume.projects && resume.projects.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Projects", 10, y);
    y += 6;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    resume.projects.forEach((proj) => {
      doc.text(proj.title, 10, y);
      y += 6;
      if (proj.description) {
        doc.text(`Description: ${proj.description}`, 10, y);
        y += 6;
      }
      if (proj.githubUrl) {
        doc.text(`GitHub: ${proj.githubUrl}`, 10, y);
        y += 6;
      }
      if (proj.demoUrl) {
        doc.text(`Demo: ${proj.demoUrl}`, 10, y);
        y += 6;
      }
      if (proj.additionalDetails) {
        doc.text(`Details: ${proj.additionalDetails}`, 10, y);
        y += 6;
      }
      y += 4;
    });
  }

  // Certifications (optional)
  if (resume.certifications && resume.certifications.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Certifications", 10, y);
    y += 6;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    resume.certifications.forEach((cert) => {
      doc.text(`- ${cert}`, 10, y);
      y += 5;
    });
    y += 6;
  }

  // Languages (optional)
  if (resume.languages && resume.languages.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Languages", 10, y);
    y += 6;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    resume.languages.forEach((lang) => {
      doc.text(`${lang.language} - ${lang.proficiency}`, 10, y);
      y += 5;
    });
    y += 6;
  }

  // Interests (optional)
  if (resume.interests && resume.interests.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Interests", 10, y);
    y += 6;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(resume.interests.join(", "), 10, y);
  }

  return doc.output("blob");
}

export default function Chat() {
  const data = [
    {
      company: "company",
      title: "title",
      link: "link",
      description: "description",
    },
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      sentBy: "llm",
      message:
        "Hey there! I'm a chatbot that can help you find jobs, create a resume and practice some interview questions! Let me know what you'd like to do.",
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const doc = new jsPDF();

  const callback = () => {
    if (currentMessage === "") return;
    setCurrentMessage("");
    let newArray: Message[] = [
      ...messages,
      {
        sentBy: "user",
        message: currentMessage,
      },
    ];
    setMessages(newArray);
    fetch("/api/sendMessage", {
      body: JSON.stringify(newArray),
      method: "POST",
    })
      .then((data) => data.json())
      .then((res: Message) => {
        if (res.message.includes("/table")) {
          console.log(res.message.substring(res.message.indexOf("[")));

          const data = JSON.parse(
            res.message.substring(
              res.message.indexOf("["),
              res.message.lastIndexOf("]") + 1
            )
          );
          console.log(data);
          setMessages([
            ...newArray,
            {
              sentBy: "llm",
              message: "",
              isJsxElement: true,
              jsxElement: <DataTable columns={columns} data={data} />,
            },
          ]);
        } else if (res.message.includes("{") && res.message.includes("}")) {
          console.log(res.message);
          const data = res.message.substring(
            res.message.indexOf("{"),
            res.message.lastIndexOf("}") + 1
          );

          const resume: Resume = JSON.parse(data);

          const generatedPDF = generateResumePDF(resume);
          setBlob(generatedPDF);
          setUrl(URL.createObjectURL(generatedPDF));
          setMessages([
            ...newArray,
            {
              sentBy: "llm",
              message: "",
              isJsxElement: true,
              jsxElement: (
                <Link href={URL.createObjectURL(generatedPDF)} className="ml-2">
                  <Button>Download PDF</Button>
                </Link>
              ),
            },
          ]);
          console.log("done");
        } else if (res.message.includes("/questions")) {
          console.log(res.message);
          const questions: string[] = JSON.parse(
            res.message.substring(res.message.indexOf("["))
          );
          setMessages([
            ...newArray,
            {
              sentBy: "llm",
              message: "",
              isJsxElement: true,
              jsxElement: (
                <div className="flex gap-2 flex-col">
                  {questions.map((question, index) => (
                    <div key={index}>
                      <p>{question}</p>
                      <Input
                        id={index.toString()}
                        type="text"
                        className="mt-2"
                        placeholder="Answer..."
                      />
                    </div>
                  ))}
                  <Button
                    className="mt-2"
                    onClick={(e) => {
                      e.preventDefault();
                      let questionsAndAnswers: {
                        question: string;
                        answer: string;
                      }[] = [];
                      for (let i = 0; i < questions.length; ++i)
                        questionsAndAnswers.push({
                          question: questions[i],
                          answer: document.querySelector(
                            `input[id="${i.toString()}"]`
                          ).value,
                        });

                      let questionsAndAnswersString = "";
                      for (let i = 0; i < questionsAndAnswers.length; ++i) {
                        questionsAndAnswersString +=
                          "\nQuestion: " + questionsAndAnswers[i].question;
                        questionsAndAnswersString +=
                          "\nAnswer: " + questionsAndAnswers[i].answer + "\n";
                      }

                      console.log(questionsAndAnswersString);
                      fetch("/api/feedback", {
                        body: JSON.stringify([
                          ...messages,
                          {
                            sentBy: "user",
                            message: questionsAndAnswersString,
                          },
                        ]),
                        method: "POST",
                      })
                        .then((data) => data.json())
                        .then((res) => {
                          console.log(res);
                          document.querySelector("p#feedback").innerHTML = res;
                        });
                    }}
                  >
                    Submit
                  </Button>
                  <p id="feedback" className="mt-2"></p>
                </div>
              ),
            },
          ]);
        } else setMessages([...newArray, res]);
      });
  };

  return (
    <div className="w-[50%] mx-auto flex flex-col items-center h-[100vh] gap-2 py-4">
      <div className="w-full h-full bg-[var(--card-primary)] rounded-[var(--radius)] overflow-y-scroll p-4 border-1 border-gray">
        {messages.map((messageObject, index) => {
          return (
            <div
              key={index}
              className={`p-2 ${
                messageObject.sentBy === "llm"
                  ? "bg-[var(--secondary)]"
                  : "border-1 border-gray"
              } rounded-[var(--radius)] ${index !== 0 && "mt-2"}`}
            >
              {messageObject.sentBy === "llm" ? "Assistant" : "User"}:{" "}
              {messageObject.isJsxElement
                ? messageObject.jsxElement
                : messageObject.message}
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 w-full">
        <Input
          type="text"
          placeholder="Message..."
          value={currentMessage}
          onChange={(e) => {
            e.preventDefault();
            setCurrentMessage(e.target.value);
          }}
          onKeyUp={(e) => {
            e.preventDefault();
            if (e.key === "Enter") callback();
          }}
        />
        <Button
          onClick={() => {
            callback();
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
