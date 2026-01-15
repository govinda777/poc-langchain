/**
 * @jest-environment node
 */
import { POST } from "../route";
import { summarizeText } from "@/lib/ai/summarizer";
import { NextResponse } from "next/server";

jest.mock("@/lib/ai/summarizer");

describe("POST /api/summarize", () => {
  const mockSummarizeText = summarizeText as jest.Mock;

  beforeEach(() => {
    mockSummarizeText.mockReset();
  });

  it("should return summary on success", async () => {
    mockSummarizeText.mockResolvedValue("Summary");

    const request = new Request("http://localhost/api/summarize", {
        method: "POST",
        body: JSON.stringify({ text: "Content" })
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ summary: "Summary" });
  });

  it("should return 400 if text is missing", async () => {
    const request = new Request("http://localhost/api/summarize", {
        method: "POST",
        body: JSON.stringify({ })
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
