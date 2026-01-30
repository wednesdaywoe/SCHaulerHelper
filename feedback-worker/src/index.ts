/**
 * Hauler Helper Feedback Worker
 *
 * Receives feedback form submissions and sends formatted emails via Resend.
 * Deploy: `npx wrangler deploy`
 * Secrets: `npx wrangler secret put RESEND_API_KEY` and `npx wrangler secret put FEEDBACK_EMAIL`
 */

interface Env {
  RESEND_API_KEY: string;
  FEEDBACK_EMAIL: string;
}

interface MissionCommodity {
  commodity: string;
  pickup: string;
  destination: string;
  quantity: number;
  maxBoxSize?: number;
}

interface Mission {
  missionNumber: number;
  missionId: string;
  payout: number;
  commodities: MissionCommodity[];
}

interface AppContext {
  page: string;
  ship?: string;
  system?: string;
  category?: string;
  theme?: string;
  missionCount?: number;
  missions?: Mission[];
  processedImages?: number;
}

interface FeedbackPayload {
  type: 'bug' | 'suggestion' | 'other';
  description: string;
  spectrumHandle?: string;
  appContext?: AppContext;
  userAgent: string;
  timestamp: string;
}

const ALLOWED_ORIGINS = [
  'https://wednesdaywoe.github.io',
  'http://localhost:3000',
  'http://localhost:5173',
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin && ALLOWED_ORIGINS.some(o => origin.startsWith(o));
  return {
    'Access-Control-Allow-Origin': allowed ? origin! : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildEmailHtml(payload: FeedbackPayload): string {
  const typeLabel: Record<string, string> = {
    bug: 'Bug Report',
    suggestion: 'Feature Suggestion',
    other: 'General Feedback',
  };

  const typeColor: Record<string, string> = {
    bug: '#ef4444',
    suggestion: '#3b82f6',
    other: '#8b5cf6',
  };

  const label = typeLabel[payload.type] || 'Feedback';
  const color = typeColor[payload.type] || '#8b5cf6';

  let contextHtml = '';
  if (payload.appContext) {
    const ctx = payload.appContext;
    const rows: string[] = [];
    rows.push(`<tr><td style="color: #64748b; padding: 4px 8px;">Page</td><td style="color: #e2e8f0; padding: 4px 8px;">${escapeHtml(ctx.page)}</td></tr>`);
    if (ctx.ship) rows.push(`<tr><td style="color: #64748b; padding: 4px 8px;">Ship</td><td style="color: #e2e8f0; padding: 4px 8px;">${escapeHtml(ctx.ship)}</td></tr>`);
    if (ctx.system) rows.push(`<tr><td style="color: #64748b; padding: 4px 8px;">System</td><td style="color: #e2e8f0; padding: 4px 8px;">${escapeHtml(ctx.system)}</td></tr>`);
    if (ctx.category) rows.push(`<tr><td style="color: #64748b; padding: 4px 8px;">Category</td><td style="color: #e2e8f0; padding: 4px 8px;">${escapeHtml(ctx.category)}</td></tr>`);
    if (ctx.missionCount !== undefined) rows.push(`<tr><td style="color: #64748b; padding: 4px 8px;">Missions</td><td style="color: #e2e8f0; padding: 4px 8px;">${ctx.missionCount}</td></tr>`);
    if (ctx.processedImages !== undefined) rows.push(`<tr><td style="color: #64748b; padding: 4px 8px;">Processed Images</td><td style="color: #e2e8f0; padding: 4px 8px;">${ctx.processedImages}</td></tr>`);
    if (ctx.theme) rows.push(`<tr><td style="color: #64748b; padding: 4px 8px;">Theme</td><td style="color: #e2e8f0; padding: 4px 8px;">${escapeHtml(ctx.theme)}</td></tr>`);

    contextHtml = `
      <h3 style="color: #94a3b8; margin-top: 16px;">App Context</h3>
      <table style="width: 100%; border-collapse: collapse;">
        ${rows.join('\n        ')}
      </table>`;

    // Add mission details if present
    if (ctx.missions && ctx.missions.length > 0) {
      const missionRows = ctx.missions.map(m => {
        const commodityList = m.commodities.map(c =>
          `${escapeHtml(c.commodity)}: ${c.quantity} SCU (${escapeHtml(c.pickup)} → ${escapeHtml(c.destination)})`
        ).join('<br/>');
        return `
          <tr style="border-bottom: 1px solid #334155;">
            <td style="color: #64748b; padding: 8px; vertical-align: top;">Mission ${m.missionNumber}</td>
            <td style="color: #e2e8f0; padding: 8px;">
              <div style="color: #fbbf24; margin-bottom: 4px;">${m.payout.toLocaleString()} aUEC</div>
              <div style="font-size: 12px;">${commodityList}</div>
            </td>
          </tr>`;
      }).join('\n');

      contextHtml += `
        <h3 style="color: #94a3b8; margin-top: 16px;">Mission Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${missionRows}
        </table>`;
    }
  }

  let contactHtml = '';
  if (payload.spectrumHandle) {
    contactHtml = `
      <h3 style="color: #94a3b8; margin-top: 16px;">Spectrum Handle</h3>
      <p style="color: #60a5fa;">${escapeHtml(payload.spectrumHandle)}</p>`;
  }

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: ${color}; color: white; padding: 12px 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0; font-size: 18px;">${label}</h2>
      </div>
      <div style="background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 0 0 8px 8px;">
        <h3 style="color: #94a3b8; margin-top: 0;">Description</h3>
        <p style="white-space: pre-wrap; line-height: 1.5;">${escapeHtml(payload.description)}</p>
        ${contactHtml}
        ${contextHtml}
        <hr style="border: none; border-top: 1px solid #334155; margin: 16px 0;" />
        <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">
          Sent: ${escapeHtml(payload.timestamp)}<br/>
          UA: ${escapeHtml(payload.userAgent)}
        </p>
      </div>
    </div>`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');
    const corsHeaders = getCorsHeaders(origin);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate origin in production
    const isAllowed = origin && ALLOWED_ORIGINS.some(o => origin.startsWith(o));
    if (!isAllowed) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let payload: FeedbackPayload;
    try {
      payload = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate required fields
    if (!payload.description?.trim() || !payload.type) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!['bug', 'suggestion', 'other'].includes(payload.type)) {
      return new Response(JSON.stringify({ error: 'Invalid feedback type' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Truncate description to prevent abuse
    const description = payload.description.substring(0, 5000);
    const subject = `[Hauler Helper] ${payload.type}: ${description.substring(0, 60)}${description.length > 60 ? '...' : ''}`;

    try {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Hauler Helper <onboarding@resend.dev>',
          to: env.FEEDBACK_EMAIL,
          subject,
          html: buildEmailHtml({ ...payload, description }),
        }),
      });

      if (!resendResponse.ok) {
        const error = await resendResponse.text();
        console.error('Resend error:', error);
        return new Response(JSON.stringify({ error: 'Failed to send feedback' }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Worker error:', err);
      return new Response(JSON.stringify({ error: 'Internal error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
