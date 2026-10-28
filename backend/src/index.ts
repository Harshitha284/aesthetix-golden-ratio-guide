import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for Flutter Web requests
app.use('/*', cors());

// Health check
app.get('/', (c) => {
  return c.json({
    status: 'online',
    app: 'UMAX AI Looksmaxxing Backend',
    framework: 'Hono on Cloudflare Workers',
    database: 'Cloudflare D1',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Initialize / Sync user
app.post('/api/user/init', async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const userId = body.userId || 'user_' + Math.random().toString(36).substring(2, 9);
    const username = body.username || 'Maxxer_' + Math.floor(1000 + Math.random() * 9000);

    const existing = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();

    if (!existing) {
      await c.env.DB.prepare(`
        INSERT INTO users (id, username, streak_days, last_active_date, overall_rating, potential_rating, tier)
        VALUES (?, ?, 1, DATE('now'), 0, 0, 'Rising Maxxer')
      `).bind(userId, username).run();

      // Seed default daily habits
      const defaultHabits = [
        { id: `h_${userId}_1`, title: 'Proper Tongue Posture (Mewing 24/7)', category: 'Face' },
        { id: `h_${userId}_2`, title: 'Cold Water Facial Plunge (Debloating)', category: 'Skin' },
        { id: `h_${userId}_3`, title: 'SPF 50+ Sunscreen Application', category: 'Skin' },
        { id: `h_${userId}_4`, title: 'Neck Bridges / Flexion (4x15)', category: 'Physique' },
        { id: `h_${userId}_5`, title: '3.5L Water Intake (Zero Sodium Retention)', category: 'Diet' },
        { id: `h_${userId}_6`, title: 'Mouth Taping for Deep Nasal Sleep', category: 'Sleep' },
      ];

      for (const habit of defaultHabits) {
        await c.env.DB.prepare(`
          INSERT INTO habits (id, user_id, title, category, completed)
          VALUES (?, ?, ?, ?, 0)
        `).bind(habit.id, userId, habit.title, habit.category).run();
      }
    }

    const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
    return c.json({ success: true, user });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Scan / Facial Looksmax Analysis
app.post('/api/analyze', async (c) => {
  try {
    const body = await c.req.json();
    const userId = body.userId || 'user_guest';
    const imagePreview = body.imagePreview || null;
    const gender = body.gender || 'male';
    const primaryGoal = body.primaryGoal || 'Jawline & Leanness';

    // Algorithmic Looksmax Evaluation
    // Deterministic yet realistic variance simulation
    const baseVariance = Math.random() * 6 - 3;
    const jawline = Math.round(Math.min(95, Math.max(60, 76 + baseVariance + (Math.random() * 8))));
    const cheekbones = Math.round(Math.min(96, Math.max(58, 74 + (Math.random() * 10))));
    const masculinity = Math.round(Math.min(98, Math.max(62, 79 + (Math.random() * 8))));
    const skinQuality = Math.round(Math.min(95, Math.max(55, 71 + (Math.random() * 12))));
    const canthalTilt = Math.round(Math.min(96, Math.max(60, 77 + (Math.random() * 9)))); // Positive tilt
    const hair = Math.round(Math.min(97, Math.max(58, 80 + (Math.random() * 8))));
    const symmetry = Math.round(Math.min(98, Math.max(65, 82 + (Math.random() * 7))));

    // Calculate Overall & Potential
    const overallScore = parseFloat(((jawline * 0.22 + cheekbones * 0.15 + masculinity * 0.18 + skinQuality * 0.15 + canthalTilt * 0.12 + hair * 0.10 + symmetry * 0.08)).toFixed(1));
    const potentialScore = parseFloat(Math.min(98.8, overallScore + 10 + Math.random() * 6).toFixed(1));

    let tier = 'High Tier Normie';
    if (overallScore >= 88) tier = 'God Tier Maxxer';
    else if (overallScore >= 82) tier = 'Chadlite';
    else if (overallScore >= 75) tier = 'High Tier Normie';
    else tier = 'Ascending Maxxer';

    const faceShapes = ['Square Diamond', 'Sharp Angular Oval', 'Rectangular Chiseled', 'Mesomorphic Heart'];
    const faceShape = faceShapes[Math.floor(Math.random() * faceShapes.length)];

    const archetypes = [
      'Hunter Eyes & High Zygomatic Arch Potential',
      'Hyper-Symmetric Angular Phenotype',
      'Mesomorphic Chiseled Jawline Profile',
      'Compact Midface & Dimorphic Jawline'
    ];
    const archetype = archetypes[Math.floor(Math.random() * archetypes.length)];

    const strengths = [
      `Superior Canthal Tilt (${canthalTilt}/100) — Positive almond eye alignment with zero scleral show.`,
      `Solid Gonial Angle & Chin Projection (${jawline}/100) — Distinct mandibular definition.`,
      `High Zygomaticus Cheekbone Prominence (${cheekbones}/100) — Strong midface support structure.`,
      `Impressive Facial Symmetry Index (${symmetry}/100) — High proportional balance along vertical axis.`
    ];

    const flaws = [
      `Subcutaneous Water Retention — Mild facial puffiness obscuring ramus sharpness.`,
      `Sub-optimal Buccal Hollows — Leanness level can be optimized by 3-4% body fat.`,
      `Skin Barrier Texture (${skinQuality}/100) — Minor congestion around T-zone, needs micro-exfoliation.`
    ];

    const recommendations = [
      {
        category: 'Jawline & Bone Structure',
        action: 'Orthotropic Tongue Posture (Mewing)',
        detail: 'Rest the entire posterior third of your tongue flat against the palate roof. Avoid mouth breathing during sleep.',
        impact: '+4.5 Pts Potential',
        difficulty: 'Easy'
      },
      {
        category: 'Debloating & Leanness',
        action: 'Electrolyte Balance & Sodium Flush',
        detail: 'Drink 4L water daily with potassium-rich coconut water. Cut processed sodium to reveal cheekbone hollows.',
        impact: '+5.2 Pts Potential',
        difficulty: 'Medium'
      },
      {
        category: 'Skin Maxxing',
        action: 'Active Retinoid & Micro-Hydration',
        detail: 'Use 0.05% Tretinoin/Retinol 3x weekly + Ceramide barrier cream + Mineral SPF 50 daily to boost collagen.',
        impact: '+6.0 Pts Potential',
        difficulty: 'Easy'
      },
      {
        category: 'Eyes & Eyebrows',
        action: 'Eyebrow Densification & Derma-Rolling',
        detail: 'Apply organic cold-pressed castor oil + minoxidil micro-dosing. Shape upper arch for lower set hooded brow.',
        impact: '+3.8 Pts Potential',
        difficulty: 'Medium'
      },
      {
        category: 'Haircut & Styling',
        action: 'Textured Modern Crop / High Taper Fade',
        detail: `Tailored for ${faceShape} to amplify jawline width and reduce perceived forehead ratio.`,
        impact: '+4.0 Pts Potential',
        difficulty: 'Easy'
      }
    ];

    const scanId = 'scan_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);

    // Save to Cloudflare D1
    await c.env.DB.prepare(`
      INSERT INTO scans (
        id, user_id, overall_score, potential_score,
        jawline_score, cheekbones_score, masculinity_score,
        skin_quality_score, canthal_tilt_score, hair_score,
        symmetry_score, face_shape, archetype,
        strengths_json, flaws_json, recommendations_json,
        image_preview
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      scanId,
      userId,
      overallScore,
      potentialScore,
      jawline,
      cheekbones,
      masculinity,
      skinQuality,
      canthalTilt,
      hair,
      symmetry,
      faceShape,
      archetype,
      JSON.stringify(strengths),
      JSON.stringify(flaws),
      JSON.stringify(recommendations),
      imagePreview ? imagePreview.substring(0, 500) : null
    ).run();

    // Update user stats
    await c.env.DB.prepare(`
      UPDATE users SET
        overall_rating = ?,
        potential_rating = ?,
        tier = ?,
        last_active_date = DATE('now')
      WHERE id = ?
    `).bind(overallScore, potentialScore, tier, userId).run();

    return c.json({
      success: true,
      scan: {
        id: scanId,
        userId,
        overallScore,
        potentialScore,
        tier,
        faceShape,
        archetype,
        ratings: {
          jawline,
          cheekbones,
          masculinity,
          skinQuality,
          canthalTilt,
          hair,
          symmetry
        },
        strengths,
        flaws,
        recommendations,
        createdAt: new Date().toISOString()
      }
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Create and persist scan record in Cloudflare D1
app.post('/api/scans', async (c) => {
  try {
    const body = await c.req.json();
    const scanId = 'scan_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
    const userId = body.userId || body.user_id || 'user_aesthetix_client';
    const username = body.username || 'Aesthetix User';

    // Ensure user exists in users table to satisfy foreign key
    await c.env.DB.prepare(`
      INSERT OR IGNORE INTO users (id, username, streak_days, last_active_date, tier)
      VALUES (?, ?, 1, DATE('now'), 'Harmonious Golden Ratio')
    `).bind(userId, username).run();

    // Parse scores from request
    const overallScore = parseFloat(Number(body.overall_score ?? body.overallScore ?? 84.0).toFixed(1));
    const potentialScore = parseFloat(Number(body.potential_score ?? body.potentialScore ?? (overallScore + 10.0)).toFixed(1));
    const jawlineScore = parseFloat(Number(body.gonial_angle ?? body.jawline_score ?? body.jawlineScore ?? 88.0).toFixed(1));
    const cheekbonesScore = parseFloat(Number(body.cheekbones_score ?? body.cheekbonesScore ?? 85.0).toFixed(1));
    const masculinityScore = parseFloat(Number(body.masculinity_score ?? body.masculinityScore ?? 86.0).toFixed(1));
    const skinQualityScore = parseFloat(Number(body.skin_quality_score ?? body.skinQualityScore ?? 82.0).toFixed(1));

    // Parse canthal tilt (number or string like "+4.6°")
    let canthalTiltVal = body.canthal_tilt ?? body.canthalTilt ?? 86.0;
    if (typeof canthalTiltVal === 'string') {
      const parsed = parseFloat(canthalTiltVal.replace(/[^\d.-]/g, ''));
      canthalTiltVal = isNaN(parsed) ? 86.0 : (parsed < 20 ? (70 + parsed * 4) : parsed);
    }
    const canthalTiltScore = parseFloat(Number(canthalTiltVal).toFixed(1));

    // Parse symmetry score (number or string like "94.2%")
    let symVal = body.symmetry_score ?? body.symmetryScore ?? 92.0;
    if (typeof symVal === 'string') {
      const parsed = parseFloat(symVal.replace(/[^\d.-]/g, ''));
      symVal = isNaN(parsed) ? 92.0 : parsed;
    }
    const symmetryScore = parseFloat(Number(symVal).toFixed(1));

    const hairScore = parseFloat(Number(body.hair_score ?? body.hairScore ?? 85.0).toFixed(1));
    const faceShape = String(body.face_shape ?? body.faceShape ?? 'Balanced Oval');
    const archetype = String(body.archetype ?? 'Classical Golden Proportion');

    const strengths = body.strengths || [
      `High Bilateral Symmetry Index evaluated at ${symmetryScore}%.`,
      `Optimal mandibular jawline structure with defined gonial angle.`,
      `Balanced canthal axis vector.`
    ];

    const flaws = body.flaws || body.opportunities || [
      `Optical balance can be enhanced with shape-matched haircut contouring.`
    ];

    const recommendations = body.recommendations || [
      {
        category: 'Optical Grooming',
        action: 'Geometric Hair & Eyewear Matching',
        detail: `Tailored for ${faceShape} to optimize Golden Ratio harmony.`,
        impact: '+4.5 Pts Potential'
      }
    ];

    const imagePreview = body.image_preview || body.imagePreview || null;
    const createdAt = body.timestamp || new Date().toISOString();

    // Insert into Cloudflare D1 'scans' table
    await c.env.DB.prepare(`
      INSERT INTO scans (
        id, user_id, overall_score, potential_score,
        jawline_score, cheekbones_score, masculinity_score,
        skin_quality_score, canthal_tilt_score, hair_score,
        symmetry_score, face_shape, archetype,
        strengths_json, flaws_json, recommendations_json,
        image_preview, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      scanId,
      userId,
      overallScore,
      potentialScore,
      jawlineScore,
      cheekbonesScore,
      masculinityScore,
      skinQualityScore,
      canthalTiltScore,
      hairScore,
      symmetryScore,
      faceShape,
      archetype,
      JSON.stringify(strengths),
      JSON.stringify(flaws),
      JSON.stringify(recommendations),
      imagePreview ? imagePreview.substring(0, 500) : null,
      createdAt
    ).run();

    // Update user profile in D1
    await c.env.DB.prepare(`
      UPDATE users SET
        overall_rating = ?,
        potential_rating = ?,
        tier = 'Harmonious Golden Ratio',
        last_active_date = DATE('now')
      WHERE id = ?
    `).bind(overallScore, potentialScore, userId).run();

    return c.json({
      status: "success",
      message: "Scan saved to D1 database",
      scan_id: scanId,
      data: {
        id: scanId,
        overall_score: overallScore,
        face_shape: faceShape,
        created_at: createdAt
      }
    }, 200);
  } catch (err: any) {
    return c.json({ status: "error", error: err.message }, 500);
  }
});

// Get user scan history
app.get('/api/scans', async (c) => {
  try {
    const userId = c.req.query('userId') || 'user_guest';
    const results = await c.env.DB.prepare(`
      SELECT * FROM scans WHERE user_id = ? ORDER BY created_at DESC LIMIT 20
    `).bind(userId).all();

    const scans = results.results.map((r: any) => ({
      ...r,
      strengths: JSON.parse(r.strengths_json || '[]'),
      flaws: JSON.parse(r.flaws_json || '[]'),
      recommendations: JSON.parse(r.recommendations_json || '[]')
    }));

    return c.json({ success: true, scans });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Get single scan
app.get('/api/scans/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const r: any = await c.env.DB.prepare('SELECT * FROM scans WHERE id = ?').bind(id).first();
    if (!r) return c.json({ success: false, error: 'Scan not found' }, 404);

    return c.json({
      success: true,
      scan: {
        ...r,
        strengths: JSON.parse(r.strengths_json || '[]'),
        flaws: JSON.parse(r.flaws_json || '[]'),
        recommendations: JSON.parse(r.recommendations_json || '[]')
      }
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Habits tracker
app.get('/api/habits', async (c) => {
  try {
    const userId = c.req.query('userId') || 'user_guest';
    const habits = await c.env.DB.prepare('SELECT * FROM habits WHERE user_id = ? ORDER BY category ASC').bind(userId).all();
    return c.json({ success: true, habits: habits.results });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Toggle habit completion
app.post('/api/habits/:id/toggle', async (c) => {
  try {
    const id = c.req.param('id');
    const habit: any = await c.env.DB.prepare('SELECT * FROM habits WHERE id = ?').bind(id).first();
    if (!habit) return c.json({ success: false, error: 'Habit not found' }, 404);

    const newStatus = habit.completed ? 0 : 1;
    await c.env.DB.prepare('UPDATE habits SET completed = ? WHERE id = ?').bind(newStatus, id).run();

    return c.json({ success: true, id, completed: newStatus === 1 });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Community leaderboard
app.get('/api/leaderboard', async (c) => {
  try {
    const results = await c.env.DB.prepare('SELECT * FROM leaderboards ORDER BY overall_score DESC LIMIT 20').all();
    return c.json({ success: true, leaderboard: results.results });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

export default app;
