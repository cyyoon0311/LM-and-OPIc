import "dotenv/config";
import express from "express";
import cors from "cors";
import { Client } from "@notionhq/client";
import type {
  DatabaseObjectResponse,
  QueryDataSourceResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

const app = express();
app.use(cors());
app.use(express.json());

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

// ─── Types ───────────────────────────────────────────────────────────────────

interface OPIcSentence {
  id: string;
  sentence: string;
  topic: string;
  level: string;
  category: string;
}

// ─── data_source_id 캐싱 ────────────────────────────────────────────────────

let cachedDataSourceId: string | null = null;

async function getDataSourceId(): Promise<string> {
  if (cachedDataSourceId) return cachedDataSourceId;

  // database_id로 DB를 조회하면 data_sources 배열이 포함됨
  const db = (await notion.databases.retrieve({
    database_id: DATABASE_ID,
  })) as DatabaseObjectResponse;

  console.log("\n===== DB data_sources =====");
  console.log(JSON.stringify(db.data_sources, null, 2));
  console.log("===========================\n");

  if (!db.data_sources?.length) {
    throw new Error("data_sources가 비어있습니다. DB에 Integration이 연결되어 있는지 확인하세요.");
  }

  cachedDataSourceId = db.data_sources[0].id;
  return cachedDataSourceId;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseNotionPage(page: PageObjectResponse): OPIcSentence {
  const props = page.properties;

  const sentence =
    props["Sentence"]?.type === "title"
      ? props["Sentence"].title.map((t) => t.plain_text).join("")
      : "";

  const topic =
    props["Topic"]?.type === "rich_text"
      ? props["Topic"].rich_text.map((t) => t.plain_text).join("")
      : props["Topic"]?.type === "select"
        ? props["Topic"].select?.name ?? ""
        : "";

  const level =
    props["Level"]?.type === "rich_text"
      ? props["Level"].rich_text.map((t) => t.plain_text).join("")
      : props["Level"]?.type === "select"
        ? props["Level"].select?.name ?? ""
        : "";

  const category =
    props["Category"]?.type === "rich_text"
      ? props["Category"].rich_text.map((t) => t.plain_text).join("")
      : props["Category"]?.type === "select"
        ? props["Category"].select?.name ?? ""
        : "";

  return { id: page.id, sentence, topic, level, category };
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET /api/sentences?topic=Travel&level=IM2
app.get("/api/sentences", async (req, res) => {
  try {
    const dataSourceId = await getDataSourceId();
    const { topic, level } = req.query as { topic?: string; level?: string };

    const filters: any[] = [];
    if (topic) filters.push({ property: "Topic", rich_text: { equals: topic } });
    if (level) filters.push({ property: "Level", rich_text: { equals: level } });

    const queryOptions: any = { data_source_id: dataSourceId, page_size: 100 };
    if (filters.length === 1) queryOptions.filter = filters[0];
    else if (filters.length > 1) queryOptions.filter = { and: filters };

    // 새 API: notion.dataSources.query()
    const raw: QueryDataSourceResponse = await notion.dataSources.query(queryOptions);

    console.log("\n===== Notion RAW (첫 번째 결과) =====");
    console.log(JSON.stringify(raw.results[0], null, 2));
    console.log("=====================================\n");

    const sentences = raw.results
      .filter((page): page is PageObjectResponse => page.object === "page" && "properties" in page)
      .map(parseNotionPage);

    res.json({
      success: true,
      count: sentences.length,
      data: sentences,
      _raw_sample: raw.results[0] ?? null,
    });
  } catch (error: any) {
    console.error("Notion API Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      hint: "NOTION_TOKEN과 NOTION_DATABASE_ID를 .env에 확인하세요.",
    });
  }
});

// GET /api/raw-database — DB 스키마 + data_source 확인
app.get("/api/raw-database", async (_req, res) => {
  try {
    const db = (await notion.databases.retrieve({
      database_id: DATABASE_ID,
    })) as DatabaseObjectResponse;

    const dataSourceId = await getDataSourceId();
    const dataSource = await notion.dataSources.retrieve({
      data_source_id: dataSourceId,
    });

    res.json({
      success: true,
      database: {
        id: db.id,
        data_sources: db.data_sources,
      },
      dataSource,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`GET /api/sentences          — 문장 조회 (dataSources.query)`);
  console.log(`GET /api/sentences?topic=Travel&level=IM2 — 필터`);
  console.log(`GET /api/raw-database       — DB + DataSource 스키마 확인`);
});
