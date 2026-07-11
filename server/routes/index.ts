import { Router } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();

// API 路由示例
router.get('/api/hello', (req, res) => {
  res.json({
    message: 'Hello from Express + Vite!',
    timestamp: new Date().toISOString(),
  });
});

router.post('/api/data', (req, res) => {
  const requestData = req.body;
  res.json({
    success: true,
    data: requestData,
    receivedAt: new Date().toISOString(),
  });
});

// 健康检查接口
router.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    env: process.env.COZE_PROJECT_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ========== 访问计数器 ==========
const DATA_DIR = path.join(__dirname, '..', 'data');
const VISITS_FILE = path.join(DATA_DIR, 'visits.json');

interface VisitData {
  totalVisits: number;
  dailyVisits: Record<string, number>; // YYYY-MM-DD -> count
}

function getVisitData(): VisitData {
  try {
    if (fs.existsSync(VISITS_FILE)) {
      return JSON.parse(fs.readFileSync(VISITS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('读取访问数据失败:', e);
  }
  return { totalVisits: 0, dailyVisits: {} };
}

function saveVisitData(data: VisitData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(VISITS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('保存访问数据失败:', e);
  }
}

// GET /api/visits — 获取当前访问统计
router.get('/api/visits', (_req, res) => {
  const data = getVisitData();
  const today = new Date().toISOString().split('T')[0];
  res.json({
    total: data.totalVisits,
    today: data.dailyVisits[today] || 0,
  });
});

// POST /api/visits — 记录一次访问（自动去重：同 IP 每小时只计一次）
const recentVisitors = new Set<string>();

router.post('/api/visits', (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const hourKey = new Date().toISOString().slice(0, 13); // YYYY-MM-DDTHH
  const visitorKey = `${ip}:${hourKey}`;

  // 同一 IP 在同一个小时内已计过，不再重复
  if (recentVisitors.has(visitorKey)) {
    const data = getVisitData();
    const today = new Date().toISOString().split('T')[0];
    res.json({ total: data.totalVisits, today: data.dailyVisits[today] || 0, deduped: true });
    return;
  }

  recentVisitors.add(visitorKey);
  // 定期清理，避免内存泄漏（保留最近 24 小时的 key）
  if (recentVisitors.size > 10000) {
    const keys = Array.from(recentVisitors);
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    recentVisitors.clear();
    for (const k of keys) {
      const hour = parseInt(k.split(':').pop()?.slice(11, 13) || '0', 10);
      if (hour >= new Date(cutoff).getHours()) recentVisitors.add(k);
    }
  }

  const data = getVisitData();
  const today = new Date().toISOString().split('T')[0];

  data.totalVisits += 1;
  data.dailyVisits[today] = (data.dailyVisits[today] || 0) + 1;

  saveVisitData(data);

  res.json({ total: data.totalVisits, today: data.dailyVisits[today], deduped: false });
});

export default router;
