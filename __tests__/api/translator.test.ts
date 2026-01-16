/**
 * @jest-environment node
 */
import { POST } from "@/app/api/translate/route";
import { NextRequest } from "next/server";

// Mock the service
jest.mock("@/lib/ai/translator", () => ({
  translateText: jest.fn().mockResolvedValue("Olá Mundo"),
  TranslatorInputSchema: {
    safeParse: jest.fn((data) => {
        if (!data.text || !data.targetLanguage) {
             return { success: false, error: { flatten: () => "Invalid" } };
        }
        return { success: true, data };
    }),
  }
}));

describe("Translator API", () => {
  it("should return 200 and translation", async () => {
    const req = new NextRequest("http://localhost/api/translate", {
      method: "POST",
      body: JSON.stringify({ text: "Hello World", targetLanguage: "Portuguese" }),
    });

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ translation: "Olá Mundo" });
  });

  it("should return 400 on invalid input", async () => {
     const req = new NextRequest("http://localhost/api/translate", {
      method: "POST",
      body: JSON.stringify({ text: "" }), // Missing targetLanguage
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });
});
